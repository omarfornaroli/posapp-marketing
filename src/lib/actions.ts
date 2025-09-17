'use server';

import type {OnboardingData} from '@/lib/schema';
import type {SubscriptionRecommendationsOutput} from '@/ai/flows/generate-subscription-recommendations';

interface ActionState {
  success: boolean;
  message?: string;
  recommendations?: SubscriptionRecommendationsOutput;
}

export async function processOnboarding(
  data: OnboardingData
): Promise<ActionState> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {success: false, message: result.message || 'An error occurred.'};
    }

    return result;
  } catch (error) {
    console.error('Onboarding process failed:', error);
    return {
      success: false,
      message:
        'Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.',
    };
  }
}
