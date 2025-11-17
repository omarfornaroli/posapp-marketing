import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import {OnboardingSchema} from '@/lib/schema';
import {validateSubscriptionData} from '@/ai/flows/validate-subscription-data';
import {generateSubscriptionRecommendations} from '@/ai/flows/generate-subscription-recommendations';
import {connectToDatabase} from '@/lib/mongodb';
import User from '@/models/user';

export async function POST(request: Request) {
  const body = await request.json();
  const validatedForm = OnboardingSchema.safeParse(body);

  if (!validatedForm.success) {
    return NextResponse.json(
      {success: false, message: 'Datos del formulario inválidos.'},
      {status: 400}
    );
  }

  let data = validatedForm.data;
  
  const isDefaultUser = !data.email || !data.password;
  const userEmail = data.email || 'admin@example.com';
  const userPassword = data.password || '1234';


  // AI validation is not strictly needed for this simplified flow, but we keep it
  try {
    await validateSubscriptionData({
      businessName: data.businessName,
      businessAddress: data.businessAddress || '',
      businessIndustry: data.businessIndustry || '',
      userName: userEmail,
      password: userPassword,
      paymentDetails: 'Mercado Pago',
      termsOfServiceAgreement: data.termsOfServiceAgreement,
    });
  } catch (aiError) {
      console.warn("AI validation call failed, proceeding without it.", aiError)
  }

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({email: userEmail});
    if (existingUser) {
      return NextResponse.json(
        {success: false, message: 'El email ya existe.'},
        {status: 409}
      );
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const newUser = new User({
      businessName: data.businessName,
      businessAddress: data.businessAddress,
      businessIndustry: data.businessIndustry,
      email: userEmail,
      password: hashedPassword,
    });

    await newUser.save();

    const recommendations = await generateSubscriptionRecommendations({
      businessName: data.businessName,
      industry: data.businessIndustry || 'N/A',
    });

    return NextResponse.json({
      success: true,
      message: '¡Registro completado con éxito!',
      recommendations,
    });
  } catch (error) {
    console.error('Onboarding process failed:', error);
    let message =
      'Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.';
    let status = 500;

    if (error instanceof Error && error.message.includes('duplicate key')) {
      message = 'El email ya está en uso.';
      status = 409;
    }

    return NextResponse.json({success: false, message}, {status});
  }
}
