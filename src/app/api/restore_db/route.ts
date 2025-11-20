'use server';

import {NextResponse, type NextRequest} from 'next/server';
import jwt from 'jsonwebtoken';

const MANAGEMENT_API_URL = 'http://168.181.187.83:3000/api/restore_db';

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate the user
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
      console.error('[API RestoreDB] JWT_SECRET no está configurado.');
      return NextResponse.json(
        {success: false, message: 'Error de configuración del servidor.'},
        {status: 500}
      );
    }

    const decoded = jwt.verify(token, secret) as {userId: string};
    const enterpriseId = decoded.userId;

    // 2. Call the external management API
    const managementResponse = await fetch(MANAGEMENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ enterpriseId }),
    });

    // 3. Forward the response from the management API, handling both JSON and text
    const responseText = await managementResponse.text();
    try {
        const responseData = JSON.parse(responseText);
        return NextResponse.json(responseData, {status: managementResponse.status});
    } catch (e) {
        return new NextResponse(responseText, {status: managementResponse.status});
    }

  } catch (error: any) {
    console.error('[API RestoreDB] Error:', error.message);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({success: false, message: 'Token inválido o expirado.'}, {status: 401});
    }
    return NextResponse.json(
      {success: false, message: 'Ocurrió un error en el servidor proxy.'},
      {status: 500}
    );
  }
}
