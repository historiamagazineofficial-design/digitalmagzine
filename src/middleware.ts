import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle Admin Protection & Ignore Admin for Localization
  if (pathname.startsWith('/admin')) {
    if (pathname !== '/admin/login') {
      const session = request.cookies.get('historia_session');
      if (!session) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  // 2. Handle Localization for all other routes
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /.*\\..* (static files)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
