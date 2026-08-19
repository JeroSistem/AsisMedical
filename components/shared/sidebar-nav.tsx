
'use client';

import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getNavigationByRole } from '@/lib/navigation';
import { NavigationItem } from '@/lib/types';

interface SidebarNavProps {
  userRole?: string;
}

export function SidebarNav({ userRole = 'Administrador' }: SidebarNavProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar navegación filtrada por permisos
  useEffect(() => {
    const loadNavigation = async () => {
      try {
        setIsLoading(true);
        // Agregar timestamp para evitar caché
        const response = await fetch(`/api/navigation/filtered?t=${Date.now()}`);
        const result = await response.json();
        
        // Log de depuración
        if (result.debug) {
          console.log('[SidebarNav] Información de depuración:', result.debug);
        }
        
        if (result.success && result.data) {
          console.log('[SidebarNav] Módulos recibidos:', result.data.length);
          setNavItems(result.data);
        } else {
          console.warn('[SidebarNav] No se recibieron datos, usando fallback');
          // Fallback a navegación por rol si falla
          setNavItems(getNavigationByRole(userRole));
        }
      } catch (error) {
        console.error('Error cargando navegación filtrada:', error);
        // Fallback a navegación por rol
        setNavItems(getNavigationByRole(userRole));
      } finally {
        setIsLoading(false);
      }
    };

    loadNavigation();
    
    // Escuchar eventos de actualización de permisos
    const handlePermissionUpdate = () => {
      loadNavigation();
    };
    
    window.addEventListener('permissions-updated', handlePermissionUpdate);
    
    return () => {
      window.removeEventListener('permissions-updated', handlePermissionUpdate);
    };
  }, [userRole]);

  useEffect(() => {
    // Abrir el menú si un sub-item está activo (incluyendo submódulos anidados)
    const newOpenMenus: Record<string, boolean> = {};
    for (const item of navItems) {
      // Verificar si algún hijo directo está activo
      if (item.children && item.children.some(sub => pathname.startsWith(sub.href))) {
        newOpenMenus[item.id] = true;
      }
      // Verificar si algún nieto (hijo de hijo) está activo
      if (item.children) {
        for (const subItem of item.children) {
          if (subItem.children && subItem.children.some(nested => pathname.startsWith(nested.href))) {
            newOpenMenus[item.id] = true;
            newOpenMenus[subItem.id] = true;
          }
        }
      }
    }
    setOpenMenus(newOpenMenus);
  }, [pathname, navItems]);

  const toggleMenu = (itemId: string) => {
    setOpenMenus(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };
  
  const isMenuOpen = (itemId: string) => {
    return openMenus[itemId] === true;
  };

  if (isLoading) {
    return (
      <SidebarContent className="p-1">
        <ScrollArea className="flex-1">
          <SidebarMenu className="space-y-1">
            <div className="text-sidebar-muted-foreground text-sm px-4 py-2">
              Cargando módulos...
            </div>
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
    );
  }

  return (
    <SidebarContent className="p-1">
       <ScrollArea className="flex-1">
        <SidebarMenu className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
            const hasSubItems = item.children && item.children.length > 0;

            if (hasSubItems) {
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={isActive} 
                    onClick={() => toggleMenu(item.id)}
                    className="justify-between py-1"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-sm">{item.title}</span>
                    </div>
                    {state === 'expanded' && (
                      <ChevronDown className={`h-4 w-4 transition-transform ${isMenuOpen(item.id) ? 'rotate-180' : ''}`} />
                    )}
                  </SidebarMenuButton>
                  {isMenuOpen(item.id) && state === 'expanded' && (
                    <SidebarMenuSub>
                      {item.children?.map((subItem) => {
                         const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href);
                         const hasNestedItems = subItem.children && subItem.children.length > 0;
                         
                         if (hasNestedItems) {
                           return (
                             <div key={subItem.id}>
                               <SidebarMenuItem>
                                 <SidebarMenuSubButton 
                                   isActive={isSubActive}
                                   onClick={() => toggleMenu(subItem.id)}
                                   className="justify-between"
                                 >
                                   <div className="flex items-center space-x-2">
                                     <span className="text-sm">{subItem.icon}</span>
                                     <span>{subItem.title}</span>
                                   </div>
                                   <ChevronDown className={`h-3 w-3 transition-transform ${isMenuOpen(subItem.id) ? 'rotate-180' : ''}`} />
                                 </SidebarMenuSubButton>
                               </SidebarMenuItem>
                               {isMenuOpen(subItem.id) && (
                                 <SidebarMenuSub className="ml-4">
                                   {subItem.children?.map((nestedItem) => {
                                     const isNestedActive = pathname === nestedItem.href;
                                     return (
                                       <SidebarMenuItem key={nestedItem.id}>
                                         <SidebarMenuSubButton asChild isActive={isNestedActive}>
                                           <Link href={nestedItem.href}>
                                             <div className="flex items-center space-x-2">
                                               <span className="text-xs">{nestedItem.icon}</span>
                                               <span className="text-xs">{nestedItem.title}</span>
                                             </div>
                                           </Link>
                                         </SidebarMenuSubButton>
                                       </SidebarMenuItem>
                                     )
                                   })}
                                 </SidebarMenuSub>
                               )}
                             </div>
                           );
                         }
                         
                         return (
                            <SidebarMenuItem key={subItem.id}>
                                <SidebarMenuSubButton asChild isActive={isSubActive}>
                                  <Link href={subItem.href}>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm">{subItem.icon}</span>
                                      <span>{subItem.title}</span>
                                    </div>
                                  </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuItem>
                         )
                      })}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              );
            }

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild isActive={isActive} className="py-1">
                  <Link href={item.href}>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-sm">{item.title}</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </ScrollArea>
    </SidebarContent>
  );
}
