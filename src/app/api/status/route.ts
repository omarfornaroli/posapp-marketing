'use server';

import {NextResponse, type NextRequest} from 'next/server';
import jwt from 'jsonwebtoken';

const MANAGEMENT_API_URL = 'http://168.181.187.83:3000/api/status';

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
      console.error('[API Status] JWT_SECRET no está configurado.');
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

    // 3. Forward the response from the management API, which should be JSON
    const responseData = await managementResponse.json();
    return NextResponse.json(responseData, {status: managementResponse.status});


  } catch (error: any) {
    console.error('[API Status] Error:', error.message);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({success: false, message: 'Token inválido o expirado.'}, {status: 401});
    }
    // Handle cases where JSON parsing might fail or network errors
    if (error instanceof SyntaxError) {
        return NextResponse.json({ success: false, message: 'La respuesta del servidor de estado no es un JSON válido.'}, {status: 502 });
    }
    
    return NextResponse.json(
      {success: false, message: 'Ocurrió un error en el servidor proxy de estado.'},
      {status: 500}
    );
  }
}
