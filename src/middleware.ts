import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  console.log(`\n[Middleware] Pathname: ${pathname}`);

  const token = request.cookies.get('token')?.value;
  console.log(`[Middleware] Token from cookie: ${token ? `"${token.substring(0, 15)}..."` : 'Not found'}`);
  
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isProtectedRoute = pathname.startsWith('/dashboard');

  const secretString = process.env.JWT_SECRET;
  if (!secretString) {
    console.error('[Middleware] CRITICAL: JWT_SECRET is not defined in environment variables. Aborting auth check.');
    // If secret is missing, don't allow access to protected routes
    if (isProtectedRoute) {
        console.log('[Middleware] Redirecting to /login because JWT_SECRET is missing.');
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
  
  console.log(`[Middleware] JWT_SECRET is ${secretString ? 'found.' : 'NOT FOUND.'}`);
  const secret = new TextEncoder().encode(secretString);

  // If there's no token and user tries to access a protected route, redirect to login
  if (!token && isProtectedRoute) {
    console.log('[Middleware] No token found. Redirecting to /login.');
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // If there is a token, verify it
  if (token) {
    try {
      await jose.jwtVerify(token, secret);
      console.log('[Middleware] JWT verification successful.');

      // If token is valid and user is on an auth route (login/register), redirect to dashboard
      if (isAuthRoute) {
        console.log('[Middleware] User is authenticated. Redirecting from auth route to /dashboard.');
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = '/dashboard';
        return NextResponse.redirect(dashboardUrl);
      }
    } catch (error) {
      console.error('[Middleware] JWT verification failed:', (error as Error).message);
      
      // If token is invalid and user is on a protected route, redirect to login and clear the corrupt cookie
      if (isProtectedRoute) {
        console.log('[Middleware] Invalid token. Redirecting to /login and clearing cookie.');
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        const response = NextResponse.redirect(loginUrl);
        response.cookies.set('token', '', {path: '/', expires: new Date(0)});
        return response;
      }
    }
  }

  console.log('[Middleware] No redirection needed. Allowing request to proceed.');
  return NextResponse.next();
}

// Define which routes the middleware should run on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};
