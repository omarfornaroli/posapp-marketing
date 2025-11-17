'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


type SubscriptionStatus = 'Activa' | 'Inactiva' | 'Pendiente';

export default function SubscriptionPage() {
    const currentStatus: SubscriptionStatus = 'Inactiva';

    const statusConfig = {
        Activa: {
            icon: CheckCircle,
            color: 'text-green-500',
            badgeVariant: 'default' as const,
            description: 'Tu suscripción está activa. El próximo pago se realizará el 20/12/2024.'
        },
        Inactiva: {
            icon: XCircle,
            color: 'text-red-500',
            badgeVariant: 'destructive' as const,
            description: 'No tienes una suscripción activa. Suscríbete para acceder a todas las funciones.'
        },
        Pendiente: {
            icon: CreditCard,
            color: 'text-orange-500',
            badgeVariant: 'secondary' as const,
            description: 'Tu suscripción está pendiente de pago.'
        },
    }

    const {icon: StatusIcon, color, badgeVariant, description} = statusConfig[currentStatus];

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
                <CardTitle>Estado de la Suscripción</CardTitle>
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
