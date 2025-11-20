'use server';

import {NextResponse, type NextRequest} from 'next/server';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
import {connectToDatabase} from '@/lib/mongodb';
import Enterprise from '@/models/enterprise';

const profileUpdateSchema = z.object({
  businessName: z.string().min(2, "El nombre del negocio debe tener al menos 2 caracteres."),
  businessIndustry: z.string().optional(),
  businessAddress: z.string().optional(),
});


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
    
    const user = await Enterprise.findById(decoded.userId).select('-password').populate('deployment');

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
            deployment: user.deployment || null
        }
    });

  } catch (error: any) {
    console.error('[API Profile GET] Error:', error.message);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return NextResponse.json({ success: false, message: 'Token inválido o expirado.' }, { status: 401 });
    }
    return NextResponse.json(
      {success: false, message: 'Ocurrió un error en el servidor.'},
      {status: 500}
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({success: false, message: 'No autenticado.'}, {status: 401});
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[API Profile POST] JWT_SECRET no está configurado.');
      return NextResponse.json({success: false, message: 'Error de configuración del servidor.'}, {status: 500});
    }

    const decoded = jwt.verify(token, secret) as {userId: string};
    
    const body = await request.json();
    const validation = profileUpdateSchema.safeParse(body);

    if (!validation.success) {
      const errorMessages = validation.error.errors.map(e => e.message).join(', ');
      return NextResponse.json({success: false, message: `Datos inválidos: ${errorMessages}`}, {status: 400});
    }
    
    await connectToDatabase();
    
    const user = await Enterprise.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({success: false, message: 'Usuario no encontrado.'}, {status: 404});
    }

    const { businessName, businessIndustry, businessAddress } = validation.data;
    user.businessName = businessName;
    user.businessIndustry = businessIndustry;
    user.businessAddress = businessAddress;
    
    await user.save();

    return NextResponse.json({success: true, message: 'Perfil actualizado con éxito.'});

  } catch (error: any) {
    console.error('[API Profile POST] Error:', error.message);
     if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return NextResponse.json({ success: false, message: 'Token inválido o expirado.' }, { status: 401 });
    }
    return NextResponse.json({success: false, message: 'Ocurrió un error en el servidor.'}, {status: 500});
  }
}
