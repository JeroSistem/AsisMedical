'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { MAIN_NAVIGATION, getNavigationByRole, getModuleWithSubmodules } from '@/lib/navigation';
import { NavigationItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  applyModuleOrder,
  loadSidebarModuleOrder,
  reorderModuleIds,
  saveSidebarModuleOrder,
} from '@/lib/sidebar-order';
import { 
  Users, 
  FileText, 
  Calendar, 
  Activity,
  Home,
  Stethoscope,
  Pill,
  Calculator,
  ClipboardList,
  BarChart3,
  Shield,
  UserCog
} from 'lucide-react';


interface ModuleNavigationProps {
  userRole: string;
  className?: string;
  variant?: 'grid' | 'sidebar' | 'compact';
}

// Componente de navegación principal con submódulos
export function ModuleNavigation({ userRole, className = '', variant = 'grid' }: ModuleNavigationProps) {
  const pathname = usePathname();
  // Temporarily use static modules instead of API
  const accessibleModules = getNavigationByRole(userRole);

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
        {accessibleModules.map((module) => {
          const isActive = pathname === module.href;
          const hasSubmodules = module.children && module.children.length > 0;
          
          return (
            <Card 
              key={module.id}
              className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
                isActive 
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                  : 'hover:scale-105'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {module.icon}
                  </div>
                  {hasSubmodules && (
                    <Badge variant="secondary" className="text-xs">
                      {module.children?.length} submódulos
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardTitle className="text-lg font-semibold mb-2">
                  {module.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {module.description}
                </p>
                
                {/* Submódulos preview */}
                {hasSubmodules && (
                  <div className="space-y-1 mb-3">
                    {module.children?.slice(0, 2).map((submodule) => (
                      <div key={submodule.id} className="flex items-center text-xs text-muted-foreground">
                        <span className="mr-2">{submodule.icon}</span>
                        <span className="truncate">{submodule.title}</span>
                      </div>
                    ))}
                    {module.children && module.children.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{module.children.length - 2} más...
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Link href={module.href}>
                    <Button size="sm" variant="outline">
                      Acceder
                    </Button>
                  </Link>
                  {isActive && (
                    <Badge variant="default" className="text-xs">
                      Activo
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return null;
}

interface CompactModuleNavigationProps {
  userRole: string;
}

// Módulos simplificados para el sidebar
const sidebarModules = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['Administrador', 'Médico', 'Enfermero', 'Recepción']
  },
  {
    name: 'Pacientes',
    href: '/patients',
    icon: Users,
    roles: ['Administrador', 'Médico', 'Enfermero', 'Recepción']
  },
  {
    name: 'Historias Clínicas',
    href: '/historias/historia-clinica',
    icon: FileText,
    roles: ['Administrador', 'Médico', 'Enfermero']
  },
  {
    name: 'Citas',
    href: '/citas',
    icon: Calendar,
    roles: ['Administrador', 'Médico', 'Enfermero', 'Recepción']
  },
  {
    name: 'Triage',
    href: '/triage',
    icon: Activity,
    roles: ['Administrador', 'Médico', 'Enfermero']
  },
  {
    name: 'Laboratorio',
    href: '/laboratorio',
    icon: Stethoscope,
    roles: ['Administrador', 'Médico', 'Enfermero']
  },
  {
    name: 'Farmacia',
    href: '/farmacia',
    icon: Pill,
    roles: ['Administrador', 'Médico', 'Enfermero']
  },
  {
    name: 'Facturación',
    href: '/facturacion',
    icon: Calculator,
    roles: ['Administrador']
  },
  {
    name: 'Contabilidad',
    href: '/contabilidad',
    icon: Calculator,
    roles: ['Administrador']
  },
  {
    name: 'Reportes',
    href: '/reportes',
    icon: BarChart3,
    roles: ['Administrador', 'Médico']
  },
  {
    name: 'Auditoría',
    href: '/auditoria',
    icon: ClipboardList,
    roles: ['Administrador']
  },
  {
    name: 'Calidad',
    href: '/calidad',
    icon: Shield,
    roles: ['Administrador', 'Médico']
  },
  {
    name: 'Administración',
    href: '/admin',
    icon: UserCog,
    roles: ['Administrador']
  }
];

// Componente de navegación compacta para sidebar (RESPONSIVE)
export function CompactModuleNavigation({ userRole }: CompactModuleNavigationProps) {
  const pathname = usePathname();

  const filteredModules = sidebarModules.filter(module => 
    Array.isArray(module.roles) && module.roles.includes(userRole)
  );

  return (
    <nav className="space-y-1">
      {filteredModules.map((module) => {
        const isActive = pathname === module.href || pathname.startsWith(module.href + '/');
        
        return (
            <Link
            key={module.href}
            href={module.href as any}
            className={cn(
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors touch-target',
              'hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-muted-foreground'
            )}
          >
            {module.icon && (
            <module.icon className={cn(
              'mr-3 h-4 w-4 flex-shrink-0',
              isActive ? 'text-sidebar-accent-foreground' : 'text-sidebar-muted-foreground group-hover:text-sidebar-foreground'
            )} />)}
            <span className="truncate">{module.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// Componente de navegación con submódulos expandibles + reordenamiento
export function CompactModuleNavigationWithSubmodules({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const roleModules = useMemo(() => getNavigationByRole(userRole), [userRole]);

  const [orderIds, setOrderIds] = useState<string[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [moveMode, setMoveMode] = useState(false);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Cargar orden guardado al montar / cambiar rol
  useEffect(() => {
    const saved = loadSidebarModuleOrder();
    const baseIds = roleModules.map((m) => m.id);
    if (saved.length) {
      const merged = applyModuleOrder(
        roleModules,
        saved
      ).map((m) => m.id);
      setOrderIds(merged.length ? merged : baseIds);
    } else {
      setOrderIds(baseIds);
    }
  }, [roleModules]);

  // Prefetch de rutas del menú para que el cambio de módulo no espere compilación en frío
  useEffect(() => {
    const hrefs = new Set<string>();
    roleModules.forEach((module) => {
      if (module.href && module.href !== '#') hrefs.add(module.href);
      module.children?.forEach((sub) => {
        if (sub.href && sub.href !== '#') hrefs.add(sub.href);
        sub.children?.forEach((nested) => {
          if (nested.href && nested.href !== '#') hrefs.add(nested.href);
        });
      });
    });

    hrefs.forEach((href) => {
      try {
        router.prefetch(href);
      } catch {
        // Prefetch best-effort
      }
    });
  }, [roleModules, router]);

  const accessibleModules = useMemo(
    () => applyModuleOrder(roleModules, orderIds),
    [roleModules, orderIds]
  );

  // Al cargar/recargar: todos contraídos. Solo se expanden al hacer clic.

  const persistOrder = useCallback((ids: string[]) => {
    setOrderIds(ids);
    saveSidebarModuleOrder(ids);
  }, []);

  const toggleModule = (moduleId: string) => {
    if (moveMode) return;
    setExpandedModules((prev) => {
      const newExpanded = new Set(prev);
      const module =
        accessibleModules.find((m) => m.id === moduleId) ||
        accessibleModules.flatMap((m) => m.children || []).find((m) => m.id === moduleId);

      if (module && module.href === '#') {
        newExpanded.add(moduleId);
      } else if (prev.has(moduleId)) {
        newExpanded.delete(moduleId);
      } else {
        newExpanded.add(moduleId);
      }
      return newExpanded;
    });
  };

  const activateMove = (moduleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMoveMode(true);
    setMovingId(moduleId);
  };

  const exitMoveMode = () => {
    setMoveMode(false);
    setMovingId(null);
    setDragOverId(null);
  };

  const onDragStart = (moduleId: string, e: React.DragEvent) => {
    if (!moveMode) {
      e.preventDefault();
      return;
    }
    setMovingId(moduleId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', moduleId);
  };

  const onDragOver = (moduleId: string, e: React.DragEvent) => {
    if (!moveMode || !movingId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverId !== moduleId) setDragOverId(moduleId);
  };

  const onDrop = (targetId: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!moveMode) return;

    const fromId = e.dataTransfer.getData('text/plain') || movingId;
    if (!fromId || fromId === targetId) {
      setDragOverId(null);
      return;
    }

    const currentIds = accessibleModules.map((m) => m.id);
    const next = reorderModuleIds(currentIds, fromId, targetId);
    persistOrder(next);
    setMovingId(fromId);
    setDragOverId(null);
  };

  const itemClass = (active: boolean) =>
    cn('nav-item-stitch group', active && 'nav-item-stitch--active');

  if (accessibleModules.length === 0) {
    return (
      <nav className="space-y-0.5 px-1">
        <div className="px-2.5 py-2 text-[13px] text-[#4d7f8f]">
          No hay módulos disponibles para este rol
        </div>
      </nav>
    );
  }

  return (
    <nav className="space-y-0.5 px-1 pb-2">
      {moveMode && (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-md border border-[#39b8fd]/35 bg-white/60 px-2 py-1.5">
          <p className="text-[11px] leading-snug text-[#2d5f70]">
            Modo mover: arrastra el módulo a la posición deseada
          </p>
          <button
            type="button"
            onClick={exitMoveMode}
            className="shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold text-[#163a47] hover:bg-[#39b8fd]/15"
          >
            Listo
          </button>
        </div>
      )}

      {accessibleModules.map((module) => {
        const isActive = pathname === module.href;
        const hasSubmodules = module.children && module.children.length > 0;
        const isExpanded = expandedModules.has(module.id) && !moveMode;
        const isSubmoduleActive = module.children?.some(
          (sub) => pathname === sub.href || pathname.startsWith(sub.href + '/')
        );
        const isMoving = movingId === module.id;
        const isDropTarget = dragOverId === module.id && movingId !== module.id;

        const moveButton = (
          <button
            type="button"
            title={moveMode ? 'Arrastra para reubicar' : 'Activar mover módulo'}
            aria-label={`Mover módulo ${module.title}`}
            draggable={moveMode}
            onClick={(e) => activateMove(module.id, e)}
            onDragStart={(e) => {
              e.stopPropagation();
              onDragStart(module.id, e);
            }}
            className={cn(
              'flex h-6 w-6 shrink-0 items-center justify-center rounded text-[16px] leading-none transition-colors',
              moveMode && isMoving
                ? 'bg-[#39b8fd] text-white cursor-grabbing'
                : 'text-[#4d7f8f] hover:bg-white/60 hover:text-[#163a47]',
              moveMode && 'cursor-grab'
            )}
          >
            +
          </button>
        );

        return (
          <div
            key={module.id}
            className={cn(
              'space-y-0.5 rounded-md transition-colors',
              isDropTarget && 'bg-white/70 ring-1 ring-[#39b8fd]/45',
              isMoving && moveMode && 'opacity-70'
            )}
            draggable={moveMode}
            onDragStart={(e) => onDragStart(module.id, e)}
            onDragOver={(e) => onDragOver(module.id, e)}
            onDrop={(e) => onDrop(module.id, e)}
            onDragEnd={() => {
              setDragOverId(null);
            }}
          >
            <div className="relative">
              {hasSubmodules ? (
                <Collapsible open={isExpanded} onOpenChange={() => toggleModule(module.id)}>
                  <div className={cn(itemClass(isActive || !!isSubmoduleActive || isExpanded), 'pr-1')}>
                    {moveButton}
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        disabled={moveMode}
                        onClick={(e) => {
                          if (moveMode || module.href === '#') {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                        className="flex min-w-0 flex-1 items-center gap-2 text-left disabled:cursor-default"
                      >
                        <span className="text-[15px]">{module.icon}</span>
                        <span className="nav-item__label flex-1 truncate">{module.title}</span>
                        {!moveMode && (
                          <ChevronDown
                            className={cn(
                              'h-3.5 w-3.5 shrink-0 opacity-70 transition-transform',
                              isExpanded && 'rotate-180'
                            )}
                          />
                        )}
                      </button>
                    </CollapsibleTrigger>
                  </div>

                  {!moveMode && (
                    <CollapsibleContent className="ml-2 mt-0.5 space-y-0.5 rounded-md border border-[#d7eef4] bg-white p-1.5 shadow-sm">
                      {module.children?.map((submodule) => {
                        const isSubActive =
                          pathname === submodule.href ||
                          pathname.startsWith(submodule.href + '/');
                        const hasNestedSubmodules =
                          submodule.children && submodule.children.length > 0;
                        const isNestedExpanded = expandedModules.has(submodule.id);
                        const isNestedSubActive = submodule.children?.some(
                          (nested) =>
                            pathname === nested.href ||
                            pathname.startsWith(nested.href + '/')
                        );

                        return (
                          <div key={submodule.id} className="space-y-0.5">
                            {hasNestedSubmodules ? (
                              <Collapsible
                                open={isNestedExpanded}
                                onOpenChange={() => toggleModule(submodule.id)}
                              >
                                <CollapsibleTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={() => toggleModule(submodule.id)}
                                    className={itemClass(isSubActive || !!isNestedSubActive)}
                                  >
                                    <span className="text-[14px]">{submodule.icon}</span>
                                    <span className="flex-1 truncate">{submodule.title}</span>
                                    <ChevronDown
                                      className={cn(
                                        'h-3 w-3 shrink-0 opacity-70 transition-transform',
                                        isNestedExpanded && 'rotate-180'
                                      )}
                                    />
                                  </button>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="ml-2 space-y-0.5 border-l border-slate-200 pl-2">
                                  {submodule.children?.map((nestedSubmodule) => {
                                    const isNestedActive =
                                      pathname === nestedSubmodule.href ||
                                      pathname.startsWith(nestedSubmodule.href + '/');
                                    return (
                                      <Link
                                        key={nestedSubmodule.id}
                                        href={nestedSubmodule.href}
                                        className={itemClass(isNestedActive)}
                                      >
                                        <span className="text-[12px]">{nestedSubmodule.icon}</span>
                                        <span className="flex-1 truncate text-[12px]">
                                          {nestedSubmodule.title}
                                        </span>
                                      </Link>
                                    );
                                  })}
                                </CollapsibleContent>
                              </Collapsible>
                            ) : (
                              <Link href={submodule.href} className={itemClass(isSubActive)} prefetch>
                                <span className="text-[14px]">{submodule.icon}</span>
                                <span className="flex-1 truncate">{submodule.title}</span>
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              ) : (
                <div className={cn(itemClass(isActive), 'pr-1')}>
                  {moveButton}
                  {moveMode ? (
                    <span className="flex min-w-0 flex-1 items-center gap-2">
                      <span className="text-[15px]">{module.icon}</span>
                      <span className="flex-1 truncate">{module.title}</span>
                    </span>
                  ) : (
                    <Link
                      href={module.href}
                      className="flex min-w-0 flex-1 items-center gap-2"
                    >
                      <span className="text-[15px]">{module.icon}</span>
                      <span className="flex-1 truncate">{module.title}</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

// Componente de navegación de breadcrumbs
export function BreadcrumbNavigation({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  const allItems = getAllAccessibleItems(userRole);
  
  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    const pathSegments = pathname.split('/').filter(Boolean);
    
    let currentPath = '';
    for (const segment of pathSegments) {
      currentPath += `/${segment}`;
      const item = allItems.find(item => item.href === currentPath);
      if (item) {
        breadcrumbs.push(item);
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.id}>
          {index > 0 && <span>/</span>}
          <Link
            href={breadcrumb.href}
            className={`hover:text-foreground transition-colors ${
              index === breadcrumbs.length - 1 ? 'text-foreground font-medium' : ''
            }`}
          >
            <span className="mr-1">{breadcrumb.icon}</span>
            {breadcrumb.title}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}

// Componente de navegación rápida (Quick Access)
export function QuickAccessNavigation({ userRole }: { userRole: string }) {
  const accessibleModules = getNavigationByRole(userRole);
  const quickAccessModules = accessibleModules.slice(0, 6);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
      {quickAccessModules.map((module) => (
        <Link key={module.id} href={module.href}>
          <Button
            variant="outline"
            size="sm"
            className="h-16 flex flex-col items-center justify-center space-y-1 hover:bg-accent touch-target"
          >
            <span className="text-lg">{module.icon}</span>
            <span className="text-xs font-medium text-center leading-tight">
              {module.title}
            </span>
          </Button>
        </Link>
      ))}
    </div>
  );
}

// Componente de navegación por categorías
export function CategoryNavigation({ userRole }: { userRole: string }) {
  const accessibleModules = getNavigationByRole(userRole);
  
  const categories = {
    'Atención Médica': ['patients', 'triage', 'historias', 'asistencial'],
    'Servicios': ['laboratorio', 'imagenes-diagnosticas', 'farmacia', 'citas'],
    'Administración': ['admin', 'inventario', 'auditoria', 'calidad'],
    'Financiero': ['contabilidad', 'presupuesto', 'cartera', 'facturacion'],
    'Recursos Humanos': ['nomina'],
    'Reportes': ['reportes', 'informe'],
  };

  return (
    <div className="space-y-6">
      {Object.entries(categories).map(([categoryName, moduleIds]) => {
        const categoryModules = accessibleModules.filter(module => 
          moduleIds.includes(module.id)
        );

        if (categoryModules.length === 0) return null;

        return (
          <div key={categoryName} className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {categoryName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryModules.map((module) => (
                <Link key={module.id} href={module.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer touch-target">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {module.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{module.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {module.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Función auxiliar para obtener todos los elementos accesibles
function getAllAccessibleItems(userRole: string) {
  const modules = getNavigationByRole(userRole);
  const allItems: any[] = [];
  
  modules.forEach(module => {
    allItems.push(module);
    if (module.children) {
      allItems.push(...module.children);
    }
  });
  
  return allItems;
} 