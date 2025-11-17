"use client";

import { useState } from "react";
import { useForm, type FieldName } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, User, CreditCard, PartyPopper, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";


const steps = [
  { icon: Building2, label: "Negocio", mobileLabel: "Paso 1: Negocio" },
  { icon: User, label: "Usuario", mobileLabel: "Paso 2: Usuario" },
  { icon: CreditCard, label: "Pago", mobileLabel: "Paso 3: Pago" },
  { icon: PartyPopper, label: "Finalizar", mobileLabel: "Paso 4: Finalizar" },
];

const stepFields: FieldName<OnboardingData>[][] = [
  ["businessName", "businessAddress", "businessIndustry"],
  ["email", "password"],
  ["termsOfServiceAgreement"],
];

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<OnboardingData>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      businessName: '',
      businessAddress: '',
      businessIndustry: '',
      email: '',
      password: '',
      termsOfServiceAgreement: false,
    },
  });

  const handleNext = async () => {
    const fieldsToValidate = stepFields[currentStep - 1];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      if(currentStep === 3) {
        await onSubmit(form.getValues());
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };
  
  const onSubmit = async (data: OnboardingData) => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();

      if (result.success) {
        toast({
            title: "¡Registro Exitoso!",
            description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
        });
        router.push('/login');
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
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
          <div className="space-y-4 md:space-y-6">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email (Opcional)</FormLabel><FormControl><Input placeholder="admin@example.com" {...field} /></FormControl><FormDescription>Si lo dejas en blanco, se usará 'admin@example.com'.</FormDescription><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem><FormLabel>Contraseña (Opcional)</FormLabel><FormControl><Input type="password" placeholder="********" {...field} /></FormControl><FormDescription>Si lo dejas en blanco, se usará '1234'. Si la ingresas, debe tener al menos 8 caracteres, mayúscula, minúscula, número y un símbolo.</FormDescription><FormMessage /></FormItem>
            )} />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 md:space-y-6">
            <Card className="border-accent">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Suscripción a Mercado Pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        Haz clic en el botón a continuación para configurar tu suscripción a través de Mercado Pago. Serás redirigido a su plataforma segura para completar el proceso.
                    </p>
                    <Button className="w-full bg-[#009EE3] hover:bg-[#008ACB]">
                        <CreditCard className="mr-2" />
                        Suscribirse con Mercado Pago
                    </Button>
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
      </motion.div>
    </AnimatePresence>
  );

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <StepIndicator steps={steps.slice(0, 3)} currentStep={currentStep} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {error && (
              <Alert variant="destructive" className="mb-4 sm:mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="min-h-[380px] sm:min-h-[420px] flex flex-col justify-center px-2 sm:px-0">
              {formContent}
            </div>

            <CardFooter className="flex justify-between p-0 pt-6 sm:pt-8">
              <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 1 || isLoading}>
                Atrás
              </Button>
              <Button type="button" onClick={handleNext} disabled={isLoading || (currentStep === 3 && !form.watch('termsOfServiceAgreement'))} className="bg-accent hover:bg-accent/90">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizando...</> : (currentStep === 3 ? 'Finalizar Registro' : 'Siguiente')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
