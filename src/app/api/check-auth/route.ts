import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return NextResponse.json({ isAuthenticated: false, error: 'JWT Secret not configured on server.' }, { status: 500 });
    }
    
    jwt.verify(token, secret);
    
    return NextResponse.json({ isAuthenticated: true });
  } catch (error) {
    // Token is invalid or expired
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}
