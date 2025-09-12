"use server";

import bcrypt from "bcryptjs";
import { OnboardingSchema, type OnboardingData } from "@/lib/schema";
import { validateSubscriptionData } from "@/ai/flows/validate-subscription-data";
import {
  generateSubscriptionRecommendations,
  type SubscriptionRecommendationsOutput,
} from "@/ai/flows/generate-subscription-recommendations";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";


interface ActionState {
  success: boolean;
  message?: string;
  recommendations?: SubscriptionRecommendationsOutput;
}

export async function processOnboarding(data: OnboardingData): Promise<ActionState> {
  const validatedForm = OnboardingSchema.safeParse(data);
  if (!validatedForm.success) {
    return { success: false, message: "Datos del formulario inválidos." };
  }

  const paymentDetails = `Titular: ${data.cardHolderName}, Tarjeta: **** **** **** ${data.cardNumber.slice(-4)}`;

  try {
    const validationResult = await validateSubscriptionData({
      businessName: data.businessName,
      businessAddress: data.businessAddress || "",
      businessIndustry: data.businessIndustry || "",
      userName: data.userName,
      password: data.password,
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
    
    await connectToDatabase();
    
    const existingUser = await User.findOne({ userName: data.userName });
    if (existingUser) {
        return { success: false, message: "El nombre de usuario ya existe." };
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
        }
    });

    await newUser.save();

    const recommendations = await generateSubscriptionRecommendations({
      businessName: data.businessName,
      industry: data.businessIndustry || "N/A",
    });

    return {
      success: true,
      message: "¡Registro completado con éxito!",
      recommendations,
    };
  } catch (error) {
    console.error("Onboarding process failed:", error);
    if (error instanceof Error && error.message.includes("duplicate key")) {
        return { success: false, message: "El nombre de usuario ya está en uso." };
    }
    return {
      success: false,
      message:
        "Ocurrió un error inesperado. Por favor, inténtelo de nuevo más tarde.",
    };
  }
}
