'use client';

import React, { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Search,
  Plus,
  Save,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Encuesta {
  id: number;
  fecha: string;
  centroServicios: string;
}

// Sin datos hasta integración con BD
const mockEncuestas: Encuesta[] = [];

export default function ListadoEncuestaSatisfaccionPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [fechaInicial, setFechaInicial] = useState('13/10/2025');
  const [fechaFinal, setFechaFinal] = useState('12/11/2025');
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Filtrar encuestas
  const filteredEncuestas = mockEncuestas.filter(encuesta =>
    encuesta.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
    encuesta.centroServicios.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredEncuestas.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedEncuestas = filteredEncuestas.slice(startIndex, startIndex + recordsPerPage);

  const handleNuevo = () => {
    router.push('/calidad/encuesta-satisfaccion');
  };

  const handleEdit = (id: number) => {
    router.push(`/calidad/encuesta-satisfaccion?id=${id}`);
  };

  const handleGuardar = () => {
    toast({
      title: 'Guardado',
      description: 'Los cambios se han guardado correctamente.',
    });
  };

  const handleEliminar = () => {
    if (selectedRows.size === 0) {
      toast({
        title: 'Seleccione registros',
        description: 'Por favor, seleccione al menos un registro para eliminar.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Eliminado',
      description: `${selectedRows.size} registro(s) eliminado(s) correctamente.`,
    });
    setSelectedRows(new Set());
  };

  const toggleRowSelection = (id: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const actions = (
    <>
      <Button variant="outline" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>
    </>
  );

  return (
    <ModulePageLayout
      title="Listado Encuestas de Satisfacción"
      description="Gestione las encuestas de satisfacción del paciente"
      actions={actions}
      maxWidth="7xl"
    >
      {/* Resumen Estadístico */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-600 mb-1">Definitivamente si</p>
              <p className="text-lg font-semibold text-gray-900">0</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Probablemente si</p>
              <p className="text-lg font-semibold text-gray-900">0</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Definitivamente no</p>
              <p className="text-lg font-semibold text-gray-900">0</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Probablemente no</p>
              <p className="text-lg font-semibold text-gray-900">0</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">No responde</p>
              <p className="text-lg font-semibold text-gray-900">0</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Total</p>
              <p className="text-lg font-semibold text-gray-900">0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Búsqueda y Paginación Superior */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Búsqueda */}
            <div className="flex items-center gap-2">
              <Label htmlFor="search" className="text-sm font-medium whitespace-nowrap">
                Search:
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                  placeholder="Buscar..."
                />
              </div>
            </div>

            {/* Paginación */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="records-per-page" className="text-sm font-medium whitespace-nowrap">
                  Registros por pagina:
                </Label>
                <select
                  id="records-per-page"
                  value={recordsPerPage}
                  onChange={(e) => {
                    setRecordsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="disabled:text-gray-400 disabled:cursor-not-allowed hover:text-gray-900"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="disabled:text-gray-400 disabled:cursor-not-allowed hover:text-gray-900"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="disabled:text-gray-400 disabled:cursor-not-allowed hover:text-gray-900"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="disabled:text-gray-400 disabled:cursor-not-allowed hover:text-gray-900"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Datos */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 text-sm font-semibold text-gray-700 w-12">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === paginatedEncuestas.length && paginatedEncuestas.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(new Set(paginatedEncuestas.map(e => e.id)));
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">
                    Fecha
                  </th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-700">
                    Centro de servicios
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedEncuestas.length > 0 ? (
                  paginatedEncuestas.map((encuesta) => (
                    <tr 
                      key={encuesta.id} 
                      className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => toggleRowSelection(encuesta.id)}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(encuesta.id)}
                          onChange={() => toggleRowSelection(encuesta.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td 
                        className="p-3 text-sm text-gray-700 cursor-pointer hover:text-blue-600"
                        onClick={() => handleEdit(encuesta.id)}
                      >
                        {encuesta.fecha}
                      </td>
                      <td 
                        className="p-3 text-sm text-gray-700 cursor-pointer hover:text-blue-600"
                        onClick={() => handleEdit(encuesta.id)}
                      >
                        {encuesta.centroServicios}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Filtros de Búsqueda */}
      <Card className="mb-6">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {isFiltersOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  FILTROS DE BUSQUEDA
                </CardTitle>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">
                    RANGO DE FECHAS
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fecha-inicial" className="text-sm">
                        Fecha inicial
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="fecha-inicial"
                          type="text"
                          value={fechaInicial}
                          onChange={(e) => setFechaInicial(e.target.value)}
                          className="pl-10"
                          placeholder="DD/MM/YYYY"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fecha-final" className="text-sm">
                        Fecha final
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="fecha-final"
                          type="text"
                          value={fechaFinal}
                          onChange={(e) => setFechaFinal(e.target.value)}
                          className="pl-10"
                          placeholder="DD/MM/YYYY"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Botones de Acción */}
      <div className="flex gap-4">
        <Button onClick={handleNuevo} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo
        </Button>
        <Button onClick={handleGuardar} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Guardar
        </Button>
        <Button 
          onClick={handleEliminar} 
          variant="destructive"
          disabled={selectedRows.size === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </div>
    </ModulePageLayout>
  );
}

