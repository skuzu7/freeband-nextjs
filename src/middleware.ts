import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only gate /orcamento routes
  if (!request.nextUrl.pathname.startsWith('/orcamento')) {
    return NextResponse.next();
  }

  // Check cookie
  const adminCookie = request.cookies.get('freeband_admin');
  if (adminCookie?.value === '1') {
    return NextResponse.next();
  }

  // Check if URL contains valid token (backward compat)
  const segments = request.nextUrl.pathname.split('/');
  const token = segments[2]; // /orcamento/[token]
  const expectedToken = process.env.ORCAMENTO_TOKEN;
  if (token && expectedToken && token === expectedToken) {
    return NextResponse.next();
  }

  // Redirect to admin login
  return NextResponse.redirect(new URL('/admin', request.url));
}

export const config = {
  matcher: '/orcamento/:path*',
};
