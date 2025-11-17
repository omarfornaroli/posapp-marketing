import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const {pathname} = request.nextUrl;

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isProtectedRoute = pathname.startsWith('/dashboard');

  // This is the secret key used to sign the JWT.
  // It MUST be loaded from environment variables.
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-fallback-secret'
  );

  // If trying to access a protected route
  if (isProtectedRoute) {
    if (!token) {
      // No token, redirect to login
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify token
      await jose.jwtVerify(token, secret);
      // Token is valid, allow access
      return NextResponse.next();
    } catch (error) {
      // Token is invalid, redirect to login and clear the corrupt cookie
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set('token', '', {path: '/', expires: new Date(0)});
      return response;
    }
  }

  // If trying to access an auth route (login/register)
  if (isAuthRoute) {
    if (token) {
      try {
        // If there's a valid token, user is already logged in
        await jose.jwtVerify(token, secret);
        // Redirect to dashboard
        const dashboardUrl = request.nextUrl.clone();
        dashboardUrl.pathname = '/dashboard';
        return NextResponse.redirect(dashboardUrl);
      } catch (error) {
        // Token is invalid, allow access to auth route but clear cookie
        const response = NextResponse.next();
        response.cookies.set('token', '', {path: '/', expires: new Date(0)});
        return response;
      }
    }
  }

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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};