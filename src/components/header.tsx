'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Store } from 'lucide-react';

export default function Header() {
  const appTitle = 'Posify';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Store className="h-6 w-6 text-primary fill-primary/20" />
            <span className="font-bold">{appTitle}</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Button asChild variant="ghost">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
