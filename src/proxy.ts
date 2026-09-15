// src/proxy.ts
// The gate on /orcamento/*. A valid signed cookie passes (and is re-issued
// when it is about to expire). A legacy share link (/orcamento/<token>) whose
// token matches ORCAMENTO_TOKEN is exchanged for a cookie and redirected, so
// the secret leaves the address bar; wrong tokens are throttled like wrong
// passwords. Anything else goes to /admin. Missing SESSION_SECRET fails
// closed. The page itself checks the cookie again (src/app/orcamento/page.tsx):
// the proxy is the first gate, not the only one.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { FailureLimiter, clientAddress } from '@/lib/rateLimit';
import {
  SESSION_REFRESH_SECONDS,
  createSession,
  secretsMatch,
  sessionCookieName,
  sessionCookieOptions,
  sessionExpiry,
} from '@/lib/session';

// Per isolate on the Edge: enough to make guessing a token by URL cost the
// same as guessing a password. See src/lib/rateLimit.ts.
export const tokenLimiter = new FailureLimiter({ maxPerKey: 5, maxTotal: 50, windowMs: 15 * 60 * 1000 });

/** The token as typed, whatever the browser did to it on the way. */
function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export async function proxy(request: NextRequest) {
  const secret = process.env.SESSION_SECRET;
  const expectedToken = process.env.ORCAMENTO_TOKEN;
  const loginUrl = new URL('/admin', request.url);
  const now = Date.now();

  if (!secret) return NextResponse.redirect(loginUrl);

  // Exactly one segment after /orcamento is a legacy share link carrying a
  // candidate token. There is no page at that path: it always ends in a
  // redirect, so a producer who already holds a session and clicks an old
  // link lands on the editor, not on a 404.
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  const isLegacyLink = segments.length === 2;
  const editorUrl = new URL('/orcamento', request.url);
  const cookieName = sessionCookieName();

  const cookie = request.cookies.get(cookieName)?.value;
  const exp = await sessionExpiry(cookie, secret, now);
  if (exp !== null) {
    const response = isLegacyLink ? NextResponse.redirect(editorUrl) : NextResponse.next();
    // A producer who keeps working is not logged out mid-proposal on day
    // seven: the last day of a session buys a fresh one.
    if (exp - now / 1000 < SESSION_REFRESH_SECONDS) {
      response.cookies.set(cookieName, await createSession(secret, undefined, now), sessionCookieOptions());
    }
    return response;
  }

  if (isLegacyLink && expectedToken) {
    const client = clientAddress(request.headers);
    if (tokenLimiter.isLimited(client, now)) return NextResponse.redirect(loginUrl);
    if (await secretsMatch(decodeSegment(segments[1]), expectedToken, secret)) {
      tokenLimiter.succeed(client);
      const response = NextResponse.redirect(editorUrl);
      response.cookies.set(cookieName, await createSession(secret, undefined, now), sessionCookieOptions());
      return response;
    }
    tokenLimiter.fail(client, now);
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: '/orcamento/:path*',
};
