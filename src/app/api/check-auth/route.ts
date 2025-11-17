import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

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
