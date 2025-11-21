'use server';

import {NextResponse, type NextRequest} from 'next/server';
import {MercadoPagoConfig, PreApproval} from 'mercadopago';
import Enterprise from '@/models/enterprise';
import Subscription from '@/models/subscription';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
  });

  try {
    const { preapproval_id } = await request.json();

    if (!preapproval_id) {
        return NextResponse.json({ success: false, message: 'Falta el ID de pre-aprobación.' }, { status: 400 });
    }

    await connectToDatabase();

    const preApproval = new PreApproval(mpClient);
    const approvalData = await preApproval.get({ id: preapproval_id });

    if (approvalData && approvalData.status === 'authorized') {
        const subscription = await Subscription.findOne({ preapproval_id: preapproval_id });

        if (subscription) {
            subscription.status = 'Activa';
            await subscription.save();
            return NextResponse.json({ success: true, message: 'Suscripción activada con éxito.', status: 'Activa' });
        } else {
             // Fallback: find by email if preapproval_id wasn't saved correctly
            const enterprise = await Enterprise.findOne({ email: approvalData.payer_email }).populate('subscription');
            if (enterprise && enterprise.subscription) {
                (enterprise.subscription as any).status = 'Activa';
                (enterprise.subscription as any).preapproval_id = preapproval_id;
                await (enterprise.subscription as any).save();
                return NextResponse.json({ success: true, message: 'Suscripción activada con éxito.', status: 'Activa' });
            }
             return NextResponse.json({ success: false, message: 'No se encontró la suscripción para actualizar.' }, { status: 404 });
        }
    } else {
         return NextResponse.json({ success: false, message: 'La suscripción no está autorizada o no se encontró.', status: approvalData.status });
    }

  } catch (error: any) {
    console.error('[API CheckSubscriptionStatus] Error:', error);
    let errorMessage = 'Ocurrió un error al verificar la suscripción.';
     if (error.cause) {
        const errorInfo = error.cause.data || {};
        errorMessage = errorInfo.message || error.cause.message || errorMessage;
    }
    return NextResponse.json(
      {success: false, message: errorMessage},
      {status: 500}
    );
  }
}
