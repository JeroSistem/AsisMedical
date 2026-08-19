'use client';

import { SubmoduleFormPage } from '@/components/shared/submodule-form-page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyStatBlock, NoDataMessage } from '@/components/shared/no-data-message';
import { Search, AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react';

export default function AuditoriaPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auditoría</h1>
          <p className="text-gray-600 mt-2">Auditoría y control de calidad</p>
        </div>
        <Button className="bg-violet-500 hover:bg-violet-600">
          <Search className="w-4 h-4 mr-2" />
          Nueva Auditoría
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auditorías Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auditorías Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hallazgos Críticos</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reportes Generados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auditorías Pendientes */}
        <Card>
          <CardHeader>
            <CardTitle>Auditorías Pendientes</CardTitle>
            <CardDescription>
              Auditorías que requieren revisión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NoDataMessage
              title="Sin auditorías pendientes"
              description="Las auditorías que requieran revisión aparecerán aquí."
            />
          </CardContent>
        </Card>

        {/* Hallazgos Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Hallazgos Recientes</CardTitle>
            <CardDescription>
              Hallazgos de auditorías recientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NoDataMessage
              title="Sin hallazgos registrados"
              description="Los hallazgos de auditoría aparecerán aquí."
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Acciones frecuentes del módulo de auditoría
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Search className="w-6 h-6 mb-2" />
              <span>Nueva Auditoría</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="w-6 h-6 mb-2" />
              <span>Generar Reporte</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertCircle className="w-6 h-6 mb-2" />
              <span>Ver Hallazgos</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CheckCircle className="w-6 h-6 mb-2" />
              <span>Completadas</span>
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
          <SubmoduleFormPage href="/auditoria" embedded />
        </CardContent>
      </Card>
    </div>
  );
}
