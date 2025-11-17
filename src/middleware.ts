import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const {pathname} = request.nextUrl;

  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  if (!token) {
    if (isProtectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // If we have a token, verify it
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-fallback-secret'
    );
    await jose.jwtVerify(token, secret);

    // If user is authenticated and tries to access login/register, redirect to dashboard
    if (isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    // Token is invalid, clear it and redirect to login if on a protected route
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    const response = isProtectedRoute ? NextResponse.redirect(url) : NextResponse.next();
    
    response.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
    });

    if(isProtectedRoute){
        return NextResponse.redirect(url);
    }

    return response;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};