
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import placeholderImages from '@/lib/placeholder-images.json';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const loginSchema = z.object({
  email: z.string().email("El email no es válido."),
  password: z.string().min(1, "La contraseña es requerida."),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const loginImage = placeholderImages.find(p => p.id === 'login');

    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = async (data: LoginData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || 'Error al iniciar sesión.');
            } else {
                toast({
                  title: "¡Éxito!",
                  description: "Has iniciado sesión correctamente. Redirigiendo...",
                });
                router.push('/dashboard');
            }
        } catch (e) {
            setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="grid md:grid-cols-2 max-w-6xl w-full rounded-lg shadow-2xl overflow-hidden bg-card">
        <div className="hidden md:block relative h-full">
            {loginImage && (
                <Image 
                    src={loginImage.src}
                    alt={loginImage.alt}
                    fill
                    className="object-cover"
                    data-ai-hint={loginImage.hint}
                />
            )}
        </div>
        <div className="flex items-center justify-center p-8 sm:p-12">
            <Card className="w-full max-w-md border-0 shadow-none">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-primary">Inicia Sesión en Tu Cuenta</CardTitle>
                    <CardDescription>Ingresa tus credenciales para acceder a la aplicación.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo Electrónico</FormLabel>
                                <FormControl>
                                <Input placeholder="nombre@ejemplo.com" {...field} disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                <Input type="password" placeholder="Ingresa tu contraseña" {...field} disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="flex items-center justify-end text-sm">
                            <Link href="#" className="font-medium text-accent hover:underline">
                                ¿Olvidaste la contraseña?
                            </Link>
                        </div>
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
                          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</> : "Iniciar Sesión"}
                        </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm">
                    <p className="text-muted-foreground">
                        ¿No tienes una cuenta? <Link href="/register" className="font-medium text-accent hover:underline">Regístrate</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
