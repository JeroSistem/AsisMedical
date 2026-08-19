'use client';

import React, { Suspense, lazy } from 'react';
import { useSession } from 'next-auth/react';
import { useSidebar } from '@/hooks/use-sidebar';
import { SafeThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLogout } from '@/hooks/use-logout';
import { LogOut } from 'lucide-react';
import { useAppShell, useSetAppChrome, type AppChromeState } from './app-shell-context';

const CompactModuleNavigationWithSubmodules = lazy(() =>
  import('./module-navigation').then((m) => ({
    default: m.CompactModuleNavigationWithSubmodules,
  }))
);

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  contentClassName?: string;
}

function NavFallback() {
  return (
    <div className="space-y-2 px-2 py-2" aria-hidden>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-8 animate-pulse rounded-md bg-white/50" />
      ))}
    </div>
  );
}

function AppLayoutFrame({
  children,
  title,
  description,
  actions,
  showBackButton,
  onBack,
  contentClassName,
}: AppLayoutProps) {
  const { data: session, status } = useSession();
  const { sidebarOpen, toggleSidebar, isLargeScreen } = useSidebar();
  const { handleLogout } = useLogout();

  const userRole = (session?.user as { role?: string } | undefined)?.role || 'Administrador';
  const entityId = (session?.user as { entityId?: string } | undefined)?.entityId || null;
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <div className="flex h-dvh max-h-dvh overflow-hidden bg-[#f7f9fb]" data-app-shell="true">
      {/* Menú: altura fija de viewport + scroll propio */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-dvh w-[280px] shrink-0 flex-col overflow-hidden border-r border-[#8fd4e2]/50 bg-[#c5ecf4] text-[#163a47] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="shrink-0 flex flex-col items-center border-b border-white/10 px-4 py-5">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#39b8fd]/20">
            <span className="material-symbols-outlined text-[#0088b3] text-[28px]">
              local_hospital
            </span>
          </div>
          <h1 className="font-geist text-center text-[20px] font-semibold leading-tight text-[#163a47]">
            ASIS Medical
          </h1>
          <p className="mt-1 font-geist text-[11px] font-semibold uppercase tracking-[0.06em] text-[#4d7f8f]">
            Clinical ERP v1.0
          </p>
        </div>

        <div className="shrink-0 px-3 py-2.5">
          <div className="relative">
            <span className="material-symbols-outlined pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-[#4d7f8f]">
              search
            </span>
            <input
              type="search"
              placeholder="Buscar módulo..."
              className="w-full rounded-md border border-[#7ec9d8]/70 bg-white/70 py-2 pl-9 pr-3 text-[13px] text-[#163a47] outline-none placeholder:text-[#4d7f8f] focus:border-[#39b8fd]"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-4">
          <p className="mb-1 px-2 pt-1 font-geist text-[10px] font-semibold uppercase tracking-[0.08em] text-[#4d7f8f]">
            Módulos
          </p>
          <Suspense fallback={<NavFallback />}>
            <CompactModuleNavigationWithSubmodules
              userRole={userRole}
              entityId={entityId}
            />
          </Suspense>
        </div>

        {isAuthenticated && (
          <div className="shrink-0 border-t border-white/20 p-3">
            <p className="mb-2 truncate px-1 text-[12px] font-medium text-[#163a47]">
              {session?.user?.name || 'Usuario'}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 border-[#7ec9d8]/70 bg-white/80 text-[#163a47] hover:bg-white"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        )}
      </aside>

      {sidebarOpen && !isLargeScreen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Contenido: cabecera fija + formularios con scroll propio */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-30 flex h-12 shrink-0 items-center gap-3 border-b border-[#e0e3e5] bg-white px-3 sm:px-4">
          <button
            className="rounded p-1.5 text-[#45464d] hover:bg-slate-100 lg:hidden"
            onClick={toggleSidebar}
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {showBackButton && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Volver
              </Button>
            )}
            {(title || description) && (
              <div className="mr-2 hidden min-w-0 max-w-[280px] lg:block">
                {title && (
                  <h2 className="truncate font-geist text-[14px] font-semibold text-[#191c1e]">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="truncate text-[11px] text-[#76777d]">{description}</p>
                )}
              </div>
            )}
            {actions}
            <Button variant="ghost" size="icon" className="text-[#45464d]">
              <span className="material-symbols-outlined">notifications</span>
            </Button>
            <SafeThemeToggle />
            {isAuthenticated && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 text-[#45464d]"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </Button>
            )}
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="px-4 py-4 sm:px-6">
            <div className={cn('mx-auto w-full', contentClassName ?? 'max-w-[1400px]')}>
              {(title || description) && (
                <div className="mb-4 lg:hidden">
                  {title && (
                    <h1 className="font-geist text-headline-sm text-[#191c1e]">{title}</h1>
                  )}
                  {description && (
                    <p className="mt-0.5 text-body-sm text-[#45464d]">{description}</p>
                  )}
                </div>
              )}
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/** Shell persistente: conserva sidebar entre navegaciones. */
export function PersistentAppShell({ children }: { children: React.ReactNode }) {
  const shell = useAppShell();

  if (!shell?.insideShell) {
    return <>{children}</>;
  }

  const { chrome } = shell;

  return (
    <AppLayoutFrame
      title={chrome.title}
      description={chrome.description}
      actions={chrome.actions}
      showBackButton={chrome.showBackButton}
      onBack={chrome.onBack}
      contentClassName={chrome.contentClassName}
    >
      {children}
    </AppLayoutFrame>
  );
}

/**
 * Compatibilidad: si ya hay shell persistente, solo actualiza chrome.
 * Si no, renderiza el layout completo (tests / rutas aisladas).
 */
export function AppLayout(props: AppLayoutProps) {
  const shell = useAppShell();
  const chrome: AppChromeState = {
    title: props.title,
    description: props.description,
    actions: props.actions,
    showBackButton: props.showBackButton,
    onBack: props.onBack,
    contentClassName: props.contentClassName,
  };

  useSetAppChrome(chrome);

  if (shell?.insideShell) {
    return <div className="space-y-4">{props.children}</div>;
  }

  return <AppLayoutFrame {...props} />;
}

export type { AppLayoutProps };
