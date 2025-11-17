import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  console.log('[API Check-Auth] Request received.');
  
  const token = request.cookies.get('token')?.value;

  if (!token) {
    console.log('[API Check-Auth] Token not found in cookies.');
    return NextResponse.json({ isAuthenticated: false, reason: 'Token not found' }, { status: 200 });
  }

  console.log('[API Check-Auth] Token found:', token.substring(0, 15) + '...');

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('[API Check-Auth] JWT_SECRET is not configured on the server.');
        return NextResponse.json({ isAuthenticated: false, reason: 'Server not configured' }, { status: 200 });
    }
    console.log('[API Check-Auth] Verifying token with secret.');
    jwt.verify(token, secret);
    console.log('[API Check-Auth] Token is valid.');
    return NextResponse.json({ isAuthenticated: true });
  } catch (error: any) {
    console.error('[API Check-Auth] Token verification failed:', error.message);
    // Token is invalid or expired
    return NextResponse.json({ isAuthenticated: false, reason: 'Token invalid or expired' }, { status: 200 });
  }
}
