
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
  SidebarSeparator,
  SidebarTrigger,
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
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  businessName: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);


  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('[Layout] Auth check failed, no token. Redirecting to login.');
        router.replace('/login');
        return;
      }

      try {
        console.log('[Layout] Verifying auth with token.');
        const authResponse = await fetch('/api/check-auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const authData = await authResponse.json();

        if (!authData.isAuthenticated) {
          throw new Error(authData.reason || 'Not authenticated');
        }
        
        console.log('[Layout] Auth successful. Fetching profile.');
        const profileResponse = await fetch('/api/profile', {
           headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const profileData = await profileResponse.json();
        if(!profileData.success) {
            throw new Error(profileData.message || 'Could not fetch profile');
        }
        setProfile(profileData.profile);
        setIsAuthenticating(false);

      } catch (error: any) {
        console.error('[Layout] Auth or profile fetch failed, redirecting to login.', error);
        localStorage.removeItem('token');
        router.replace('/login');
      }
    };
    checkAuthAndFetchProfile();
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
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex w-full flex-col items-center gap-2">
            {profile ? (
              <>
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>{profile.businessName?.charAt(0) ?? 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold text-center">{profile.businessName}</span>
              </>
            ) : (
                <div className="flex w-full flex-col items-center gap-2">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
            )}
          </div>
        </SidebarHeader>
        <SidebarSeparator />
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

            <SidebarMenuItem>
              <SidebarMenuButton
                href="/dashboard/deploy"
                isActive={isActive('/dashboard/deploy')}
                tooltip="Estado del Deploy"
              >
                <Rocket />
                <span>Estado del Deploy</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

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
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden"/>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
