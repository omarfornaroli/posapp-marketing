'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Building, Mail, MapPin } from 'lucide-react';

const userProfile = {
  name: 'Usuario Admin',
  email: 'admin@example.com',
  avatar: 'https://picsum.photos/seed/avatar/100/100',
  businessName: 'Mi Tienda S.A.',
  businessIndustry: 'Venta al por menor',
  businessAddress: 'Av. Siempreviva 742',
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow p-4 md:p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Perfil de Usuario y Negocio</h1>
        
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
                    <AvatarImage src={userProfile.avatar} />
                    <AvatarFallback>
                        {userProfile.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
                <CardDescription>{userProfile.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Información del Negocio
                    </h3>
                    <div className="space-y-3 pl-7">
                        <p className="flex items-center gap-3"><strong className="w-24">Nombre:</strong> {userProfile.businessName}</p>
                        <p className="flex items-center gap-3"><strong className="w-24">Industria:</strong> {userProfile.businessIndustry}</p>
                        <p className="flex items-center gap-3"><MapPin className="h-4 w-4 mr-0.5"/> <strong className="w-20">Dirección:</strong> {userProfile.businessAddress}</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Información de la Cuenta
                    </h3>
                    <div className="space-y-3 pl-7">
                         <p className="flex items-center gap-3"><Mail className="h-4 w-4 mr-0.5" /> <strong className="w-20">Email:</strong> {userProfile.email}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
