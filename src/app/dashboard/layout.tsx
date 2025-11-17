'use client';
import { useRouter, usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenu,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar-dashboard';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Home,
  Rocket,
  CreditCard,
  User,
  LogOut,
  Loader2,
  ChevronDown,
  CircleDot,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarMenuButton } from '@/components/ui/sidebar-dashboard';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error(
          '[Layout] Auth check failed, no token in localStorage. Redirecting to login.'
        );
        router.replace('/login');
        return;
      }

      try {
        console.log('[Layout] Verifying auth with token from localStorage.');
        const response = await fetch('/api/check-auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!data.isAuthenticated) {
          throw new Error(data.reason || 'Not authenticated');
        }
        setIsAuthenticating(false);
      } catch (error) {
        console.error(
          '[Layout] Auth check failed, redirecting to login.',
          error
        );
        localStorage.removeItem('token');
        router.replace('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    router.replace('/login');
  };

  if (isAuthenticating) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isActive = (path: string) => pathname === path;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/avatar/40/40" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Usuario</span>
              <span className="text-xs text-muted-foreground">
                admin@example.com
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/dashboard"
                isActive={isActive('/dashboard')}
                tooltip="Dashboard"
              >
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Collapsible>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      'flex w-full items-center justify-between gap-3 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2',
                      isActive('/dashboard/deploy') &&
                        'bg-sidebar-primary font-medium text-sidebar-primary-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Rocket />
                      <span>Estado del Deploy</span>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  </button>
                </CollapsibleTrigger>
              </SidebarMenuItem>
              <CollapsibleContent>
                <div className="flex flex-col gap-1 py-1 pl-11 pr-2">
                  <SidebarMenuButton href="/dashboard/deploy" size="sm" variant="ghost">
                      <CircleDot className="h-3 w-3" />
                      <span>Ver Estado</span>
                  </SidebarMenuButton>
                  <SidebarMenuButton href="#" size="sm" variant="ghost">
                      <RefreshCw className="h-3 w-3" />
                      <span>Reiniciar Deploy</span>
                  </SidebarMenuButton>
                  <SidebarMenuButton href="#" size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                      <span>Borrar DB</span>
                  </SidebarMenuButton>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <SidebarMenuItem>
              <SidebarMenuButton
                href="/dashboard/subscription"
                isActive={isActive('/dashboard/subscription')}
                tooltip="Suscripción"
              >
                <CreditCard />
                <span>Suscripción</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/dashboard/profile"
                isActive={isActive('/dashboard/profile')}
                tooltip="Perfil"
              >
                <User />
                <span>Perfil</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
