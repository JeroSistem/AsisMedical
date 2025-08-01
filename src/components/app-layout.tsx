'use client';
import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Logo } from './logo';
import { Button } from './ui/button';
import { Bell, LogOut, UserCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { SidebarTrigger } from './ui/sidebar';
import { ScrollArea } from './ui/scroll-area';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [defaultOpen, setDefaultOpen] = React.useState<boolean | undefined>(undefined);
  
  React.useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('sidebar_state='))
      ?.split('=')[1];
      
    if (cookieValue !== undefined) {
      setDefaultOpen(cookieValue === 'true');
    } else {
      setDefaultOpen(true);
    }
  }, []);

  
  const user = {
    name: 'Dr. Juan Pérez',
    role: 'Médico General',
  };

  return (
    <SidebarProvider defaultOpen={defaultOpen} onOpenChange={(open) => {
      document.cookie = `sidebar_state=${open}; path=/; max-age=60*60*24*7`;
    }}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar collapsible="none">
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarNav />
        </Sidebar>
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-8 flex-shrink-0">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1" />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-6 w-6" />
                  <span className="sr-only">User Profile</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="font-bold">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.role}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
