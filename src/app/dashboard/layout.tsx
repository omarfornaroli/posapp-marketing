'use client';
import { useRouter } from 'next/navigation';
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
  Home,
  Rocket,
  CreditCard,
  User,
  LogOut,
  Loader2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarMenuButton } from '@/components/ui/sidebar-dashboard';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[Layout] Verifying auth. Cookies available to JS:', document.cookie);
        const response = await fetch('/api/check-auth', { credentials: 'include' });
        
        // We no longer check response.ok, as it will always be 200
        const data = await response.json();
        console.log('[Layout] Auth check response from API:', data);

        if (!data.isAuthenticated) {
          throw new Error(data.reason || 'Not authenticated');
        }
        setIsAuthenticating(false);
      } catch (error) {
        console.error('[Layout] Auth check failed, redirecting to login.', error);
        router.replace('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    const response = await fetch('/api/logout', { method: 'POST' });
    if (response.ok) {
      router.replace('/login');
    } else {
      console.error('Failed to log out');
    }
  };

  if (isAuthenticating) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                isActive={true}
                tooltip="Dashboard"
              >
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Estado del Deploy">
                <Rocket />
                <span>Estado del Deploy</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Suscripción">
                <CreditCard />
                <span>Suscripción</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Perfil">
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
