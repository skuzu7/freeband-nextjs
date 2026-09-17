# Defensive Security Review — 2026-08-29

## Scope and authorization

This review covers source code in `skuzu7/freeband-nextjs` at baseline commit
`a5bfce871c16bba9e56fd27a32db7b5cadf5cdac` and a maintainer-controlled local
test environment. It does not authorize testing of third-party systems.

Reviewed paths:

- `src/lib/session.ts`
- `src/app/admin/actions.ts`
- `src/proxy.ts`
- security-relevant unit tests under `src/lib/__tests__/`
- direct and transitive npm dependencies

## Verified controls

The implementation includes:

- HMAC-SHA-256 session signatures with explicit expiry;
- constant-work secret comparison before the final equality check;
- `httpOnly`, `sameSite=lax`, path-scoped session cookies, with `secure` enabled
  in production (the `secure` flag itself was not covered by a test at this
  baseline; see the addendum);
- fail-closed behavior when required secrets are absent;
- per-client login throttling;
- middleware enforcement for the protected editor route (`/orcamento/*`; the
  login at `/admin` is public by design);
- immediate exchange of the documented legacy access token for a signed session;
- unit tests for expiry, tampering, malformed values, alternate signing keys,
  the legacy forgeable cookie value, secret comparison, and cookie flags.

## Findings and limitations

### FBR-01 — Per-instance rate limiting

**Severity:** Medium in horizontally scaled or serverless deployments.

The login limiter stores attempts in process memory. Limits are not shared
between instances and reset when a process restarts. For deployments with more
than one instance, use a durable shared store and retain the current local
limiter only as defense in depth.

### FBR-02 — Forwarded client address trust

**Severity:** Low to Medium, deployment-dependent.

The limiter uses the first `x-forwarded-for` value when present. This is safe
only when the trusted edge overwrites or sanitizes that header. Document the
proxy trust boundary and prefer a platform-provided verified client address.

### FBR-03 — Legacy token in URL

**Severity:** Medium.

The compatibility path exchanges the token and redirects immediately, but the
initial URL can still reach browser history or infrastructure access logs.
Migrate integrations to interactive login, make compatibility tokens
short-lived and independently revocable, and redact query strings from logs.

### FBR-04 — Stateless session revocation

**Severity:** Low.

Signed sessions can be revoked globally by rotating `SESSION_SECRET`, but not
individually before expiry. A server-side session identifier or revocation list
would allow targeted invalidation if the threat model requires it.

## Reproducible verification

Executed from a clean dependency install on 2026-08-29:

```text
npm ci          -> success; 0 vulnerabilities
npm test        -> 4 test files passed; 33 tests passed
npm run lint    -> success
npm run typecheck -> success
npm run build   -> success
```

## Retest criteria

A remediation is accepted only when the affected behavior has an automated test
where practical and all five verification commands above complete successfully.

---

## Addendum — retest of 2026-09-15

Baseline for this addendum: branch `claude/project-review-pk0lna`. Findings
FBR-01 to FBR-04 were revisited during a full project review; the items below
were changed in code and are pinned by tests.

| Finding | Status | Change |
| :--- | :--- | :--- |
| FBR-01 per-instance limiting | Mitigated (still per instance) | `src/lib/rateLimit.ts`: expired windows are swept on every call (the map could previously grow without bound), and a bucket shared by every key caps the total; the same limiter now also covers the legacy token path in `src/proxy.ts`, which had no throttle at all. |
| FBR-02 forwarded address trust | Mitigated | The address is read from `x-real-ip` (platform-verified on Vercel) before the first `x-forwarded-for` hop; the shared bucket holds when the header is forged. Trust boundary documented in `docs/THREAT_MODEL.md`. |
| FBR-03 legacy token in URL | Open (documented) | Additionally: the segment is percent-decoded before comparison — a token containing `+`, `/` or `%` could never match before. |
| FBR-04 stateless revocation | Open (documented) | Sessions in their last day are re-issued by the proxy, so a producer is not logged out mid-proposal. |
| New | Fixed | Cookie renamed `__Host-freeband_admin` in production; `/orcamento` verifies the cookie in the page as well as in the proxy; the misconfiguration message no longer names environment variables; `Content-Security-Policy` and `Strict-Transport-Security` added in `next.config.ts`. |

Corrections to the text above: the constant-time comparison is a Web Crypto
double-HMAC with a JavaScript XOR loop (`crypto.timingSafeEqual` is not
available on the Edge runtime); the `secure` flag and the proxy itself were
untested at the 2026-08-29 baseline. Both are now covered by
`src/lib/__tests__/session.test.ts` and `src/lib/__tests__/proxy.test.ts`; the
logout header (`Secure` and `Max-Age=0` on the `__Host-` cookie) is pinned in
`session.test.ts` after the 2026-09-17 pass found logout leaving the session
alive in production.

Executed on 2026-09-15 from a clean install:

```text
npm ci            -> success
npm test          -> 13 test files, 132 tests passed
npm run lint      -> success
npm run typecheck -> success
npm run build     -> success
```
