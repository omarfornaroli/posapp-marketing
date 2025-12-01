'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  BarChart,
  ShoppingCart,
  Users,
  Box,
  BrainCircuit,
  Undo2,
  ShieldCheck,
  Palette,
  Languages,
} from 'lucide-react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const appTitle = 'Posify';

const features = [
  {
    icon: ShoppingCart,
    title: 'Punto de Venta Avanzado',
    description:
      'Interfaz intuitiva con escaneo de códigos de barras, descuentos por ítem o total, y procesamiento de múltiples métodos de pago.',
  },
  {
    icon: Box,
    title: 'Gestión de Productos',
    description:
      'Control total de tu inventario con operaciones CRUD, seguimiento de stock, puntos de reorden e importación/exportación avanzada.',
  },
  {
    icon: BarChart,
    title: 'Reportes y Analítica',
    description:
      'Toma decisiones informadas con reportes de ventas, análisis de rentabilidad y un historial completo de transacciones.',
  },
  {
    icon: BrainCircuit,
    title: 'Consultas con IA',
    description:
      'Genera reportes complejos usando lenguaje natural y obtén resúmenes inteligentes para entender tus datos al instante.',
  },
  {
    icon: Users,
    title: 'Gestión de Clientes (CRM)',
    description:
      'Fideliza a tus clientes con perfiles detallados, historial de compras y herramientas de marketing integradas.',
  },
  {
    icon: Undo2,
    title: 'Gestión de Devoluciones',
    description:
      'Procesa devoluciones fácilmente buscando la venta original y reabastece tu inventario automáticamente.',
  },
];

const whyChooseUs = [
  {
    icon: Palette,
    title: 'Alta Personalización',
    description:
      'Adapta el sistema a tu marca. Personaliza temas, colores, fuentes y el formato de los recibos para que se ajusten a tu negocio.',
  },
  {
    icon: ShieldCheck,
    title: 'Roles y Permisos',
    description:
      'Control granular sobre lo que cada usuario puede ver y hacer. Asigna roles predefinidos o crea los tuyos para una seguridad total.',
  },
  {
    icon: Languages,
    title: 'Soporte Multilingüe',
    description:
      'Gestiona tu negocio sin barreras. Añade nuevos idiomas y tradúcelos automáticamente con IA para expandir tu alcance.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-card">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center py-20 sm:py-32">
            <div className="text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-4">
                El Punto de Venta Inteligente que tu Negocio Necesita
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto md:mx-0">
                {appTitle} es el sistema POS todo en uno que simplifica tus
                ventas, optimiza tu inventario y te da el control total de tu
                operación con el poder de la IA.
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                  <Link href="/register">Comenzar Gratis</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#features">Ver Características</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-80 md:h-full w-full rounded-lg overflow-hidden order-first md:order-last shadow-lg">
              <Image
                src="/img/dashboard.png"
                alt="Un panel de control del sistema POS que muestra ventas, productos y clientes."
                fill
                className="object-contain"
                data-ai-hint="app dashboard"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Todo lo que Necesitas en un Solo Lugar
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Desde la venta inicial hasta el reporte final, Posify cubre cada
                aspecto de tu gestión comercial.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map(feature => (
                <Card key={feature.title} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why-posify" className="py-20 sm:py-24 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Diseñado para Crecer Contigo
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              POSIFY no es solo una herramienta, es una plataforma flexible que
              se adapta a las necesidades únicas de tu negocio.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyChooseUs.map(feature => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center text-center p-4"
                >
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <feature.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-primary mb-4">
            ¿Listo para transformar tu negocio?
          </h3>
          <p className="text-muted-foreground mb-6">
            Únete a cientos de negocios que ya gestionan sus ventas de manera
            más inteligente.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
            <Link href="/register">Regístrate Ahora - Es Gratis</Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-8">
            &copy; {new Date().getFullYear()} {appTitle}. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
