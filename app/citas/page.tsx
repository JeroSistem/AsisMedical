'use client';

import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  Users,
  Building2,
  Plus,
  FileText,
  X,
  AlertCircle,
  TrendingUp,
  CheckCircle,
  CalendarDays,
  UserCheck,
  UserX
} from 'lucide-react';
import Link from 'next/link';

export default function CitasPage() {
  const gestionItems = [
    { title: 'Consultorios', icon: Building2, href: '/citas/consultorios', color: 'bg-blue-100' },
    { title: 'Horarios citas', icon: Clock, href: '/citas/horarios', color: 'bg-green-100' },
    { title: 'Asignar citas', icon: Plus, href: '/citas/asignar', color: 'bg-purple-100' },
  ];

  const informeItems = [
    { title: 'Listado Citas', icon: FileText, href: '/citas/informe/listado-citas' },
    { title: 'Citas Canceladas', icon: X, href: '/citas/informe/citas-canceladas' },
    { title: 'Inasistentes', icon: AlertCircle, href: '/citas/informe/inasistentes' },
  ];

  const actions = (
    <>
      <Badge variant="secondary" className="text-sm">
        Módulo Clínico
      </Badge>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Nueva Cita
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Ver Calendario
      </Button>
    </>
  );

  return (
    <ModulePageLayout
      title="Portal de agendamiento"
      description="Reserva y gestión de citas médicas"
      actions={actions}
      maxWidth="7xl"
    >

      {/* Gestión */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Gestión
          </CardTitle>
          <CardDescription>
            Configuración y gestión de citas médicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gestionItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <Card className={`hover:shadow-md transition-shadow cursor-pointer ${item.color}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <item.icon className="h-8 w-8 text-gray-600" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Informe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Informe
          </CardTitle>
          <CardDescription>
            Reportes y estadísticas de citas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {informeItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer bg-blue-50">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <item.icon className="h-8 w-8 text-blue-600" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Citas Hoy</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Asistieron</p>
                <p className="text-2xl font-bold">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserX className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Inasistentes</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <X className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximas Citas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Próximas Citas
          </CardTitle>
          <CardDescription>
            Citas programadas para hoy y mañana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '09:00', patient: 'Juan Pérez', doctor: 'Dr. García', status: 'confirmada' },
              { time: '10:30', patient: 'María López', doctor: 'Dr. Rodríguez', status: 'pendiente' },
              { time: '14:00', patient: 'Carlos Ruiz', doctor: 'Dr. Martínez', status: 'confirmada' },
              { time: '16:30', patient: 'Ana Silva', doctor: 'Dr. González', status: 'pendiente' },
            ].map((cita, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{cita.time}</p>
                    <p className="text-xs text-gray-500">Hora</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{cita.patient}</p>
                    <p className="text-sm text-gray-600">{cita.doctor}</p>
                  </div>
                </div>
                <Badge 
                  variant={cita.status === 'confirmada' ? 'default' : 'secondary'}
                  className={cita.status === 'confirmada' ? 'bg-green-100 text-green-800' : ''}
                >
                  {cita.status === 'confirmada' ? 'Confirmada' : 'Pendiente'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Generar Reporte
        </Button>
      </div>
    </ModulePageLayout>
  );
} 