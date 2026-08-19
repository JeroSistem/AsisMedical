'use client';

import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout'
import { SubmoduleFormPage } from '@/components/shared/submodule-form-page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Package, Warehouse, Truck, FileText, BarChart3 } from 'lucide-react';
import { EmptyStatBlock } from '@/components/shared/no-data-message';
import Link from 'next/link';

export default function InventarioPage() {
  const inventarioModules = [
    {
      title: 'Bodegas',
      description: 'Gestión de bodegas y almacenes',
      icon: Warehouse,
      href: '/inventario/bodegas',
      color: 'bg-blue-500',
      badge: 'Gestión'
    },
    {
      title: 'Equivalencias',
      description: 'Configuración de equivalencias entre productos',
      icon: Package,
      href: '/inventario/equivalencias',
      color: 'bg-green-500',
      badge: 'Configuración'
    },
    {
      title: 'Proveedores',
      description: 'Gestión de proveedores y contactos',
      icon: Truck,
      href: '/inventario/proveedores',
      color: 'bg-purple-500',
      badge: 'Gestión'
    },
    {
      title: 'Tipos de inventario',
      description: 'Configuración de categorías de inventario',
      icon: Package,
      href: '/inventario/tipos-inventario',
      color: 'bg-orange-500',
      badge: 'Configuración'
    },
    {
      title: 'Tipos de notas',
      description: 'Configuración de tipos de notas de inventario',
      icon: FileText,
      href: '/inventario/tipos-notas',
      color: 'bg-teal-500',
      badge: 'Configuración'
    },
    {
      title: 'Tipo ingreso artículos',
      description: 'Gestión de tipos de ingreso de artículos',
      icon: Package,
      href: '/inventario/tipo-ingreso',
      color: 'bg-emerald-500',
      badge: 'Gestión'
    },
    {
      title: 'Nota salida artículos',
      description: 'Gestión de notas de salida de artículos',
      icon: Package,
      href: '/inventario/nota-salida',
      color: 'bg-red-500',
      badge: 'Gestión'
    },
    {
      title: 'Movimiento de artículos',
      description: 'Control de movimientos de inventario',
      icon: Package,
      href: '/inventario/movimiento',
      color: 'bg-indigo-500',
      badge: 'Control'
    },
    {
      title: 'Órdenes de Compra',
      description: 'Gestión de órdenes de compra',
      icon: FileText,
      href: '/inventario/ordenes-compra',
      color: 'bg-pink-500',
      badge: 'Gestión'
    },
    {
      title: 'Compras',
      description: 'Control de compras y adquisiciones',
      icon: Package,
      href: '/inventario/compras',
      color: 'bg-yellow-500',
      badge: 'Control'
    },
    {
      title: 'Entrega Ambulatorio',
      description: 'Gestión de entregas para pacientes ambulatorios',
      icon: Package,
      href: '/inventario/entrega-ambulatorio',
      color: 'bg-cyan-500',
      badge: 'Gestión'
    },
    {
      title: 'Entrega Hospitalización',
      description: 'Gestión de entregas para pacientes hospitalizados',
      icon: Package,
      href: '/inventario/entrega-hospitalizacion',
      color: 'bg-violet-500',
      badge: 'Gestión'
    },
    {
      title: 'Interface Inventario',
      description: 'Interfaces y conexiones del sistema de inventario',
      icon: Package,
      href: '/inventario/interface',
      color: 'bg-gray-500',
      badge: 'Sistema'
    },
    {
      title: 'Informe',
      description: 'Reportes y análisis de inventario',
      icon: BarChart3,
      href: '/inventario/informe',
      color: 'bg-slate-500',
      badge: 'Reportes',
      children: [
        { title: 'Listar Movimiento', href: '/inventario/informe/movimiento' },
        { title: 'Kardex', href: '/inventario/informe/kardex' },
        { title: 'Listado de existencias', href: '/inventario/informe/existencias' },
        { title: 'Listado órdenes de compra', href: '/inventario/informe/ordenes-compra' },
        { title: 'Listado entrega artículos ambulatorio', href: '/inventario/informe/entrega-ambulatorio' },
        { title: 'Listado vendidos', href: '/inventario/informe/vendidos' },
        { title: 'Listado Pendientes', href: '/inventario/informe/pendientes' },
        { title: 'Listado Planilla Dispensación', href: '/inventario/informe/planilla-dispensacion' }
      ]
    }
  ];

  const actions = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Nuevo Registro
    </Button>
  );

  return (
    <ModulePageLayout
      title="📦 Inventario"
      description="Control de inventario, bodegas, proveedores y movimientos de artículos"
      actions={actions}
      maxWidth="7xl"
    >

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {inventarioModules.map((module) => {
          const IconComponent = module.icon;
          return (
            <Card key={module.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${module.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {module.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <CardDescription className="text-sm">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href={module.href}>
                    <Button variant="outline" className="w-full">
                      Acceder
                    </Button>
                  </Link>
                  
                  {module.children && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Submódulos:</p>
                      <div className="grid grid-cols-1 gap-1">
                        {module.children.slice(0, 3).map((child) => (
                          <Link key={child.title} href={child.href}>
                            <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-7">
                              {child.title}
                            </Button>
                          </Link>
                        ))}
                        {module.children.length > 3 && (
                          <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-7 text-muted-foreground">
                            +{module.children.length - 3} más...
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">📊 Estadísticas de Inventario</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <EmptyStatBlock subtitle="Productos Activos" />
          </div>
          <div className="text-center">
            <EmptyStatBlock subtitle="Proveedores" />
          </div>
          <div className="text-center">
            <EmptyStatBlock subtitle="Bodegas" />
          </div>
          <div className="text-center">
            <EmptyStatBlock subtitle="Stock Bajo" />
          </div>
        </div>
      </div>
      <ModuleCard title="Formulario del módulo" description="Registro y parametrización">
        <SubmoduleFormPage href="/inventario" embedded />
      </ModuleCard>
    </ModulePageLayout>
  );
}
