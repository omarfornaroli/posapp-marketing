import OnboardingFlow from "@/components/onboarding-flow";

export default function Home() {
  const appTitle = process.env.APP_TITLE || "VentaConnect Onboarding";
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2 font-headline">
            {appTitle}
            </h1>
            <p className="text-muted-foreground">
            Regístrese para comenzar a usar nuestro sistema de punto de venta.
            </p>
        </div>
        <OnboardingFlow />
      </div>
    </main>
  );
}
