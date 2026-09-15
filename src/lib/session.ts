// src/lib/session.ts
// The signed admin session cookie, built on Web Crypto (crypto.subtle) so one
// implementation serves both the Edge proxy and Node server actions.
//
// Cookie value: "<expEpochSeconds>.<base64url HMAC-SHA256(exp)>".
// Forging it needs SESSION_SECRET; touching the expiry breaks the MAC.

export const SESSION_COOKIE = 'freeband_admin';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
/** A session with less than this left is re-issued on the next request. */
export const SESSION_REFRESH_SECONDS = 60 * 60 * 24; // 1 day

/**
 * The cookie's name. In production it carries the `__Host-` prefix, which the
 * browser only accepts from a secure origin, without Domain and with path=/,
 * so no sibling host under the domain can plant or overwrite it. Outside
 * production (plain http on localhost) the prefix would make the cookie
 * unsettable, so it is dropped there.
 */
export function sessionCookieName(nodeEnv: string | undefined = process.env.NODE_ENV): string {
  return nodeEnv === 'production' ? `__Host-${SESSION_COOKIE}` : SESSION_COOKIE;
}

export function sessionCookieOptions(nodeEnv: string | undefined = process.env.NODE_ENV) {
  return {
    httpOnly: true,
    secure: nodeEnv === 'production',
    sameSite: 'lax' as const,
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
  };
}

const encoder = new TextEncoder();

function base64url(bytes: ArrayBuffer): string {
  let binary = '';
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return base64url(signature);
}

/**
 * Constant-time comparison of two strings of the same length. The early
 * return on a length mismatch leaks nothing here: every caller passes two
 * base64url digests of the same fixed size.
 */
function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSession(
  secret: string,
  ttlSeconds: number = SESSION_TTL_SECONDS,
  now: number = Date.now(),
): Promise<string> {
  const exp = Math.floor(now / 1000) + ttlSeconds;
  const signature = await hmac(String(exp), secret);
  return `${exp}.${signature}`;
}

/**
 * The expiry (epoch seconds) of a valid, unexpired session cookie value;
 * null for anything else — missing, malformed, tampered, or past its time.
 */
export async function sessionExpiry(
  value: string | undefined,
  secret: string,
  now: number = Date.now(),
): Promise<number | null> {
  if (!value) return null;
  const dot = value.indexOf('.');
  if (dot <= 0) return null;
  const expStr = value.slice(0, dot);
  const signature = value.slice(dot + 1);
  if (!/^\d+$/.test(expStr) || !signature) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < now) return null;
  const expected = await hmac(expStr, secret);
  return timingSafeEqualStr(signature, expected) ? exp : null;
}

export async function verifySession(
  value: string | undefined,
  secret: string,
  now: number = Date.now(),
): Promise<boolean> {
  return (await sessionExpiry(value, secret, now)) !== null;
}

/**
 * Compares two secrets (password vs expected, URL token vs expected) without
 * leaking where they differ: both sides are MACed first, which equalises
 * length and makes the final comparison constant-time.
 */
export async function secretsMatch(candidate: string, expected: string, secret: string): Promise<boolean> {
  const [a, b] = await Promise.all([hmac(candidate, secret), hmac(expected, secret)]);
  return timingSafeEqualStr(a, b);
}
