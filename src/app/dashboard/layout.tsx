'use client';
import { useEffect, useState } from 'react';
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
import { SidebarMenuButton } from '@/components/ui/sidebar';

// This function can be moved to a lib file if needed
async function checkAuthStatus() {
  try {
    // We check for a session by looking for the token cookie.
    // The presence of the cookie is checked on the server-side.
    const response = await fetch('/api/check-auth'); // This API route needs to exist
    if (!response.ok) return { isAuthenticated: false };
    const data = await response.json();
    return { isAuthenticated: data.isAuthenticated };
  } catch (error) {
    console.error('Auth check failed:', error);
    return { isAuthenticated: false };
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      // A simple check for a token cookie. In a real app, you'd verify it.
      const hasToken = document.cookie.includes('token=');
      if (!hasToken) {
        router.replace('/login');
      } else {
        setIsAuthenticating(false);
      }
    };
    verifyAuth();
  }, [router]);


  const handleLogout = async () => {
    const response = await fetch('/api/logout', { method: 'POST' });
    if (response.ok) {
      // Use replace to prevent going back to the dashboard via browser history
      router.replace('/login');
    } else {
      console.error('Failed to log out');
      // Optionally show a toast notification for the error
    }
  };

  if (isAuthenticating) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
