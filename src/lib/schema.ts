import { z } from "zod";

export const OnboardingSchema = z.object({
  // Step 1
  businessName: z
    .string()
    .min(2, "El nombre del negocio debe tener al menos 2 caracteres."),
  businessAddress: z.string().optional(),
  businessIndustry: z.string().optional(),

  // Step 2
  email: z.string().email("El email no es válido.").optional().or(z.literal('')),
  password: z.string().optional().or(z.literal('')),

  // Step 3
  termsOfServiceAgreement: z.literal<boolean>(true, {
    errorMap: () => ({ message: "Debe aceptar los términos y condiciones." }),
  }),
}).refine(data => {
  if (data.email && data.password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(data.password);
  }
  return true;
}, {
    message: "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.",
    path: ["password"],
});


export type OnboardingData = z.infer<typeof OnboardingSchema>;
