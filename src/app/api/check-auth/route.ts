import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  // The correct way to access cookies in an API Route is via the request object.
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-fallback-secret';
    jwt.verify(token, secret);
    return NextResponse.json({ isAuthenticated: true });
  } catch (error) {
    // Token is invalid or expired
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}
