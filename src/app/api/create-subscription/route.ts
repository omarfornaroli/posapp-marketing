
'use server';

import {NextResponse, type NextRequest} from 'next/server';
import jwt from 'jsonwebtoken';
import {MercadoPagoConfig, PreApproval} from 'mercadopago';
import Enterprise from '@/models/enterprise';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
  });

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
    console.error('[API CreateSubscription] JWT_SECRET no está configurado.');
    return NextResponse.json(
      {success: false, message: 'Error de configuración del servidor.'},
      {status: 500}
    );
  }

  try {
    const decoded = jwt.verify(token, secret) as {userId: string; email?: string};
    let userEmail = decoded.email;

    if (!userEmail) {
        await connectToDatabase();
        const user = await Enterprise.findById(decoded.userId);
        if (!user) {
             return NextResponse.json({success: false, message: 'Usuario no encontrado.'}, {status: 404});
        }
        userEmail = user.email;
    }

    const preApproval = new PreApproval(mpClient);

    const subscription = await preApproval.create({
      body: {
        back_url: `${process.env.APP_URL}/dashboard/subscription`,
        reason: 'Suscripción a Posify',
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: 40000,
          currency_id: 'ARS',
        },
        payer_email: userEmail,
        status: 'pending',
      },
    });
    
    if (subscription.init_point) {
        return NextResponse.json({ success: true, init_point: subscription.init_point });
    } else {
        console.error("MercadoPago API response missing init_point:", subscription);
        return NextResponse.json({ success: false, message: "No se pudo crear el enlace de pago." }, { status: 500 });
    }

  } catch (error: any) {
    console.error('[API CreateSubscription] Error:', error);
    let errorMessage = 'Ocurrió un error al crear la suscripción.';
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        errorMessage = 'Token inválido o expirado.';
    } else if (error.cause) {
        // MercadoPago SDK often wraps errors
        const errorInfo = error.cause.data || {};
        errorMessage = errorInfo.message || error.cause.message || errorMessage;
    }
    
    return NextResponse.json(
      {success: false, message: errorMessage},
      {status: 500}
    );
  }
}
