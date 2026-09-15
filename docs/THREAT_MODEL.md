# Threat Model: Authentication & Session Architecture

**Project:** `freeband-nextjs`
**Target Component:** the production login (`/admin`), the signed session cookie, and the gate on the proposal editor (`/orcamento`)
**Methodology:** STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)
**Last reconciled with the code:** 2026-09-15

---

## 1. System Overview & Boundaries

The site is public and static. The one protected surface is `/orcamento`, an
in-browser proposal editor with no server-side data: it reads copy and prices
from the repository and produces a printed page or a PDF on the client. There
is no CMS, no media upload and no API that mutates state. Being logged in
grants the editor and nothing else.

```
[ Client Browser ]
        │  ▲
        │  │  Cookie: __Host-freeband_admin (HttpOnly; Secure; SameSite=Lax; Path=/)
        ▼  │
[ Next.js Edge proxy — src/proxy.ts, matcher /orcamento/:path* ]
        │
        ├──► sessionExpiry(cookie, SESSION_SECRET) ──► HMAC-SHA256 (Web Crypto) + constant-time compare
        │        └─ re-issues the cookie in its last day
        ├──► /orcamento/<token> ──► secretsMatch(token, ORCAMENTO_TOKEN) ──► cookie + redirect
        │        └─ FailureLimiter per address + shared bucket
        └──► anything else ──► redirect /admin
        │
[ Node runtime ]
        ├──► src/app/orcamento/page.tsx ──► verifies the same cookie again, or redirects to /admin
        └──► src/app/admin/actions.ts ──► loginAction: FailureLimiter, secretsMatch(password), cookie
                                          logoutAction: deletes the cookie
```

Environment: `SESSION_SECRET` (HMAC key), `ADMIN_PASSWORD`, `ORCAMENTO_TOKEN`
(legacy share links). A missing `SESSION_SECRET` fails closed: the proxy
redirects to `/admin` and the login refuses to issue a session.

---

## 2. STRIDE Threat Analysis & Defensive Mitigations

| STRIDE Category | Identified Threat Vector | Architectural Mitigation | Verifiable Test / Implementation |
| :--- | :--- | :--- | :--- |
| **Spoofing (S)** | Forging the session cookie, or presenting the old unauthenticated value (`"1"`). | Cookie value is `<exp>.<HMAC-SHA256(exp)>` signed with `SESSION_SECRET`; a sibling host cannot plant one because of the `__Host-` prefix. | `src/lib/__tests__/session.test.ts` ("rejects the legacy forgeable cookie value", "signed with a different secret", "__Host- prefix in production only") |
| **Tampering (T)** | Extending a session by editing its expiry. | The expiry is the signed payload; changing it invalidates the MAC. | `session.test.ts` ("rejects a tampered expiry") |
| **Repudiation (R)** | Not applicable: no server-side state is mutated by the protected area. Failed logins are counted, not logged with identities. | — | `src/app/admin/actions.ts` |
| **Information Disclosure (I)** | Reading the cookie from JavaScript (XSS); learning which server variable is missing; timing side channels on the password or token compare. | `httpOnly`, `secure` in production, `sameSite=lax`; a static Content-Security-Policy (`frame-ancestors 'none'`, `object-src 'none'`, no third-party scripts) and HSTS; a generic "unavailable" message with the detail in the server log; both compared values are HMACed first so the final comparison runs over digests of equal length. | `src/lib/session.ts` (`secretsMatch`, `timingSafeEqualStr`), `next.config.ts` headers, `session.test.ts` ("cookie flags") |
| **Denial of Service (D)** | Online guessing of the password or of the legacy URL token; growing the limiter's memory with rotated forwarded addresses. | `FailureLimiter`: five failures per client address and fifty across all addresses per fifteen minutes, expired windows swept on every call; the address comes from `x-real-ip` (platform-verified on Vercel) before `x-forwarded-for`; a fixed 400 ms delay on a wrong password. | `src/lib/__tests__/rateLimit.test.ts`, `proxy.test.ts` ("throttles repeated guesses") |
| **Elevation of Privilege (E)** | Reaching the editor without passing the proxy (a middleware bypass). | The page itself verifies the cookie and redirects; the proxy is the first gate, not the only one. | `src/app/orcamento/page.tsx`, `proxy.test.ts` (every branch of the gate) |

---

## 3. Cryptographic Primitives & Design Choices

1. **HMAC-SHA-256 over plain hashing.** Only a holder of `SESSION_SECRET` can produce a valid signature; the key never leaves the server.
2. **Web Crypto, not `node:crypto`.** The proxy runs on the Edge runtime, where `crypto.timingSafeEqual` does not exist. `src/lib/session.ts` uses `crypto.subtle` and its own XOR loop over two base64url digests of identical length, so one implementation serves both runtimes and the length check leaks nothing.
3. **Double-HMAC before comparing secrets.** Password and token candidates are MACed alongside the expected value, so the comparison always runs over equal-length digests.
4. **Stateless expiry with a sliding last day.** The expiry is encoded in the cookie; a session used in its final day is re-issued. Individual revocation is not possible before expiry; rotating `SESSION_SECRET` revokes every session at once.

---

## 4. Known Limitations

- **Per-instance limiter.** Failure counts live in process memory: on a serverless host every instance keeps its own, and a restart clears them. A durable shared store would be the next step if the threat model ever needs it.
- **Forwarded address trust.** Behind any proxy other than Vercel's, `x-real-ip`/`x-forwarded-for` are only as trustworthy as that proxy; the shared bucket is what holds when they are forged.
- **Legacy token in the URL.** `/orcamento/<token>` is exchanged and redirected at once, but the URL still reaches browser history and access logs. Retiring the link in favour of the login is the recommendation.
- **No per-request CSP nonce.** The site is prerendered; a nonce would force dynamic rendering of every page. The static policy therefore keeps `'unsafe-inline'` for the scripts Next.js itself inlines and for style attributes.
