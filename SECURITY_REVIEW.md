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
  in production;
- fail-closed behavior when required secrets are absent;
- per-client login throttling;
- middleware enforcement for the protected admin route;
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
