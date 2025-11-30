
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
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

const appTitle = 'Posify';

const features = [
    {
      icon: ShoppingCart,
      title: 'Punto de Venta Avanzado',
      description: 'Interfaz intuitiva con escaneo de códigos de barras, descuentos por ítem o total, y procesamiento de múltiples métodos de pago.',
      imgSrc: '/img/pos.png',
    },
    {
      icon: Box,
      title: 'Gestión de Productos',
      description: 'Control total de tu inventario con operaciones CRUD, seguimiento de stock, puntos de reorden e importación/exportación avanzada.',
      imgSrc: '/img/products.png',
    },
    {
      icon: BarChart,
      title: 'Reportes y Analítica',
      description: 'Toma decisiones informadas con reportes de ventas, análisis de rentabilidad y un historial completo de transacciones.',
      imgSrc: '/img/reports.png'
    },
    {
      icon: BrainCircuit,
      title: 'Consultas con IA',
      description: 'Genera reportes complejos usando lenguaje natural y obtén resúmenes inteligentes para entender tus datos al instante.',
      imgSrc: '/img/ai.png'
    },
    {
      icon: Users,
      title: 'Gestión de Clientes (CRM)',
      description: 'Fideliza a tus clientes con perfiles detallados, historial de compras y herramientas de marketing integradas.',
      imgSrc: '/img/clients.png'
    },
    {
      icon: Undo2,
      title: 'Gestión de Devoluciones',
      description: 'Procesa devoluciones fácilmente buscando la venta original y reabastece tu inventario automáticamente.',
      imgSrc: '/img/returns.png'
    },
];

const whyChooseUs = [
  {
    icon: Palette,
    title: 'Alta Personalización',
    description: 'Adapta el sistema a tu marca. Personaliza temas, colores, fuentes y el formato de los recibos para que se ajusten a tu negocio.',
  },
  {
    icon: ShieldCheck,
    title: 'Roles y Permisos',
    description: 'Control granular sobre lo que cada usuario puede ver y hacer. Asigna roles predefinidos o crea los tuyos para una seguridad total.',
  },
  {
    icon: Languages,
    title: 'Soporte Multilingüe',
    description: 'Gestiona tu negocio sin barreras. Añade nuevos idiomas y tradúcelos automáticamente con IA para expandir tu alcance.',
  },
];

function FeatureSection({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '10%']);
  const isOdd = index % 2 !== 0;

  return (
    <div ref={ref} className="container mx-auto px-4 py-16 sm:py-24 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className={`md:order-${isOdd ? 2 : 1}`}>
          <div className="flex items-center gap-4 mb-4">
            <feature.icon className="w-8 h-8 text-primary" />
            <h3 className="text-2xl sm:text-3xl font-bold">{feature.title}</h3>
          </div>
          <p className="text-muted-foreground text-lg">{feature.description}</p>
        </div>
        <div className={`md:order-${isOdd ? 1 : 2} relative`}>
            <motion.div style={{ y }} className="relative aspect-video rounded-lg shadow-2xl overflow-hidden">
              <Image
                src={feature.imgSrc}
                alt={feature.title}
                fill
                className="object-cover object-top"
              />
            </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[90vh] sm:h-[100vh] flex items-center justify-center text-center text-white overflow-hidden">
          <motion.div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url('/img/store-background.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          </motion.div>

          <div className="relative z-10 p-4 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-black/30 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl">
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)]">
                    El Punto de Venta Inteligente que tu Negocio Necesita
                  </h1>
                  <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-3xl mx-auto [text-shadow:_0_1px_2px_rgb(0_0_0_/_40%)]">
                    {appTitle} es el sistema POS todo en uno que simplifica tus ventas, optimiza tu inventario y te da el control total con el poder de la IA.
                  </p>
               </motion.div>

                 <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                    className="relative w-full aspect-[16/10] max-w-3xl mx-auto rounded-xl shadow-2xl p-2 bg-slate-800 border-4 border-slate-600"
                  >
                    <Image
                        src="/img/pos.png"
                        alt="POSify Dashboard"
                        fill
                        className="object-cover rounded-md"
                    />
                </motion.div>
            </div>
             <motion.div
                className="flex justify-center gap-4 mt-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
             >
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                  <Link href="/register">Comenzar Gratis</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/50 text-white hover:bg-white/20">
                  <Link href="#features">Ver Características</Link>
                </Button>
              </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-background">
          <div className="py-20 sm:py-24">
              <div className="container mx-auto px-4 text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                      Todo lo que Necesitas en un Solo Lugar
                  </h2>
                  <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
                      Desde la venta inicial hasta el reporte final, Posify cubre cada aspecto de tu gestión comercial.
                  </p>
              </div>
               {features.map((feature, index) => (
                    <FeatureSection key={feature.title} feature={feature} index={index} />
                ))}
          </div>
        </section>


         {/* Why Choose Us Section */}
         <section id="why-posify" className="py-20 sm:py-24 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Diseñado para Crecer Contigo
            </h2>
             <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              POSIFY no es solo una herramienta, es una plataforma flexible que se adapta a las necesidades únicas de tu negocio.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {whyChooseUs.map((feature) => (
                  <div key={feature.title} className="flex flex-col items-center text-center p-4">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <feature.icon className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
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
           <h3 className="text-2xl font-bold text-primary mb-4">¿Listo para transformar tu negocio?</h3>
            <p className="text-muted-foreground mb-6">
                Únete a cientos de negocios que ya gestionan sus ventas de manera más inteligente.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
              <Link href="/register">Regístrate Ahora - Es Gratis</Link>
            </Button>
          <p className="text-sm text-muted-foreground mt-8">&copy; {new Date().getFullYear()} {appTitle}. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
