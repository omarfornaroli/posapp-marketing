'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, CreditCard, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { subscriptionStatus$, type SubscriptionStatus } from '@/lib/subscription.service';

const statusConfig: Record<
  SubscriptionStatus,
  {
    icon: React.ElementType;
    color: string;
    badgeVariant: 'default' | 'destructive' | 'secondary';
    description: string;
  }
> = {
  Activa: {
    icon: CheckCircle,
    color: 'text-green-500',
    badgeVariant: 'default',
    description: 'Tu suscripción está activa. El próximo pago se realizará el 20/12/2024.',
  },
  Inactiva: {
    icon: XCircle,
    color: 'text-red-500',
    badgeVariant: 'destructive',
    description: 'No tienes una suscripción activa. Suscríbete para acceder a todas las funciones.',
  },
  Pendiente: {
    icon: CreditCard,
    color: 'text-orange-500',
    badgeVariant: 'secondary',
    description: 'Tu suscripción está pendiente de pago. La estamos procesando.',
  },
};

export default function SubscriptionPage() {
  const [currentStatus, setCurrentStatus] = useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    const subscription = subscriptionStatus$.subscribe(status => {
      setCurrentStatus(status);
    });

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (currentStatus === null) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Consultando estado de la suscripción...</p>
          </div>
        </div>
      );
  }

  const { icon: StatusIcon, color, badgeVariant, description } = statusConfig[currentStatus];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow p-4 md:p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Gestión de Suscripción
        </h1>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle>Estado de la Suscripción</CardTitle>
                  {currentStatus === 'Pendiente' && <Loader2 className="h-4 w-4 animate-spin"/>}
                </div>
                <Badge variant={badgeVariant} className="text-sm">{currentStatus}</Badge>
              </div>
              <CardDescription>
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-[#009EE3] hover:bg-[#008ACB]">
                <CreditCard className="mr-2 h-4 w-4" />
                {currentStatus === 'Activa' ? 'Gestionar en Mercado Pago' : 'Suscribirse con Mercado Pago'}
              </Button>
              {currentStatus === 'Activa' && (
                <Button variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancelar Suscripción
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
