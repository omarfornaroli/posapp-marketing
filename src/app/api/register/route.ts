import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import {z} from 'zod';
import {connectToDatabase} from '@/lib/mongodb';
import User from '@/models/user';
import {OnboardingSchema} from '@/lib/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = OnboardingSchema.safeParse(body);

    if (!validation.success) {
      const errorMessages = validation.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({success: false, message: `Datos inválidos: ${errorMessages}`}, {status: 400});
    }

    const {
      businessName,
      businessAddress,
      businessIndustry,
      email,
      password,
    } = validation.data;
    
    const userEmail = email || 'admin@example.com';
    const userPassword = password || '1234';

    await connectToDatabase();

    const existingUser = await User.findOne({email: userEmail});
    if (existingUser) {
      return NextResponse.json({success: false, message: 'El email ya está registrado.'}, {status: 409});
    }
    
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const newUser = new User({
      businessName,
      businessAddress,
      businessIndustry,
      email: userEmail,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({
      success: true,
      message: '¡Registro completado con éxito!',
    });
  } catch (error) {
    console.error('Registration error:', error);
    let message =
      'Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.';

    // Check for MongoDB duplicate key error (code 11000)
    if (error instanceof Error && (error as any).code === 11000) {
      message = 'El email ya está en uso. Por favor, intente con otro.';
    } else if (error instanceof Error) {
      // Capture a more specific message if available
      message = error.message;
    }
    
    return NextResponse.json({success: false, message}, {status: 500});
  }
}
