import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const {pathname} = request.nextUrl;

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isProtectedRoute = pathname.startsWith('/dashboard');

  const secretString = process.env.JWT_SECRET;
  if (!secretString) {
    console.error('JWT_SECRET is not defined in environment variables');
    // In a real scenario, you might want to redirect to an error page or just deny access
    // For now, we'll redirect to login as if there's no valid session.
    if (isProtectedRoute) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
  const secret = new TextEncoder().encode(secretString);

  // If there's no token and user tries to access a protected route
  if (!token && isProtectedRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // If there is a token
  if (token) {
    try {
      // Verify token
      await jose.jwtVerify(token, secret);

      // If token is valid and user is on an auth route, redirect to dashboard
      if (isAuthRoute) {
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = '/dashboard';
        return NextResponse.redirect(dashboardUrl);
      }

    } catch (error) {
      // Token is invalid, if on a protected route, redirect to login and clear corrupt cookie
      if (isProtectedRoute) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        const response = NextResponse.redirect(loginUrl);
        response.cookies.set('token', '', {path: '/', expires: new Date(0)});
        return response;
      }
    }
  }

  // Allow the request to proceed
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
     * - The root path '/'
     */
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};
