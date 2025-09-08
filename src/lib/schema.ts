import { z } from "zod";

export const OnboardingSchema = z.object({
  // Step 1
  businessName: z
    .string()
    .min(2, "El nombre del negocio debe tener al menos 2 caracteres."),
  businessAddress: z.string().min(10, "Por favor, ingrese una dirección válida."),
  businessIndustry: z.string().min(2, "La industria es requerida."),
  annualRevenue: z
    .coerce
    .number({ invalid_type_error: "Por favor, ingrese un número válido." })
    .positive("Los ingresos anuales deben ser positivos."),
  numberOfEmployees: z
    .coerce
    .number({ invalid_type_error: "Por favor, ingrese un número válido." })
    .int()
    .min(1, "Debe haber al menos un empleado."),
  paymentPreferences: z.string({
    required_error: "Por favor, seleccione una preferencia de pago.",
  }),
  softwareNeeds: z
    .string()
    .min(
      10,
      "Por favor, describa sus necesidades de software (mínimo 10 caracteres)."
    ),

  // Step 2
  userName: z
    .string()
    .min(2, "El nombre de usuario debe tener al menos 2 caracteres."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),

  // Step 3
  cardHolderName: z.string().min(2, "El nombre del titular es requerido."),
  cardNumber: z.string().regex(/^[0-9]{16}$/, "Número de tarjeta inválido."),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Fecha de vencimiento inválida (MM/YY)."),
  cardCVC: z.string().regex(/^[0-9]{3,4}$/, "CVC inválido."),
  termsOfServiceAgreement: z.literal<boolean>(true, {
    errorMap: () => ({ message: "Debe aceptar los términos y condiciones." }),
  }),
});

export type OnboardingData = z.infer<typeof OnboardingSchema>;
