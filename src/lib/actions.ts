"use server";

import { OnboardingSchema, type OnboardingData } from "@/lib/schema";
import { validateSubscriptionData } from "@/ai/flows/validate-subscription-data";
import {
  generateSubscriptionRecommendations,
  type SubscriptionRecommendationsOutput,
} from "@/ai/flows/generate-subscription-recommendations";

interface ActionState {
  success: boolean;
  message?: string;
  recommendations?: SubscriptionRecommendationsOutput;
}

export async function processOnboarding(data: OnboardingData): Promise<ActionState> {
  const validatedForm = OnboardingSchema.safeParse(data);
  if (!validatedForm.success) {
    // This should ideally not happen if client-side validation is working
    return { success: false, message: "Datos del formulario inválidos." };
  }

  const paymentDetails = `Titular: ${data.cardHolderName}, Tarjeta: **** **** **** ${data.cardNumber.slice(-4)}`;

  try {
    // In a real app, you'd save user data to a database here
    // and interact with Mercado Pago's API.

    // Step 1: Validate data completeness with AI
    const validationResult = await validateSubscriptionData({
      businessName: data.businessName,
      businessAddress: data.businessAddress || "",
      businessIndustry: data.businessIndustry || "",
      userName: data.userName,
      password: data.password, // In a real app, hash this before storing/using
      paymentDetails: paymentDetails,
      termsOfServiceAgreement: data.termsOfServiceAgreement,
    });

    if (!validationResult.isDataComplete) {
      return {
        success: false,
        message: `Por favor, complete todos los campos requeridos. Faltan: ${validationResult.missingFields.join(
          ", "
        )}`,
      };
    }

    // Step 2: Generate subscription recommendations with AI
    const recommendations = await generateSubscriptionRecommendations({
      businessName: data.businessName,
      industry: data.businessIndustry || "N/A",
      annualRevenue: 0, // Field removed from form
      numberOfEmployees: 1, // Field removed from form
      paymentPreferences: data.paymentPreferences,
      softwareNeeds: data.softwareNeeds,
    });

    return {
      success: true,
      message: "¡Registro completado con éxito!",
      recommendations,
    };
  } catch (error) {
    console.error("Onboarding process failed:", error);
    return {
      success: false,
      message:
        "Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.",
    };
  }
}
