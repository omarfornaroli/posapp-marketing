'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Building, Mail, MapPin, Loader2, AlertCircle, KeyRound } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  businessName: string;
  businessIndustry: string;
  businessAddress: string;
}

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "La contraseña actual es requerida." }),
  newPassword: z.string().min(8, { message: "La nueva contraseña debe tener al menos 8 caracteres." }).refine(data => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(data);
  }, {
      message: "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.",
      path: ["newPassword"],
  }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ProfileSkeleton = () => (
    <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
            <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-5 w-64 mx-auto mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Información del Negocio
                </h3>
                <div className="space-y-3 pl-7">
                    <div className="flex items-center gap-3"><strong className="w-24">Nombre:</strong> <Skeleton className="h-5 w-full"/></div>
                    <div className="flex items-center gap-3"><strong className="w-24">Industria:</strong> <Skeleton className="h-5 w-full"/></div>
                    <div className="flex items-center gap-3"><MapPin className="h-4 w-4 mr-0.5"/> <strong className="w-20">Dirección:</strong> <Skeleton className="h-5 w-full"/></div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información de la Cuenta
                </h3>
                <div className="space-y-3 pl-7">
                     <div className="flex items-center gap-3"><Mail className="h-4 w-4 mr-0.5" /> <strong className="w-20">Email:</strong> <Skeleton className="h-5 w-full"/></div>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Skeleton className="h-10 w-40" />
        </CardFooter>
    </Card>
);

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autenticado.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'No se pudo cargar el perfil.');
        }
        setProfile(data.profile);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordChange = async (data: ChangePasswordFormData) => {
    setIsPasswordSubmitting(true);
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/api/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Ocurrió un error.');
        }

        toast({
            title: '¡Éxito!',
            description: 'Tu contraseña ha sido actualizada.',
        });
        setIsDialogOpen(false);
        form.reset();

    } catch (e: any) {
        toast({
            variant: 'destructive',
            title: 'Error al cambiar la contraseña',
            description: e.message,
        });
    } finally {
        setIsPasswordSubmitting(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow p-4 md:p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Perfil de Usuario y Negocio</h1>
        
        {isLoading && <ProfileSkeleton />}

        {error && (
            <Alert variant="destructive" className="max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error al cargar el perfil</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        {profile && !isLoading && !error &&(
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback>
                            {profile.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl">{profile.name}</CardTitle>
                    <CardDescription>{profile.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Información del Negocio
                        </h3>
                        <div className="space-y-3 pl-7">
                            <p className="flex items-center gap-3"><strong className="w-24">Nombre:</strong> {profile.businessName}</p>
                            <p className="flex items-center gap-3"><strong className="w-24">Industria:</strong> {profile.businessIndustry || 'No especificada'}</p>
                            <p className="flex items-center gap-3"><MapPin className="h-4 w-4 mr-0.5"/> <strong className="w-20">Dirección:</strong> {profile.businessAddress || 'No especificada'}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Información de la Cuenta
                        </h3>
                        <div className="space-y-3 pl-7">
                             <p className="flex items-center gap-3"><Mail className="h-4 w-4 mr-0.5" /> <strong className="w-20">Email:</strong> {profile.email}</p>
                        </div>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <KeyRound className="mr-2 h-4 w-4" />
                                Cambiar Contraseña
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Cambiar Contraseña</DialogTitle>
                                <DialogDescription>
                                    Introduce tu contraseña actual y la nueva contraseña.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handlePasswordChange)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contraseña Actual</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nueva Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary" disabled={isPasswordSubmitting}>
                                                Cancelar
                                            </Button>
                                        </DialogClose>
                                        <Button type="submit" disabled={isPasswordSubmitting}>
                                            {isPasswordSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Guardar Cambios
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        )}
      </main>
    </div>
  );
}
