// @vitest-environment node
//
// The admin session contract. The cookie is "<exp>.<HMAC-SHA256(exp)>" signed
// with SESSION_SECRET through Web Crypto, so the same code runs in the Edge
// proxy and in Node server actions. These cases are the contract the old site
// shipped with; the rebuild keeps every one of them.
import { describe, it, expect } from 'vitest';
import {
  createSession,
  verifySession,
  secretsMatch,
  sessionCookieOptions,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
} from '../session';

const SECRET = 'test-secret';

describe('createSession / verifySession', () => {
  it('accepts a freshly created session', async () => {
    const session = await createSession(SECRET);
    expect(await verifySession(session, SECRET)).toBe(true);
  });

  it('encodes the expiry as epoch seconds, seven days out by default', async () => {
    const now = 1_700_000_000_000;
    const session = await createSession(SECRET, SESSION_TTL_SECONDS, now);
    const [exp] = session.split('.');
    expect(Number(exp)).toBe(now / 1000 + SESSION_TTL_SECONDS);
  });

  it('rejects an expired session', async () => {
    const tenSecondsAgo = Date.now() - 10_000;
    const session = await createSession(SECRET, 5, tenSecondsAgo);
    expect(await verifySession(session, SECRET)).toBe(false);
  });

  it('rejects a tampered expiry', async () => {
    const session = await createSession(SECRET);
    const [exp, signature] = session.split('.');
    const forged = `${Number(exp) + 99_999}.${signature}`;
    expect(await verifySession(forged, SECRET)).toBe(false);
  });

  it('rejects the legacy forgeable cookie value', async () => {
    expect(await verifySession('1', SECRET)).toBe(false);
  });

  it('rejects a session signed with a different secret', async () => {
    const session = await createSession('other-secret');
    expect(await verifySession(session, SECRET)).toBe(false);
  });

  it('rejects undefined and malformed values', async () => {
    expect(await verifySession(undefined, SECRET)).toBe(false);
    expect(await verifySession('', SECRET)).toBe(false);
    expect(await verifySession('no-dot-here', SECRET)).toBe(false);
    expect(await verifySession('.signature-only', SECRET)).toBe(false);
    expect(await verifySession('abc.def', SECRET)).toBe(false);
  });
});

describe('secretsMatch', () => {
  it('matches identical secrets', async () => {
    expect(await secretsMatch('token-123', 'token-123', SECRET)).toBe(true);
  });

  it('rejects different secrets, including different lengths', async () => {
    expect(await secretsMatch('token-123', 'token-124', SECRET)).toBe(false);
    expect(await secretsMatch('short', 'much-longer-token', SECRET)).toBe(false);
    expect(await secretsMatch('', 'token', SECRET)).toBe(false);
  });
});

describe('sessionCookieOptions', () => {
  it('names the cookie freeband_admin and locks it to httpOnly, lax, path=/', () => {
    expect(SESSION_COOKIE).toBe('freeband_admin');
    expect(sessionCookieOptions()).toMatchObject({
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
    });
    expect(SESSION_TTL_SECONDS).toBe(7 * 24 * 60 * 60);
  });
});
