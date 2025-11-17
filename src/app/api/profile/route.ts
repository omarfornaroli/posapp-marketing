'use server';

import {NextResponse, type NextRequest} from 'next/server';
import jwt from 'jsonwebtoken';
import {connectToDatabase} from '@/lib/mongodb';
import User from '@/models/user';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        {success: false, message: 'No autenticado.'},
        {status: 401}
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[API Profile] JWT_SECRET no está configurado.');
      return NextResponse.json(
        {success: false, message: 'Error de configuración del servidor.'},
        {status: 500}
      );
    }

    const decoded = jwt.verify(token, secret) as {userId: string};
    
    await connectToDatabase();
    
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        {success: false, message: 'Usuario no encontrado.'},
        {status: 404}
      );
    }
    
    return NextResponse.json({
        success: true,
        profile: {
            name: user.email, // Placeholder for a real name field
            email: user.email,
            businessName: user.businessName,
            businessIndustry: user.businessIndustry,
            businessAddress: user.businessAddress,
            avatar: `https://picsum.photos/seed/${decoded.userId}/100/100`,
        }
    });

  } catch (error: any) {
    console.error('[API Profile] Error:', error.message);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return NextResponse.json({ success: false, message: 'Token inválido o expirado.' }, { status: 401 });
    }
    return NextResponse.json(
      {success: false, message: 'Ocurrió un error en el servidor.'},
      {status: 500}
    );
  }
}
