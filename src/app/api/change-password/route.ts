'use server';

import {NextResponse, type NextRequest} from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {z} from 'zod';
import {connectToDatabase} from '@/lib/mongodb';
import Enterprise from '@/models/enterprise';

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida.'),
    newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres.'),
}).refine(data => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(data.newPassword);
}, {
    message: "La nueva contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.",
    path: ["newPassword"],
});


export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({success: false, message: 'No autenticado.'}, {status: 401});
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[API ChangePassword] JWT_SECRET no está configurado.');
      return NextResponse.json({success: false, message: 'Error de configuración del servidor.'}, {status: 500});
    }

    const decoded = jwt.verify(token, secret) as {userId: string};

    const body = await request.json();
    const validation = changePasswordSchema.safeParse(body);

    if (!validation.success) {
      const errorMessages = validation.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({success: false, message: `Datos inválidos: ${errorMessages}`}, {status: 400});
    }

    const {currentPassword, newPassword} = validation.data;

    await connectToDatabase();
    
    const user = await Enterprise.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({success: false, message: 'Usuario no encontrado.'}, {status: 404});
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
        return NextResponse.json({success: false, message: 'La contraseña actual es incorrecta.'}, {status: 403});
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return NextResponse.json({success: true, message: 'Contraseña actualizada con éxito.'});

  } catch (error: any) {
    console.error('[API ChangePassword] Error:', error.message);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({success: false, message: 'Token inválido o expirado.'}, {status: 401});
    }
    return NextResponse.json({success: false, message: 'Ocurrió un error en el servidor.'}, {status: 500});
  }
}
