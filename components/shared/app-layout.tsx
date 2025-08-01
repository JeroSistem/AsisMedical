'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { SessionProvider } from './session-provider';
import { SidebarNav } from './sidebar-nav';
import { CompactModuleNavigation } from './module-navigation';
import { UserMenu } from './user-menu';

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { data: session } = useSession();
  // Extraer el rol del usuario de manera segura
  const userRole = (session?.user as any)?.role || 'Médico'; // Rol por defecto
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar - 20% del ancho */}
        <aside className={`sidebar-20 fixed left-0 top-0 z-40 h-screen transform border-r bg-sidebar-background transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="sidebar-logo flex items-center justify-center border-b border-sidebar-border bg-sidebar-background">
              <h1 className="font-bold text-sidebar-foreground flex items-center space-x-3">
                <span className="text-3xl">🏥</span>
                <span>Asis Medical</span>
              </h1>
            </div>

            {/* Navegación de módulos */}
            <nav className="flex-1 sidebar-nav overflow-y-auto sidebar-content">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-sidebar-muted-foreground uppercase tracking-wider mb-4">
                  Módulos
                </h3>
                <CompactModuleNavigation userRole={userRole} />
              </div>
            </nav>

            {/* Información del usuario */}
            <div className="sidebar-user border-t border-sidebar-border bg-sidebar-background">
              <div className="flex items-center space-x-4">
                <div className="sidebar-user-avatar rounded-full bg-sidebar-primary flex items-center justify-center shadow-sm">
                  <span className="text-base font-semibold text-sidebar-primary-foreground">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-sidebar-foreground truncate">
                    {session?.user?.name || 'Usuario'}
                  </p>
                  <p className="text-sm text-sidebar-muted-foreground truncate">
                    {userRole}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido principal - 80% del ancho */}
        <main className="main-content-80">
          {/* Header */}
          <header className="header-container">
                <div className="flex-1" />
                
                {/* Acciones del header */}
                <div className="flex items-center space-x-4">
              {/* Notificaciones */}
              <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive animate-pulse" />
              </button>

              {/* Perfil */}
              <UserMenu />
            </div>
          </header>

          {/* Contenido de la página */}
          <div className="page-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SessionProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SessionProvider>
  );
}

export default AppLayout;
