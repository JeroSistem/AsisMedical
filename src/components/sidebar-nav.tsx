
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

const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { 
        href: '/admin', 
        label: 'Administración',
        subItems: [
            { href: '/admin/institucion', label: 'Institución' },
            { href: '/admin/perfiles', label: 'Perfiles' },
            { href: '/admin/usuarios', label: 'Usuarios' },
            { href: '/admin/entidades', label: 'Entidades' },
            { href: '/admin/contratos', label: 'Contratos con entidades' },
            { href: '/admin/habitaciones', label: 'Habitaciones' },
            { href: '/admin/camas', label: 'Camas' },
            { href: '/admin/articulos', label: 'Artículos' },
            { href: '/admin/listas-precios', label: 'Listas de precios' },
            { href: '/admin/resolucion-dian', label: 'Resolución Dian' },
            { href: '/admin/cups-propios', label: 'Cups propios' },
            { href: '/admin/centros-servicios', label: 'Centros de servicios' },
            { href: '/admin/centros-costo', label: 'Centros de costo' },
            { href: '/admin/conceptos-facturacion', label: 'Conceptos de facturación' },
            { href: '/admin/copagos', label: 'Copagos' },
        ]
    },
    { href: '/facturacion', label: 'Facturación' },
    { href: '/citas', label: 'Citas' },
    { href: '/triage', label: 'Triage' },
    { href: '/historias/historia-clinica', label: 'Historias Clínicas' },
    { href: '/asistencial', label: 'Asistencial' },
    { href: '/inventario', label: 'Inventario' },
    { href: '/auditoria', label: 'Auditoria' },
    { href: '/imagenes', label: 'Imagenes diagnosticas' },
    { href: '/laboratorio', label: 'Laboratorio' },
    { href: '/calidad', label: 'Calidad' },
    { href: '/contabilidad', label: 'Contabilidad' },
    { href: '/presupuesto', label: 'Presupuesto' },
    { href: '/nomina', label: 'Nomina' },
    { href: '/cartera', label: 'Cartera' },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Open the menu if a sub-item is active
    const newOpenMenus: Record<string, boolean> = {};
    for (const item of navItems) {
      if (item.subItems && item.subItems.some(sub => pathname.startsWith(sub.href))) {
        newOpenMenus[item.label] = true;
      }
    }
    setOpenMenus(newOpenMenus);
  }, [pathname]);


  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };
  
  const isMenuOpen = (label: string) => {
    return openMenus[label] === true;
  };

  return (
    <SidebarContent className="p-2">
       <ScrollArea className="flex-1">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            if (hasSubItems) {
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    isActive={isActive} 
                    onClick={() => toggleMenu(item.label)}
                    className="justify-between"
                  >
                    <span>{item.label}</span>
                    {state === 'expanded' && (
                      <ChevronDown className={`h-4 w-4 transition-transform ${isMenuOpen(item.label) ? 'rotate-180' : ''}`} />
                    )}
                  </SidebarMenuButton>
                  {isMenuOpen(item.label) && state === 'expanded' && (
                    <SidebarMenuSub>
                      {item.subItems?.map((subItem) => {
                         const isSubActive = pathname === subItem.href;
                         return (
                            <SidebarMenuItem key={subItem.label}>
                                <SidebarMenuSubButton asChild isActive={isSubActive}>
                                  <Link href={subItem.href}>
                                    <span>{subItem.label}</span>
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
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.href}>
                    <span>{item.label}</span>
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
