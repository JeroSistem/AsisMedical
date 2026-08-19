"use client";

import { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { EmptyStatBlock, NoDataMessage } from '@/components/shared/no-data-message';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, TestTube, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function LaboratorioPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const actions = (
    <>
      <Button variant="outline">
        <FileText className="h-4 w-4 mr-2" />
        Ver Reportes
      </Button>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Nuevo Examen
      </Button>
    </>
  );

  return (
    <ModulePageLayout
      title="Laboratorio clínico"
      description="Exámenes y resultados — ASIS Medical Head"
      actions={actions}
      maxWidth="7xl"
    >

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TestTube className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Exámenes</p>
                  <EmptyStatBlock />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Completados</p>
                  <EmptyStatBlock />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <EmptyStatBlock />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Urgentes</p>
                  <EmptyStatBlock />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar exámenes por paciente, tipo o doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          </CardContent>
        </Card>

        {/* Exams List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Exámenes</CardTitle>
          </CardHeader>
          <CardContent>
            <NoDataMessage
              title="Sin exámenes registrados"
              description="Los exámenes de laboratorio aparecerán aquí cuando se registren en el sistema."
            />
          </CardContent>
        </Card>
    </ModulePageLayout>
  );
}
