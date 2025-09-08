"use client";

import { useState } from "react";
import { useForm, type FieldName } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, User, CreditCard, PartyPopper, Loader2, AlertCircle } from "lucide-react";

import { OnboardingSchema, type OnboardingData } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "@/components/step-indicator";
import { processOnboarding } from "@/lib/actions";
import type { SubscriptionRecommendationsOutput } from "@/ai/flows/generate-subscription-recommendations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const steps = [
  { icon: Building2, label: "Negocio" },
  { icon: User, label: "Usuario" },
  { icon: CreditCard, label: "Pago" },
  { icon: PartyPopper, label: "Finalizar" },
];

const stepFields: FieldName<OnboardingData>[][] = [
  ["businessName", "businessAddress", "businessIndustry"],
  ["userName", "password", "confirmPassword"],
  ["cardHolderName", "cardNumber", "cardExpiry", "cardCVC", "termsOfServiceAgreement"],
];

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<SubscriptionRecommendationsOutput | null>(null);

  const form = useForm<OnboardingData>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      businessName: "",
      businessAddress: "",
      businessIndustry: "",
      userName: "",
      password: "",
      confirmPassword: "",
      cardHolderName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCVC: "",
      termsOfServiceAgreement: false,
    },
  });

  const handleNext = async () => {
    const fieldsToValidate = stepFields[currentStep - 1];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };
  
  const onSubmit = async (data: OnboardingData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await processOnboarding(data);
      if (result.success && result.recommendations) {
        setRecommendations(result.recommendations);
        setCurrentStep(4);
      } else {
        setError(result.message || "An unknown error occurred.");
      }
    } catch (e) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="businessName" render={({ field }) => (
                <FormItem><FormLabel>Nombre del Negocio</FormLabel><FormControl><Input placeholder="Ej: Mi Tienda S.A." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="businessIndustry" render={({ field }) => (
                <FormItem><FormLabel>Industria (Opcional)</FormLabel><FormControl><Input placeholder="Ej: Venta al por menor" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="businessAddress" render={({ field }) => (
              <FormItem><FormLabel>Dirección del Negocio (Opcional)</FormLabel><FormControl><Input placeholder="Ej: Av. Siempreviva 742" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <FormField control={form.control} name="userName" render={({ field }) => (
              <FormItem><FormLabel>Nombre de Usuario</FormLabel><FormControl><Input placeholder="Ej: juanperez" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem><FormLabel>Contraseña</FormLabel><FormControl><Input type="password" placeholder="********" {...field} /></FormControl><FormDescription>Debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.</FormDescription><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem><FormLabel>Confirmar Contraseña</FormLabel><FormControl><Input type="password" placeholder="********" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <Card className="border-accent">
                <CardHeader>
                    <CardTitle>Suscripción a Mercado Pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="cardHolderName" render={({ field }) => (
                      <FormItem><FormLabel>Nombre del titular de la tarjeta</FormLabel><FormControl><Input placeholder="Ej: Juan Perez" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="cardNumber" render={({ field }) => (
                      <FormItem><FormLabel>Número de Tarjeta</FormLabel><FormControl><Input placeholder="**** **** **** ****" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="cardExpiry" render={({ field }) => (
                          <FormItem><FormLabel>Vencimiento</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="cardCVC" render={({ field }) => (
                          <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </CardContent>
            </Card>
            <FormField control={form.control} name="termsOfServiceAgreement" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl><div className="space-y-1 leading-none">
                <FormLabel>Acepto los términos y condiciones de servicio.</FormLabel>
                <FormMessage />
              </div></FormItem>
            )} />
          </div>
        )}

        {currentStep === 4 && recommendations && (
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
              <PartyPopper className="w-16 h-16 mx-auto text-accent" />
            </motion.div>
            <h2 className="mt-6 text-2xl font-bold text-primary">¡Bienvenido a VentaConnect!</h2>
            <p className="mt-2 text-muted-foreground">Su cuenta ha sido creada exitosamente.</p>
            <Card className="mt-8 text-left">
              <CardHeader>
                <CardTitle>Recomendación de Suscripción Personalizada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Nivel de Precio Recomendado:</h4>
                  <p className="text-accent font-bold text-lg">{recommendations.recommendedPriceLevel}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Duración de Contrato Sugerida:</h4>
                  <p className="text-accent font-bold text-lg">{recommendations.recommendedContractLength}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Justificación:</h4>
                  <p className="text-muted-foreground text-sm">{recommendations.justification}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <Card className="w-full">
      <CardContent className="p-6 sm:p-8">
        <StepIndicator steps={steps} currentStep={currentStep} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="min-h-[420px] flex flex-col justify-center">
              {formContent}
            </div>
            {currentStep < 4 && (
              <CardFooter className="flex justify-between p-0 pt-8">
                <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 1 || isLoading}>
                  Atrás
                </Button>
                {currentStep < 3 ? (
                  <Button type="button" onClick={handleNext} disabled={isLoading} className="bg-accent hover:bg-accent/90">
                    Siguiente
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizando...</> : 'Finalizar Registro'}
                  </Button>
                )}
              </CardFooter>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
