
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  console.log(`\n[Middleware] Pathname: ${pathname}`);

  const token = request.cookies.get('token')?.value;
  console.log(`[Middleware] Token from cookie: ${token ? `"${token.substring(0, 15)}..."` : 'Not found'}`);

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isProtectedRoute = pathname.startsWith('/dashboard');

  // If there's no token and user tries to access a protected route, redirect to login
  if (isProtectedRoute && !token) {
    console.log('[Middleware] No token found for protected route. Redirecting to /login.');
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // If there's a token and user is on an auth route (login/register), redirect to dashboard
  if (isAuthRoute && token) {
     console.log('[Middleware] User is authenticated. Redirecting from auth route to /dashboard.');
     const dashboardUrl = request.nextUrl.clone();
     dashboardUrl.pathname = '/dashboard';
     return NextResponse.redirect(dashboardUrl);
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
