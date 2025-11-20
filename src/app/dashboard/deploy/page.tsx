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
import {
  RefreshCw,
  Trash2,
  Power,
  AlertTriangle,
  CheckCircle,
  Server,
  Database,
  Globe,
  Loader2,
  Link as LinkIcon,
  ExternalLink,
  Play,
  PowerOff,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type DeployStatus = 'funcionando' | 'parado' | 'reiniciando';

const statusConfig: Record<
  DeployStatus,
  {
    text: string;
    icon: React.ElementType;
    color: string;
    description: string;
  }
> = {
  funcionando: {
    text: 'Funcionando',
    icon: CheckCircle,
    color: 'text-green-500',
    description: 'La aplicación está online y operativa.',
  },
  parado: {
    text: 'Parado',
    icon: Power,
    color: 'text-red-500',
    description: 'La aplicación está offline.',
  },
  reiniciando: {
    text: 'Reiniciando',
    icon: RefreshCw,
    color: 'text-blue-500 animate-spin',
    description: 'La aplicación se está reiniciando. Esto puede tardar unos minutos.',
  },
};

interface Deployment {
    app_port: number;
    db_port: number;
    status: DeployStatus;
}

interface Profile {
    businessName: string;
    deployment: Deployment;
}

export default function DeployPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
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
        if (data.success) {
          setProfile(data.profile);
        }
      } catch (e) {
        console.error("Failed to fetch profile", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const currentStatus: DeployStatus = profile?.deployment?.status ?? 'parado';

  const {
    text: statusText,
    icon: StatusIcon,
    color: statusColor,
    description: statusDescription,
  } = statusConfig[currentStatus];

  const generateUrl = (name: string) => {
    if (!name) return '';
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  }

  const appPort = profile?.deployment?.app_port;
  const dbPort = profile?.deployment?.db_port;
  const basePath = profile ? generateUrl(profile.businessName) : '';
  const fullUrl = appPort ? `http://168.181.187.83:${appPort}/${basePath}` : '';

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow p-4 md:p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Estado del Deploy
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estado Actual
              </CardTitle>
              <StatusIcon className={`h-4 w-4 ${statusColor}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${statusColor}`}>
                {statusText}
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                {statusDescription}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Información de Conexión</CardTitle>
              <CardDescription>
                Detalles para acceder a tu aplicación y base de datos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <>
                  <div className="flex items-center gap-4"><Skeleton className="h-6 w-6 rounded-full" /><Skeleton className="h-5 w-48" /></div>
                  <div className="flex items-center gap-4"><Skeleton className="h-6 w-6 rounded-full" /><Skeleton className="h-5 w-40" /></div>
                  <div className="flex items-center gap-4"><Skeleton className="h-6 w-6 rounded-full" /><Skeleton className="h-5 w-56" /></div>
                  <div className="flex items-center gap-4"><Skeleton className="h-6 w-6 rounded-full" /><Skeleton className="h-5 w-64" /><Skeleton className="h-8 w-20" /></div>
                </>
              ) : (
                <ul className="space-y-6 text-sm text-muted-foreground">
                    <li className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-3">
                            <Server className="h-5 w-5 text-primary shrink-0"/>
                            <span className="font-semibold text-foreground">Puerto de la App:</span>
                        </div>
                        <code className="bg-muted px-2 py-1 rounded-md sm:ml-auto">{appPort ?? 'N/A'}</code>
                    </li>
                     <li className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-3">
                            <Database className="h-5 w-5 text-primary shrink-0"/>
                            <span className="font-semibold text-foreground">Puerto de la DB:</span>
                        </div>
                        <code className="bg-muted px-2 py-1 rounded-md sm:ml-auto">{dbPort ?? 'N/A'}</code>
                    </li>
                    {basePath && (
                      <>
                        <li className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                           <div className="flex items-center gap-3">
                                <Globe className="h-5 w-5 text-primary shrink-0"/>
                                <span className="font-semibold text-foreground">URL Base:</span>
                            </div>
                            <code className="bg-muted px-2 py-1 rounded-md break-all">{basePath}</code>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-3">
                                <LinkIcon className="h-5 w-5 text-primary shrink-0"/>
                                <span className="font-semibold text-foreground">URL Completa:</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <code className="bg-muted px-2 py-1 rounded-md break-all">{fullUrl}</code>
                                {fullUrl && (
                                  <Button asChild variant="outline" size="sm" className="shrink-0">
                                    <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="mr-2 h-4 w-4" />
                                      Abrir
                                    </a>
                                  </Button>
                                )}
                            </div>
                        </li>
                      </>
                    )}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
              <CardDescription>
                Gestiona el ciclo de vida de tu aplicación.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                 <Button>
                    <Play className="mr-2 h-4 w-4" />
                    Iniciar Instancia
                 </Button>
                 <Button variant="outline">
                    <PowerOff className="mr-2 h-4 w-4" />
                    Parar Instancia
                 </Button>
                 <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Borrar Base de Datos
                 </Button>
              </div>
               <div className="border-l-4 border-yellow-500 bg-yellow-500/10 p-4 rounded-md">
                    <div className="flex items-center gap-2">
                         <AlertTriangle className="h-5 w-5 text-yellow-600" />
                         <h4 className="font-semibold text-yellow-800">Atención</h4>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                        La eliminación de la base de datos es una acción irreversible y borrará todos los datos de los usuarios y del negocio.
                    </p>
               </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
