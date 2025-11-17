import {NextResponse} from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Cierre de sesión exitoso.',
    });

    // Clear the token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0), // Set expiry date to the past
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Ocurrió un error en el servidor.',
      },
      {status: 500}
    );
  }
}
