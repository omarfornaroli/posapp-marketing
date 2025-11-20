
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
  SidebarMenuButton,
} from '@/components/ui/sidebar-dashboard';
import {
  Home,
  Rocket,
  CreditCard,
  User,
  LogOut,
  Loader2,
  Server,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
        
        if (profileData.success && profileData.profile) {
            setProfile(profileData.profile);
        } else {
            console.error('[Layout] Could not fetch profile:', profileData.message || 'Profile data is missing.');
            // Don't throw, just leave profile as null
        }

      } catch (error: any) {
        console.error('[Layout] Auth or profile fetch failed, redirecting to login.', error);
        localStorage.removeItem('token');
        router.replace('/login');
        return; // Stop execution if auth fails
      }
      
      setIsAuthenticating(false);
    };
    checkAuthAndFetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error("Logout API call failed, proceeding with client-side logout.", error);
    } finally {
      localStorage.removeItem('token');
      router.replace('/login');
    }
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
                <Avatar className="w-16 h-16 transition-all duration-300 group-data-[state=collapsed]:w-10 group-data-[state=collapsed]:h-10">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>{profile.businessName?.charAt(0) ?? 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold text-center transition-opacity duration-200 group-data-[state=collapsed]:opacity-0 group-data-[state=collapsed]:pointer-events-none">
                    {profile.businessName}
                </span>
              </>
            ) : (
                <div className="flex w-full flex-col items-center gap-2">
                    <Skeleton className="h-16 w-16 rounded-full transition-all duration-300 group-data-[state=collapsed]:h-10 group-data-[state=collapsed]:w-10" />
                    <Skeleton className="h-4 w-24 transition-opacity duration-200 group-data-[state=collapsed]:opacity-0" />
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
                tooltip="Estado de la app"
              >
                <Server />
                <span>Estado de la app</span>
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
           <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="#"
                onClick={handleLogout}
                tooltip="Cerrar Sesión"
              >
                <LogOut />
                <span>Cerrar Sesión</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
