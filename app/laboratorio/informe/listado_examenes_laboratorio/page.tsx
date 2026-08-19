'use client';

import React, { useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  Download,
  Eye,
  FileText,
  TestTube,
  Calendar,
  User,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Sin datos hasta integración con BD
const mockExamenes: Array<{
  id: number;
  numeroExamen: string;
  paciente: string;
  documento: string;
  procedimiento: string;
  fechaSolicitud: string;
  fechaRealizacion: string | null;
  medicoSolicitante: string;
  estado: string;
  resultado: string;
  prioridad: string;
}> = [];

const statusColors = {
  completado: "bg-green-100 text-green-800",
  en_proceso: "bg-blue-100 text-blue-800",
  pendiente: "bg-yellow-100 text-yellow-800",
  cancelado: "bg-red-100 text-red-800"
};

const statusLabels = {
  completado: "Completado",
  en_proceso: "En Proceso",
  pendiente: "Pendiente",
  cancelado: "Cancelado"
};

const priorityColors = {
  urgent: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  normal: "bg-green-100 text-green-800",
  low: "bg-gray-100 text-gray-800"
};

const priorityLabels = {
  urgent: "Urgente",
  high: "Alta",
  normal: "Normal",
  low: "Baja"
};

export default function ListadoExamenesLaboratorioPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar exámenes
  const filteredExamenes = mockExamenes.filter(exam => {
    const matchesSearch = 
      exam.numeroExamen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.documento.includes(searchTerm) ||
      exam.procedimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.medicoSolicitante.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFechaInicio = !fechaInicio || exam.fechaSolicitud >= fechaInicio;
    const matchesFechaFin = !fechaFin || exam.fechaSolicitud <= fechaFin;
    const matchesEstado = !estadoFiltro || exam.estado === estadoFiltro;
    
    return matchesSearch && matchesFechaInicio && matchesFechaFin && matchesEstado;
  });

  // Paginación
  const totalPages = Math.ceil(filteredExamenes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExamenes = filteredExamenes.slice(startIndex, startIndex + itemsPerPage);

  const handleExportar = () => {
    toast({
      title: 'Exportando',
      description: 'El listado se está exportando...',
    });
  };

  const handleLimpiarFiltros = () => {
    setSearchTerm('');
    setFechaInicio('');
    setFechaFin('');
    setEstadoFiltro('');
    setCurrentPage(1);
  };

  const actions = (
    <>
      <Button variant="outline" size="sm" onClick={() => window.history.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportar}>
        <Download className="h-4 w-4 mr-2" />
        Exportar
      </Button>
      <Button variant="outline" size="sm" onClick={handleLimpiarFiltros}>
        <Filter className="h-4 w-4 mr-2" />
        Limpiar Filtros
      </Button>
    </>
  );

  return (
    <ModulePageLayout
      title="Listado Exámenes Laboratorio"
      description="Consulte y gestione todos los exámenes de laboratorio realizados"
      actions={actions}
      maxWidth="7xl"
    >
      {/* Filtros de búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda general */}
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="busqueda">Búsqueda General</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="busqueda"
                  placeholder="Buscar por número, paciente, documento, procedimiento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Fecha Inicio */}
            <div className="space-y-2">
              <Label htmlFor="fecha-inicio">Fecha Inicio</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fecha-inicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Fecha Fin */}
            <div className="space-y-2">
              <Label htmlFor="fecha-fin">Fecha Fin</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fecha-fin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <select
                id="estado"
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Todos</option>
                <option value="completado">Completado</option>
                <option value="en_proceso">En Proceso</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TestTube className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exámenes</p>
                <p className="text-2xl font-bold text-gray-900">{filteredExamenes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredExamenes.filter(e => e.estado === 'completado').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredExamenes.filter(e => e.estado === 'pendiente').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TestTube className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredExamenes.filter(e => e.estado === 'en_proceso').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de exámenes */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Exámenes ({filteredExamenes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">N° Examen</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Paciente</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Documento</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Procedimiento</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Fecha Solicitud</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Fecha Realización</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Médico</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Estado</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Resultado</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExamenes.map((exam) => (
                  <tr key={exam.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm font-medium text-gray-900">{exam.numeroExamen}</td>
                    <td className="p-3 text-sm text-gray-700">{exam.paciente}</td>
                    <td className="p-3 text-sm text-gray-600">{exam.documento}</td>
                    <td className="p-3 text-sm text-gray-700">{exam.procedimiento}</td>
                    <td className="p-3 text-sm text-gray-600">{exam.fechaSolicitud}</td>
                    <td className="p-3 text-sm text-gray-600">
                      {exam.fechaRealizacion || '-'}
                    </td>
                    <td className="p-3 text-sm text-gray-600">{exam.medicoSolicitante}</td>
                    <td className="p-3">
                      <Badge className={statusColors[exam.estado as keyof typeof statusColors]}>
                        {statusLabels[exam.estado as keyof typeof statusLabels]}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant={exam.resultado === 'Normal' ? 'default' : 'destructive'}
                        className={exam.resultado === 'Normal' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {exam.resultado}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginatedExamenes.length === 0 && (
              <div className="text-center py-12">
                <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron exámenes
                </h3>
                <p className="text-gray-600">
                  {searchTerm || fechaInicio || fechaFin || estadoFiltro
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'No hay exámenes registrados'}
                </p>
              </div>
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredExamenes.length)} de {filteredExamenes.length} exámenes
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ModulePageLayout>
  );
}

