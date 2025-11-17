import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  console.log('[API Check-Auth] Request received.');

  const token = request.cookies.get('token')?.value;

  if (!token) {
    console.log('[API Check-Auth] Token not found in cookies.');
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }

  console.log('[API Check-Auth] Token found:', token.substring(0, 30) + '...');

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('[API Check-Auth] JWT_SECRET is not set in environment variables.');
        return NextResponse.json({ isAuthenticated: false, error: 'JWT Secret not configured on server.' }, { status: 500 });
    }
    
    console.log('[API Check-Auth] Verifying token with secret...');
    jwt.verify(token, secret);
    console.log('[API Check-Auth] Token verification successful.');
    
    return NextResponse.json({ isAuthenticated: true });
  } catch (error) {
    console.error('[API Check-Auth] Token verification failed:', error);
    // Token is invalid or expired
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}
