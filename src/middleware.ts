import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-fallback-secret'
  );

  const {pathname} = request.nextUrl;

  // Si no hay token y la ruta es protegida, redirigir a login
  if (!token && pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Si hay token, validar
  if (token) {
    try {
      await jose.jwtVerify(token, secret);

      // Si el usuario está autenticado e intenta acceder a /login o /register, redirigir al dashboard
      if (pathname === '/login' || pathname === '/register') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    } catch (error) {
      // Token inválido, si está en una ruta protegida, redirigir a login
      if (pathname.startsWith('/dashboard')) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        const response = NextResponse.redirect(url);
        // Borrar la cookie inválida
        response.cookies.delete('token');
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
