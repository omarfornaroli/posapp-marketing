import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Rocket, CheckCircle, Clock} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow p-4 md:p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Bienvenido al Panel de Posify
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estado del Registro
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">Completado</div>
              <p className="text-xs text-muted-foreground pt-2">
                Tu cuenta ha sido creada y verificada.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estado del Deploy
              </CardTitle>
              <Rocket className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">En Progreso</div>
              <p className="text-xs text-muted-foreground pt-2">
                Tu aplicación se está desplegando. Tiempo estimado: 5 minutos.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suscripción</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                Pendiente
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Completa tu suscripción a Mercado Pago.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Siguientes Pasos</CardTitle>
              <CardDescription>
                Guía rápida para empezar a usar Posify.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Espera a que el deploy de tu app finalice.</li>
                <li>
                  Configura tu suscripción a través del panel de "Suscripción".
                </li>
                <li>
                  Explora la sección de "Perfil" para gestionar tu información.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
