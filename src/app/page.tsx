import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BarChart, ShoppingCart, Users } from 'lucide-react';
import Header from '@/components/header';

export default function LandingPage() {
  const appTitle = process.env.APP_TITLE || 'VentaConnect';
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-center py-20 sm:py-32 bg-card">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-4">
              La Solución Definitiva para la Gestión de tu Negocio
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {appTitle} es el software de punto de venta (POS) y gestión comercial que simplifica tus operaciones, optimiza tu inventario y potencia tus ventas.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                <Link href="/register">Comenzar Gratis</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#">Solicitar Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              Características Principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <ShoppingCart className="w-8 h-8 text-primary" />
                  <CardTitle>Punto de Venta Intuitivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Un sistema de punto de venta rápido, fácil de usar y diseñado para minimizar errores y agilizar el proceso de pago.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <BarChart className="w-8 h-8 text-primary" />
                  <CardTitle>Análisis y Reportes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Toma decisiones informadas con reportes de ventas, análisis de productos y proyecciones de inventario en tiempo real.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Users className="w-8 h-8 text-primary" />
                  <CardTitle>Gestión de Clientes (CRM)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Fideliza a tus clientes con perfiles detallados, historial de compras y herramientas de marketing integradas.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {appTitle}. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
