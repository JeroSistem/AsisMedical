'use client';

import { SubmoduleFormPage } from '@/components/shared/submodule-form-page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyStatBlock, NoDataMessage } from '@/components/shared/no-data-message';
import { Calendar, Users, Activity, Clock } from 'lucide-react';

export default function AsistencialPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asistencial</h1>
          <p className="text-gray-600 mt-2">Gestión asistencial y atención médica</p>
        </div>
        <Button className="bg-teal-500 hover:bg-teal-600">
          <Activity className="w-4 h-4 mr-2" />
          Nueva Atención
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Atendidos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Atención</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atenciones Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Atenciones Recientes</CardTitle>
            <CardDescription>
              Últimas atenciones médicas registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NoDataMessage
              title="Sin atenciones recientes"
              description="Las atenciones registradas aparecerán aquí."
            />
          </CardContent>
        </Card>

        {/* Próximas Atenciones */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Atenciones</CardTitle>
            <CardDescription>
              Atenciones programadas para hoy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NoDataMessage
              title="Sin atenciones programadas"
              description="Las atenciones agendadas aparecerán aquí."
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Acciones frecuentes del módulo asistencial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Users className="w-6 h-6 mb-2" />
              <span>Nueva Atención</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="w-6 h-6 mb-2" />
              <span>Programar Cita</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Activity className="w-6 h-6 mb-2" />
              <span>Ver Estadísticas</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Clock className="w-6 h-6 mb-2" />
              <span>Historial</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Formulario del módulo</CardTitle>
          <CardDescription>Registro y parametrización</CardDescription>
        </CardHeader>
        <CardContent>
          <SubmoduleFormPage href="/asistencial" embedded />
        </CardContent>
      </Card>
    </div>
  );
}
