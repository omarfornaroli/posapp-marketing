import OnboardingFlow from "@/components/onboarding-flow";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const appTitle = "Posify";
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative">
       <Button asChild variant="ghost" className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la página principal
          </Link>
        </Button>
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2 font-headline">
              Registro en {appTitle}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Regístrese para comenzar a usar nuestro sistema de punto de venta.
            </p>
        </div>
        <OnboardingFlow />
      </div>
    </main>
  );
}
