'use client';

import { SubmoduleFormPage } from '@/components/shared/submodule-form-page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyStatBlock, NoDataMessage } from '@/components/shared/no-data-message';
import { FileText, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export default function Resolucion202Page() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resolución 202</h1>
          <p className="text-gray-600 mt-2">Gestión de Resolución 202</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <FileText className="w-4 h-4 mr-2" />
          Nuevo Registro
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <FileText className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cumplidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendencia</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <EmptyStatBlock />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Records */}
        <Card>
          <CardHeader>
            <CardTitle>Registros Recientes</CardTitle>
            <CardDescription>Últimos registros de Resolución 202</CardDescription>
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
                <FileText className="w-4 h-4 mr-2" />
                Crear Registro
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="w-4 h-4 mr-2" />
                Ver Cumplimientos
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="w-4 h-4 mr-2" />
                Pendientes
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
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
          <SubmoduleFormPage href="/facturacion/administracion/resolucion-202" embedded />
        </CardContent>
      </Card>
    </div>
  );
}
