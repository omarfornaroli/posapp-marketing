import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  console.log('[API Check-Auth] Request received.');
  
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    console.log('[API Check-Auth] Token not found in Authorization header.');
    return NextResponse.json({ isAuthenticated: false, reason: 'Token not found' });
  }

  console.log('[API Check-Auth] Token found:', token.substring(0, 15) + '...');

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('[API Check-Auth] JWT_SECRET is not configured on the server.');
        return NextResponse.json({ isAuthenticated: false, reason: 'Server not configured' });
    }
    console.log('[API Check-Auth] Verifying token with secret.');
    jwt.verify(token, secret);
    console.log('[API Check-Auth] Token is valid.');
    return NextResponse.json({ isAuthenticated: true });
  } catch (error: any) {
    console.error('[API Check-Auth] Token verification failed:', error.message);
    return NextResponse.json({ isAuthenticated: false, reason: 'Token invalid or expired' });
  }
}
