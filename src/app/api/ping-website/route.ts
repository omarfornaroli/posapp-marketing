
'use server';

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

const pingSchema = z.object({
  url: z.string().url('Se requiere una URL válida.'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = pingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, online: false, message: 'URL inválida.' }, { status: 400 });
    }

    const { url } = validation.data;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      redirect: 'follow', // Follow redirects
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return NextResponse.json({ success: true, online: true });
    } else {
      return NextResponse.json({ success: true, online: false, status: response.status });
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json({ success: false, online: false, message: 'Timeout: La solicitud tardó demasiado.' }, { status: 504 });
    }
    return NextResponse.json({ success: false, online: false, message: 'Error de red o el sitio no es accesible.' }, { status: 500 });
  }
}
