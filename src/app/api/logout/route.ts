import {NextResponse} from 'next/server';

// This route is no longer strictly necessary with localStorage-based auth,
// but we'll keep it for completeness in case it's called.
// The primary logout mechanism is now client-side.
export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Cierre de sesión procesado.',
    });

    // Clear the token cookie if it somehow still exists
    response.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
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
