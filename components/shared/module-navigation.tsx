'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Configuración completa de módulos del sistema médico
const MEDICAL_MODULES = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Panel principal con estadísticas',
    icon: '📊',
    href: '/dashboard',
    roles: ['Médico', 'Enfermero', 'Administrador'],
    isActive: true,
  },
  {
    id: 'triage',
    title: 'Triage',
    description: 'Sistema de priorización de emergencias',
    icon: '🏥',
    href: '/triage',
    roles: ['Médico', 'Enfermero'],
    isActive: true,
  },
  {
    id: 'asistencial',
    title: 'Asistencial',
    description: 'Gestión de atención médica',
    icon: '👨‍⚕️',
    href: '/asistencial',
    roles: ['Médico', 'Enfermero'],
    isActive: true,
  },
  {
    id: 'historias',
    title: 'Historias Clínicas',
    description: 'Gestión de historias médicas',
    icon: '📋',
    href: '/historias',
    roles: ['Médico', 'Enfermero'],
    isActive: true,
  },
  {
    id: 'laboratorio',
    title: 'Laboratorio',
    description: 'Exámenes y resultados de laboratorio',
    icon: '🧪',
    href: '/laboratorio',
    roles: ['Médico', 'Enfermero'],
    isActive: true,
  },
  {
    id: 'imagenes',
    title: 'Imágenes Diagnósticas',
    description: 'Radiología y estudios de imagen',
    icon: '📷',
    href: '/imagenes',
    roles: ['Médico', 'Enfermero'],
    isActive: true,
  },
  {
    id: 'inventario',
    title: 'Inventario',
    description: 'Gestión de suministros médicos',
    icon: '📦',
    href: '/inventario',
    roles: ['Enfermero', 'Administrador'],
    isActive: true,
  },
  {
    id: 'calidad',
    title: 'Calidad',
    description: 'Control de calidad médica',
    icon: '⭐',
    href: '/calidad',
    roles: ['Médico', 'Administrador'],
    isActive: true,
  },
  {
    id: 'auditoria',
    title: 'Auditoría',
    description: 'Auditoría médica y administrativa',
    icon: '🔍',
    href: '/auditoria',
    roles: ['Administrador'],
    isActive: true,
  },
  {
    id: 'facturacion',
    title: 'Facturación',
    description: 'Gestión de facturación médica',
    icon: '💰',
    href: '/facturacion',
    roles: ['Administrador'],
    isActive: true,
  },
  {
    id: 'contabilidad',
    title: 'Contabilidad',
    description: 'Gestión contable del hospital',
    icon: '📊',
    href: '/contabilidad',
    roles: ['Administrador'],
    isActive: true,
  },
  {
    id: 'presupuesto',
    title: 'Presupuesto',
    description: 'Gestión presupuestaria',
    icon: '📈',
    href: '/presupuesto',
    roles: ['Administrador'],
    isActive: true,
  },
  {
    id: 'nomina',
    title: 'Nómina',
    description: 'Gestión de personal y nómina',
    icon: '👥',
    href: '/nomina',
    roles: ['Administrador'],
    isActive: true,
  },
  {
    id: 'cartera',
    title: 'Cartera',
    description: 'Gestión de cartera de pacientes',
    icon: '💳',
    href: '/cartera',
    roles: ['Administrador'],
    isActive: true,
  },
  {
    id: 'admin',
    title: 'Administración',
    description: 'Configuración del sistema',
    icon: '⚙️',
    href: '/admin',
    roles: ['Administrador'],
    isActive: true,
  },
];

interface ModuleNavigationProps {
  userRole: string;
  className?: string;
}

export function ModuleNavigation({ userRole, className = '' }: ModuleNavigationProps) {
  const pathname = usePathname();

  // Filtrar módulos accesibles para el rol del usuario
  const accessibleModules = MEDICAL_MODULES.filter(
    (module) => module.roles.includes(userRole) && module.isActive
  );

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
      {accessibleModules.map((module) => {
        const isActive = pathname === module.href;
        
        return (
          <Link key={module.id} href={module.href}>
            <Card 
              className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
                isActive 
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                  : 'hover:scale-105'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-blue-500 text-white">
                    {module.icon}
                  </div>
                  {!module.isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Próximamente
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardTitle className="text-lg font-semibold mb-2">
                  {module.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {module.description}
                </p>
                {isActive && (
                  <Badge className="mt-2" variant="default">
                    Activo
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

// Componente de navegación compacta para sidebar - MEJORADO
export function CompactModuleNavigation({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  
  // Debug: Verificar que los módulos se están cargando
  console.log('MEDICAL_MODULES:', MEDICAL_MODULES);
  console.log('userRole:', userRole);
  
  const accessibleModules = MEDICAL_MODULES.filter(
    (module) => module.roles.includes(userRole) && module.isActive
  );
  
  // Debug: Verificar los módulos accesibles
  console.log('accessibleModules:', accessibleModules);
  console.log('Total modules:', MEDICAL_MODULES.length);
  console.log('Active modules:', MEDICAL_MODULES.filter(m => m.isActive).length);

  return (
    <nav className="space-y-2">
      {accessibleModules.length === 0 ? (
        <div className="text-sidebar-muted-foreground text-sm px-4 py-2">
          No hay módulos disponibles para tu rol: {userRole}
        </div>
      ) : (
        accessibleModules.map((module, index) => {
          const isActive = pathname === module.href;
          
          return (
            <Link
              key={module.id}
              href={module.href}
              className={`sidebar-nav-item sidebar-hover-effect group flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 shadow-sm border-l-4 border-purple-500 active'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm'
              }`}
              style={{ '--item-index': index } as React.CSSProperties}
            >
              <span className={`text-xl transition-transform duration-200 ${
                isActive ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {module.icon}
              </span>
              <span className={`font-medium text-base transition-colors duration-200 flex-1 ${
                isActive ? 'font-semibold' : ''
              }`}>
                {module.title}
              </span>
              {isActive && (
                <div className="ml-auto w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
              )}
            </Link>
          );
        })
      )}
    </nav>
  );
} 