import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Protect Admin UI Routes
  if (pathname.startsWith('/chief')) {
    // Exception: Allow the login page itself
    if (pathname === '/chief/login') {
      // If we are already logged in and try to access login, redirect to dashboard
      const session = request.cookies.get('inkspire_session');
      if (session && session.value === 'authenticated') {
        return NextResponse.redirect(new URL('/chief', request.url));
      }
      return NextResponse.next();
    }

    const session = request.cookies.get('inkspire_session');

    if (!session || session.value !== 'authenticated') {
      // User is not authenticated, redirect to login
      const loginUrl = new URL('/chief/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect Admin API Routes
  const isApiRequest = pathname.startsWith('/api');
  if (isApiRequest) {
    // Define precisely which API paths and methods are PUBLIC
    const method = request.method;
    
    // Check for public GET routes
    const isPublicGet = (
      pathname.startsWith('/api/articles') ||
      pathname.startsWith('/api/voices') ||
      pathname.startsWith('/api/tags') ||
      pathname.startsWith('/api/settings') ||
      pathname.startsWith('/api/hero-config') ||
      (pathname.startsWith('/api/comments') && request.nextUrl.searchParams.has('article'))
    ) && method === 'GET';

    // Check for other specific public routes
    const isPublicPost = (
      pathname === '/api/login' ||
      pathname === '/api/comments' // Allow public to post comments
    ) && method === 'POST';

    const isPublicLogout = pathname === '/api/logout' && method === 'POST';

    // If it's not a public route, require authentication
    if (!isPublicGet && !isPublicPost && !isPublicLogout) {
      const session = request.cookies.get('inkspire_session');
      if (!session || session.value !== 'authenticated') {
        return NextResponse.json(
          { error: 'Unauthorized sequence detected. Access Denied.' },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/chief/:path*',
    '/api/:path*'
  ],
};
