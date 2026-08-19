'use client';

import { SubmoduleFormPage } from '@/components/shared/submodule-form-page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyStatBlock, NoDataMessage } from '@/components/shared/no-data-message';
import { CheckCircle, FileText, Clock, AlertTriangle } from 'lucide-react';

export default function AnexoTecnicoAutorizacionesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Anexo Técnico - Autorizaciones</h1>
          <p className="text-gray-600 mt-2">Gestión de autorizaciones médicas</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <CheckCircle className="w-4 h-4 mr-2" />
          Nueva Autorización
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Autorizaciones</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Authorizations */}
        <Card>
          <CardHeader>
            <CardTitle>Autorizaciones Recientes</CardTitle>
            <CardDescription>Últimas autorizaciones procesadas</CardDescription>
          </CardHeader>
          <CardContent>
            <NoDataMessage />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Operaciones frecuentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="w-4 h-4 mr-2" />
                Solicitar Autorización
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Ver Historial
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Pendientes
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Reportes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Formulario del módulo</CardTitle>
          <CardDescription>Registro y parametrización</CardDescription>
        </CardHeader>
        <CardContent>
          <SubmoduleFormPage href="/facturacion/administracion/anexo-autorizaciones" embedded />
        </CardContent>
      </Card>
    </div>
  );
}
