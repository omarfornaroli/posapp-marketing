'use server';

import bcrypt from 'bcryptjs';
import {OnboardingSchema, type OnboardingData} from '@/lib/schema';
import {validateSubscriptionData} from '@/ai/flows/validate-subscription-data';
import {generateSubscriptionRecommendations} from '@/ai/flows/generate-subscription-recommendations';
import {connectToDatabase} from '@/lib/mongodb';
import User from '@/models/user';
import type {SubscriptionRecommendationsOutput} from '@/ai/flows/generate-subscription-recommendations';


interface ActionState {
  success: boolean;
  message?: string;
  recommendations?: SubscriptionRecommendationsOutput;
}

export async function processOnboarding(
  data: OnboardingData
): Promise<ActionState> {
  const validatedForm = OnboardingSchema.safeParse(data);

  if (!validatedForm.success) {
    return {success: false, message: 'Datos del formulario inválidos.'};
  }

  const formData = validatedForm.data;
  
  const userEmail = formData.email || 'admin@example.com';
  const userPassword = formData.password || '1234';

  try {
    await validateSubscriptionData({
      businessName: formData.businessName,
      businessAddress: formData.businessAddress || '',
      businessIndustry: formData.businessIndustry || '',
      userName: userEmail,
      password: userPassword,
      paymentDetails: 'Mercado Pago',
      termsOfServiceAgreement: formData.termsOfServiceAgreement,
    });
  } catch (aiError) {
      console.warn("AI validation call failed, proceeding without it.", aiError)
  }

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({email: userEmail});
    if (existingUser) {
      return {success: false, message: 'El email ya existe.'};
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const newUser = new User({
      businessName: formData.businessName,
      businessAddress: formData.businessAddress,
      businessIndustry: formData.businessIndustry,
      email: userEmail,
      password: hashedPassword,
    });

    await newUser.save();

    const recommendations = await generateSubscriptionRecommendations({
      businessName: formData.businessName,
      industry: formData.businessIndustry || 'N/A',
    });

    return {
      success: true,
      message: '¡Registro completado con éxito!',
      recommendations,
    };
  } catch (error) {
    console.error('Onboarding process failed:', error);
    let message =
      'Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.';

    if (error instanceof Error && (error as any).code === 11000) {
      message = 'El email ya está en uso.';
    }

    return {success: false, message};
  }
}
