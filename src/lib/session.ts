// src/lib/session.ts
// Signed admin session cookie using Web Crypto (crypto.subtle), so the same
// implementation works in the Next.js proxy and in server actions.
//
// Cookie format: "<expEpochSeconds>.<base64url HMAC-SHA256 of exp>"
// Forging it requires SESSION_SECRET; tampering with exp breaks the MAC.

export const SESSION_COOKIE = "freeband_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  };
}

const encoder = new TextEncoder();

function base64url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return base64url(signature);
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
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

export async function verifySession(
  value: string | undefined,
  secret: string,
  now: number = Date.now(),
): Promise<boolean> {
  if (!value) return false;
  const dot = value.indexOf(".");
  if (dot <= 0) return false;
  const expStr = value.slice(0, dot);
  const signature = value.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < now) return false;
  const expected = await hmac(expStr, secret);
  return timingSafeEqualStr(signature, expected);
}

// Compares two secrets (password vs expected, URL token vs expected) without
// leaking where they differ: both sides are MACed first, which equalizes
// length and makes the final comparison constant-time.
export async function secretsMatch(
  candidate: string,
  expected: string,
  secret: string,
): Promise<boolean> {
  const [a, b] = await Promise.all([
    hmac(candidate, secret),
    hmac(expected, secret),
  ]);
  return timingSafeEqualStr(a, b);
}
