// src/proxy.ts
// The gate on /orcamento/*. A valid signed cookie passes. A legacy share link
// (/orcamento/<token>) whose token matches ORCAMENTO_TOKEN is exchanged for a
// cookie and redirected, so the secret leaves the address bar. Anything else
// goes to /admin. Missing SESSION_SECRET fails closed.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, createSession, secretsMatch, sessionCookieOptions, verifySession } from '@/lib/session';

export async function proxy(request: NextRequest) {
  const secret = process.env.SESSION_SECRET;
  const expectedToken = process.env.ORCAMENTO_TOKEN;
  const loginUrl = new URL('/admin', request.url);

  if (!secret) return NextResponse.redirect(loginUrl);

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (await verifySession(cookie, secret)) return NextResponse.next();

  // Exactly one segment after /orcamento is a candidate token.
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  if (segments.length === 2 && expectedToken && (await secretsMatch(segments[1], expectedToken, secret))) {
    const response = NextResponse.redirect(new URL('/orcamento', request.url));
    response.cookies.set(SESSION_COOKIE, await createSession(secret), sessionCookieOptions());
    return response;
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: '/orcamento/:path*',
};
