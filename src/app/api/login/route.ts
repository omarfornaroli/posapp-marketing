import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
import {connectToDatabase} from '@/lib/mongodb';
import User from '@/models/user';

const loginSchema = z.object({
  email: z.string().email('El email no es válido.'),
  password: z.string().min(1, 'La contraseña es requerida.'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {success: false, message: 'Datos de inicio de sesión inválidos.'},
        {status: 400}
      );
    }

    const {email, password} = validation.data;

    await connectToDatabase();

    const user = await User.findOne({email});

    if (!user) {
      return NextResponse.json(
        {success: false, message: 'Credenciales incorrectas.'},
        {status: 401}
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {success: false, message: 'Credenciales incorrectas.'},
        {status: 401}
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {userId: user._id, email: user.email},
      process.env.JWT_SECRET || 'your-fallback-secret',
      {expiresIn: '1d'}
    );

    const response = NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      redirectTo: '/dashboard', // Tell the client where to go
    });

    // Set token in a httpOnly cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Ocurrió un error en el servidor.',
      },
      {status: 500}
    );
  }
}
