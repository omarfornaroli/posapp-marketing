
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
  Save,
  Download,
  XCircle,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type DeployStatus = 'funcionando' | 'parado' | 'reiniciando' | 'Funciona con errores';
type WebsiteStatus = 'online' | 'offline' | 'checking';

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
  'Funciona con errores': {
    text: 'Funciona con errores',
    icon: AlertTriangle,
    color: 'text-yellow-500',
    description: 'Algunos servicios pueden no estar funcionando correctamente.',
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

const websiteStatusConfig: Record<
  WebsiteStatus,
  {
    text: string;
    icon: React.ElementType;
    color: string;
    description: string;
  }
> = {
    online: {
        text: 'Sitio Online',
        icon: CheckCircle,
        color: 'text-green-500',
        description: 'La URL de la aplicación está respondiendo correctamente.',
    },
    offline: {
        text: 'Sitio Offline',
        icon: XCircle,
        color: 'text-red-500',
        description: 'No se pudo acceder a la URL de la aplicación.',
    },
    checking: {
        text: 'Verificando...',
        icon: Loader2,
        color: 'text-blue-500 animate-spin',
        description: 'Se está comprobando el estado del sitio web.',
    }
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

interface ContainerStatus {
    id: string;
    name: string;
    rawStatus: string;
    status: string; // "up" or "down" etc.
}

interface StatusResponse {
    ok: boolean;
    statuses: ContainerStatus[];
}

export default function DeployPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<DeployStatus>('parado');
  const [websiteStatus, setWebsiteStatus] = useState<WebsiteStatus>('checking');

  const { toast } = useToast();
  
  const generateUrl = (name: string) => {
    if (!name) return '';
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  }

  const appPort = profile?.deployment?.app_port;
  const dbPort = profile?.deployment?.db_port;
  const basePath = profile ? generateUrl(profile.businessName) : '';
  const fullUrl = appPort ? `http://168.181.187.83:${appPort}` : '';

  const checkWebsiteStatus = async () => {
    if (!fullUrl) {
      setWebsiteStatus('offline');
      return;
    }
    setWebsiteStatus('checking');
    try {
      const response = await fetch(fullUrl);
      if (response.ok) {
        setWebsiteStatus('online');
      } else {
        setWebsiteStatus('offline');
      }
    } catch (e) {
      console.error("Failed to ping website", e);
      setWebsiteStatus('offline');
    }
  };


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
      if (data.success && data.profile) {
        setProfile(data.profile);
        if (data.profile.deployment) {
            setCurrentStatus(data.profile.deployment.status);
        }
      }
    } catch (e) {
      console.error("Failed to fetch profile", e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch('/api/status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const data: StatusResponse = await response.json();
      
       if (data && Array.isArray(data.statuses) && data.statuses.length > 0) {
        const upCount = data.statuses.filter(s => s.status === 'up').length;
        if (upCount === data.statuses.length) {
            setCurrentStatus('funcionando');
        } else if (upCount > 0) {
            setCurrentStatus('Funciona con errores');
        } else {
            setCurrentStatus('parado');
        }
      } else {
          setCurrentStatus('parado');
      }

    } catch (e) {
      console.error("Failed to fetch status", e);
      setCurrentStatus('parado'); // Default to 'parado' on any error
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (fullUrl) {
      const statusInterval = setInterval(() => {
          fetchStatus();
          checkWebsiteStatus();
      }, 5000); // Check status every 5 seconds

      return () => clearInterval(statusInterval);
    }
  }, [fullUrl]);

  const handleAction = async (apiPath: string, actionName: string, successMessage: string) => {
    setActionLoading(actionName);
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(apiPath, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        // First, check if the response was successful at a network level
        if (!response.ok) {
           // Try to get a message from the body, then fall back to status text
            let errorMessage = `Error al ejecutar la acción: ${actionName}`;
            try {
                const errorResult = await response.json();
                errorMessage = errorResult.message || errorMessage;
            } catch (e) {
                errorMessage = response.statusText;
            }
            throw new Error(errorMessage);
        }
        
        // Try to parse JSON, but don't fail if it's not JSON
        let result: { success?: boolean; message?: string } = {};
        const responseText = await response.text();
        if (responseText) {
          try {
            result = JSON.parse(responseText);
          } catch (e) {
            // Not a JSON response, that's okay. The success is implied by the 2xx status.
          }
        }

        // If the result has a `success: false`, treat it as an error
        if (result.success === false) {
             throw new Error(result.message || `Error al ejecutar la acción: ${actionName}`);
        }

        toast({
            title: '¡Éxito!',
            description: successMessage,
        });

        // If status changes, update immediately
        if(actionName === 'deploy' || actionName === 'stop') {
            await fetchStatus();
            await checkWebsiteStatus();
        }

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: `Error en ${actionName}`,
            description: error.message,
        });
    } finally {
        setActionLoading(null);
    }
  };


  const {
    text: statusText,
    icon: StatusIcon,
    color: statusColor,
    description: statusDescription,
  } = statusConfig[currentStatus] || statusConfig.parado;
  
  const {
      text: siteStatusText,
      icon: SiteStatusIcon,
      color: siteStatusColor,
      description: siteStatusDescription,
  } = websiteStatusConfig[websiteStatus];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow p-4 md:p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Estado de la App
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estado de Contenedores
              </CardTitle>
               <div className="flex items-center gap-2">
                {currentStatus === 'reiniciando' && <Loader2 className={`h-4 w-4 ${statusColor}`} />}
                <StatusIcon className={`h-4 w-4 ${statusColor}`} />
               </div>
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
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estado del Sitio Web
              </CardTitle>
              <SiteStatusIcon className={`h-4 w-4 ${siteStatusColor}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${siteStatusColor}`}>
                {siteStatusText}
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                {siteStatusDescription}
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
                        <div className="flex items-center gap-3 shrink-0">
                            <Server className="h-5 w-5 text-primary"/>
                            <span className="font-semibold text-foreground">Puerto de la App:</span>
                        </div>
                        <code className="bg-muted px-2 py-1 rounded-md">{appPort ?? 'N/A'}</code>
                    </li>
                     <li className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-3 shrink-0">
                            <Database className="h-5 w-5 text-primary"/>
                            <span className="font-semibold text-foreground">Puerto de la DB:</span>
                        </div>
                        <code className="bg-muted px-2 py-1 rounded-md">{dbPort ?? 'N/A'}</code>
                    </li>
                    {basePath && (
                      <>
                        <li className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                           <div className="flex items-center gap-3 shrink-0">
                                <Globe className="h-5 w-5 text-primary"/>
                                <span className="font-semibold text-foreground">Ruta Base:</span>
                            </div>
                            <code className="bg-muted px-2 py-1 rounded-md break-all">{`/${basePath}`}</code>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-3 shrink-0">
                                <LinkIcon className="h-5 w-5 text-primary"/>
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

        <div className="grid gap-8 md:grid-cols-2 mt-8">
            <Card>
                <CardHeader>
                <CardTitle>Gestión de la Instancia</CardTitle>
                <CardDescription>
                    Inicia o detén tu aplicación.
                </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    <Button onClick={() => handleAction('/api/deploy', 'deploy', 'La instancia se está iniciando.')} disabled={!!actionLoading}>
                        {actionLoading === 'deploy' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                        Iniciar Instancia
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" disabled={!!actionLoading}>
                            {actionLoading === 'stop' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PowerOff className="mr-2 h-4 w-4" />}
                            Parar Instancia
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción detendrá tu aplicación y no será accesible para los usuarios. Puedes volver a iniciarla en cualquier momento.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleAction('/api/stop', 'stop', 'La instancia se está deteniendo.')}>Continuar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                <CardTitle>Gestión de la Base de Datos</CardTitle>
                <CardDescription>
                    Realiza copias de seguridad, restaura o elimina tus datos. ¡Usa estas acciones con cuidado!
                </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                     <Button variant="outline" onClick={() => handleAction('/api/backup_db', 'backup', 'Copia de seguridad iniciada.')} disabled={!!actionLoading}>
                        {actionLoading === 'backup' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Hacer Backup
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="outline" disabled={!!actionLoading}>
                            {actionLoading === 'restore' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                            Restaurar Backup
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¡Atención!</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción sobrescribirá todos los datos actuales con la última copia de seguridad. Esta operación no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleAction('/api/restore_db', 'restore', 'La restauración de la base de datos ha comenzado.')}>Restaurar Ahora</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                   
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="destructive" disabled={!!actionLoading}>
                            {actionLoading === 'delete_db' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            Borrar Base de Datos
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¡Acción Irreversible!</AlertDialogTitle>
                          <AlertDialogDescription>
                            Estás a punto de borrar permanentemente toda la base de datos de tu negocio, incluyendo usuarios y ventas. ¿Estás absolutamente seguro?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleAction('/api/delete_db', 'delete_db', 'La base de datos se está eliminando.')}>Sí, borrar todo</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

    

    