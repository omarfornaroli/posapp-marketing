'use server';

import {OnboardingSchema, type OnboardingData} from '@/lib/schema';
import {validateSubscriptionData} from '@/ai/flows/validate-subscription-data';
import {generateSubscriptionRecommendations} from '@/ai/flows/generate-subscription-recommendations';
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
    const recommendations = await generateSubscriptionRecommendations({
      businessName: formData.businessName,
      industry: formData.businessIndustry || 'N/A',
    });

    return {
      success: true,
      message: '¡Datos validados!',
      recommendations,
    };
  } catch (error) {
    console.error('Recommendation generation failed:', error);
    return {success: false, message: 'No se pudieron generar recomendaciones.'};
  }
}
