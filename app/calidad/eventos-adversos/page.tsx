'use client';

import React, { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Save, 
  ArrowLeft,
  Calendar,
  Search,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface EventoAdverso {
  fecha: string;
  datos: {
    caidasHospitalizacion: number;
    caidasConsultaExterna: number;
    caidasUrgencias: number;
    caidasApoyoDiagnostico: number;
    caidasEventoAdverso: number;
    caidasIncidentes: number;
    eventosMedicamentosHospitalizacion: number;
    eventosMedicamentosUrgencias: number;
    eventosUlcerasMedicamentosHospitalizacion: number;
  };
}

export default function EventosAdversosPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [fechaEventos, setFechaEventos] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Datos del formulario
  const [formData, setFormData] = useState({
    caidasHospitalizacion: '',
    caidasConsultaExterna: '',
    caidasUrgencias: '',
    caidasApoyoDiagnostico: '',
    caidasEventoAdverso: '',
    caidasIncidentes: '',
    eventosMedicamentosHospitalizacion: '',
    eventosMedicamentosUrgencias: '',
    eventosUlcerasMedicamentosHospitalizacion: '',
  });

  // Datos del listado (vacío hasta integración con BD)
  const mockEventos: EventoAdverso[] = [];

  // Filtrar eventos
  const filteredEventos = mockEventos.filter(evento =>
    evento.fecha.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredEventos.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedEventos = filteredEventos.slice(startIndex, startIndex + recordsPerPage);

  const handleInputChange = (field: string, value: string) => {
    // Solo permitir números
    const numericValue = value === '' ? '' : value.replace(/[^0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const formatDate = (value: string) => {
    // Remover todo lo que no sea número
    const numbers = value.replace(/\D/g, '');
    
    // Formatear como DD/MM/AAAA
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const handleFechaChange = (value: string) => {
    const formatted = formatDate(value);
    setFechaEventos(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fechaEventos) {
      toast({
        title: 'Fecha requerida',
        description: 'Por favor, ingrese la fecha de los eventos adversos.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Aquí iría la lógica para guardar los eventos adversos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Eventos adversos guardados',
        description: 'Los eventos adversos se han guardado correctamente.',
      });
      
      // Limpiar formulario
      setFormData({
        caidasHospitalizacion: '',
        caidasConsultaExterna: '',
        caidasUrgencias: '',
        caidasApoyoDiagnostico: '',
        caidasEventoAdverso: '',
        caidasIncidentes: '',
        eventosMedicamentosHospitalizacion: '',
        eventosMedicamentosUrgencias: '',
        eventosUlcerasMedicamentosHospitalizacion: '',
      });
      setFechaEventos('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los eventos adversos. Por favor, intente nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNuevo = () => {
    setFormData({
      caidasHospitalizacion: '',
      caidasConsultaExterna: '',
      caidasUrgencias: '',
      caidasApoyoDiagnostico: '',
      caidasEventoAdverso: '',
      caidasIncidentes: '',
      eventosMedicamentosHospitalizacion: '',
      eventosMedicamentosUrgencias: '',
      eventosUlcerasMedicamentosHospitalizacion: '',
    });
    setFechaEventos('');
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

  const toggleRowSelection = (index: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
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
      <Button 
        type="submit" 
        form="eventos-form"
        size="sm"
        disabled={isLoading}
      >
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Guardando...' : 'Guardar'}
      </Button>
    </>
  );

  return (
    <ModulePageLayout
      title="EDITAR EVENTOS ADVERSOS"
      description="Registre y gestione los eventos adversos del sistema"
      actions={actions}
      maxWidth="7xl"
    >
      <form id="eventos-form" onSubmit={handleSubmit}>
        {/* Fecha */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="fecha-eventos" className="text-sm font-medium">
                Fecha eventos adversos
              </Label>
              <div className="relative max-w-xs">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fecha-eventos"
                  type="text"
                  value={fechaEventos}
                  onChange={(e) => handleFechaChange(e.target.value)}
                  className="pl-10"
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de Eventos Adversos */}
        <Card className="mb-6 bg-purple-50/50">
          <CardHeader>
            <CardTitle>Datos de Eventos Adversos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna Izquierda */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="caidas-hospitalizacion" className="text-sm font-medium">
                    TOTAL DE CAIDAS EN HOSPITALIZACION
                  </Label>
                  <Input
                    id="caidas-hospitalizacion"
                    type="text"
                    value={formData.caidasHospitalizacion}
                    onChange={(e) => handleInputChange('caidasHospitalizacion', e.target.value)}
                    className="w-full"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caidas-consulta-externa" className="text-sm font-medium">
                    TOTAL CAIDAS EN CONSULTA EXTERNA
                  </Label>
                  <Input
                    id="caidas-consulta-externa"
                    type="text"
                    value={formData.caidasConsultaExterna}
                    onChange={(e) => handleInputChange('caidasConsultaExterna', e.target.value)}
                    className="w-full"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caidas-evento-adverso" className="text-sm font-medium">
                    TOTAL DE CAIDAS QUE CALIFICARON COMO EVENTO ADVERSO
                  </Label>
                  <Input
                    id="caidas-evento-adverso"
                    type="text"
                    value={formData.caidasEventoAdverso}
                    onChange={(e) => handleInputChange('caidasEventoAdverso', e.target.value)}
                    className="w-full"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventos-medicamentos-hospitalizacion" className="text-sm font-medium">
                    TOTAL DE EVENTOS ADVERSOS EN LA ADMON MEDICAMENTOS EN EL SERVICIO DE HOSPITALIZACION
                  </Label>
                  <Input
                    id="eventos-medicamentos-hospitalizacion"
                    type="text"
                    value={formData.eventosMedicamentosHospitalizacion}
                    onChange={(e) => handleInputChange('eventosMedicamentosHospitalizacion', e.target.value)}
                    className="w-full"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventos-ulceras-medicamentos" className="text-sm font-medium">
                    TOTAL DE EVENTOS ADVERSOS RELACIONADOS CON ULCERAS POR LA ADMON DE MEDICAMENTOS EN EL SERVICIO DE HOSPITALIZACION
                  </Label>
                  <Input
                    id="eventos-ulceras-medicamentos"
                    type="text"
                    value={formData.eventosUlcerasMedicamentosHospitalizacion}
                    onChange={(e) => handleInputChange('eventosUlcerasMedicamentosHospitalizacion', e.target.value)}
                    className="w-full"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Columna Derecha */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="caidas-urgencias" className="text-sm font-medium">
                    TOTAL DE CAIDAS EN URGENCIAS
                  </Label>
                  <Input
                    id="caidas-urgencias"
                    type="text"
                    value={formData.caidasUrgencias}
                    onChange={(e) => handleInputChange('caidasUrgencias', e.target.value)}
                    className="w-full"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caidas-apoyo-diagnostico" className="text-sm font-medium">
                    TOTAL DE CAIDAS EN APOYO DIAGNOSTICO
                  </Label>
                  <Input
                    id="caidas-apoyo-diagnostico"
                    type="text"
                    value={formData.caidasApoyoDiagnostico}
                    onChange={(e) => handleInputChange('caidasApoyoDiagnostico', e.target.value)}
                    className="w-full"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caidas-incidentes" className="text-sm font-medium">
                    TOTAL DE CAIDAS QUE SE CLASIFICARON COMO INCIDENTES
                  </Label>
                  <Input
                    id="caidas-incidentes"
                    type="text"
                    value={formData.caidasIncidentes}
                    onChange={(e) => handleInputChange('caidasIncidentes', e.target.value)}
                    className="w-full"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventos-medicamentos-urgencias" className="text-sm font-medium">
                    TOTAL DE EVENTOS ADVERSOS EN LA ADMON DE MEDICAMENTOS EN EL SERVICIO DE URGENCIAS
                  </Label>
                  <Input
                    id="eventos-medicamentos-urgencias"
                    type="text"
                    value={formData.eventosMedicamentosUrgencias}
                    onChange={(e) => handleInputChange('eventosMedicamentosUrgencias', e.target.value)}
                    className="w-full"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Búsqueda y Paginación */}
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
                        checked={selectedRows.size === paginatedEventos.length && paginatedEventos.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(new Set(paginatedEventos.map((_, i) => startIndex + i)));
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
                      Datos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEventos.length > 0 ? (
                    paginatedEventos.map((evento, index) => (
                      <tr 
                        key={index} 
                        className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => toggleRowSelection(startIndex + index)}
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(startIndex + index)}
                            onChange={() => toggleRowSelection(startIndex + index)}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="p-3 text-sm text-gray-700">{evento.fecha}</td>
                        <td className="p-3 text-sm text-gray-700">
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(evento.datos).map(([key, value]) => (
                              <span key={key} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-500">
                        No hay eventos adversos registrados
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
                  <p className="text-sm text-gray-600">
                    Los filtros de búsqueda estarán disponibles próximamente.
                  </p>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Botones de Acción */}
        <div className="flex gap-4 justify-end">
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
      </form>
    </ModulePageLayout>
  );
}

