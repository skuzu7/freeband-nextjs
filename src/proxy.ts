import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSession,
  verifySession,
  secretsMatch,
} from '@/lib/session';

export async function proxy(request: NextRequest) {
  const secret = process.env.SESSION_SECRET;
  const expectedToken = process.env.ORCAMENTO_TOKEN;
  const loginUrl = new URL('/admin', request.url);

  // Fail closed when the deployment is missing its secrets.
  if (!secret) {
    return NextResponse.redirect(loginUrl);
  }

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (await verifySession(cookie, secret)) {
    return NextResponse.next();
  }

  // Legacy share links: /orcamento/<token>, exactly one extra segment.
  // A valid token is exchanged for a signed session cookie and redirected,
  // so the secret leaves the address bar.
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  if (segments.length === 2 && expectedToken) {
    if (await secretsMatch(segments[1], expectedToken, secret)) {
      const response = NextResponse.redirect(new URL('/orcamento', request.url));
      response.cookies.set(SESSION_COOKIE, await createSession(secret), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_TTL_SECONDS,
        path: '/',
      });
      return response;
    }
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: '/orcamento/:path*',
};
