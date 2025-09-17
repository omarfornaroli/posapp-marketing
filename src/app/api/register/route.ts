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

  const data = validatedForm.data;
  const paymentDetails = `Titular: ${
    data.cardHolderName
  }, Tarjeta: **** **** **** ${data.cardNumber.slice(-4)}`;

  try {
    const validationResult = await validateSubscriptionData({
      businessName: data.businessName,
      businessAddress: data.businessAddress || '',
      businessIndustry: data.businessIndustry || '',
      userName: data.userName,
      password: data.password,
      paymentDetails: paymentDetails,
      termsOfServiceAgreement: data.termsOfServiceAgreement,
    });

    if (!validationResult.isDataComplete) {
      return NextResponse.json(
        {
          success: false,
          message: `Por favor, complete todos los campos requeridos. Faltan: ${validationResult.missingFields.join(
            ', '
          )}`,
        },
        {status: 400}
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({userName: data.userName});
    if (existingUser) {
      return NextResponse.json(
        {success: false, message: 'El nombre de usuario ya existe.'},
        {status: 409}
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = new User({
      businessName: data.businessName,
      businessAddress: data.businessAddress,
      businessIndustry: data.businessIndustry,
      userName: data.userName,
      password: hashedPassword,
      cardInfo: {
        holderName: data.cardHolderName,
        last4: data.cardNumber.slice(-4),
      },
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
      message = 'El nombre de usuario ya está en uso.';
      status = 409;
    }

    return NextResponse.json({success: false, message}, {status});
  }
}
