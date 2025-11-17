
'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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


const loginSchema = z.object({
  email: z.string().email("El email no es válido."),
  password: z.string().min(1, "La contraseña es requerida."),
  remember: z.boolean().optional(),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const loginImage = placeholderImages.find(p => p.id === 'login');
    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        }
    });

    const onSubmit = (data: LoginData) => {
        console.log(data);
        // Handle login logic here
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="grid md:grid-cols-2 max-w-6xl w-full rounded-lg shadow-2xl overflow-hidden">
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
        <div className="flex items-center justify-center p-8 sm:p-12 bg-card">
            <Card className="w-full max-w-md border-0 shadow-none">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-primary">Inicia Sesión en Tu Cuenta</CardTitle>
                    <CardDescription>Ingresa tus credenciales para acceder a la aplicación.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo Electrónico</FormLabel>
                                <FormControl>
                                <Input placeholder="nombre@ejemplo.com" {...field} />
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
                                <Input type="password" placeholder="Ingresa tu contraseña" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="flex items-center justify-between text-sm">
                            <FormField
                                control={form.control}
                                name="remember"
                                render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Checkbox
                                            id="remember"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel htmlFor="remember" className="!mt-0 font-normal text-muted-foreground">
                                    Recordarme por 15 días
                                    </FormLabel>
                                </FormItem>
                                )}
                            />
                            <Link href="#" className="font-medium text-accent hover:underline">
                                ¿Olvidaste la contraseña?
                            </Link>
                        </div>
                        <Button type="submit" className="w-full bg-accent hover:bg-accent/90">Iniciar Sesión</Button>
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
