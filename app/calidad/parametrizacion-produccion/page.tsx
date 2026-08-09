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
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface ProcedimientoCUPS {
  codigoSubGrupo: string;
  nombre: string;
}

// Datos de ejemplo de procedimientos CUPS
const mockProcedimientos: ProcedimientoCUPS[] = [
  { codigoSubGrupo: '11', nombre: 'Número Casos de biologicos aplicados' },
  { codigoSubGrupo: '12', nombre: 'Número de Controles de Enfermeria (atencion Prenatal, Crecimiento y desarrollo)' },
  { codigoSubGrupo: '13', nombre: 'Número Citologias Cervicouterinas tomadas' },
  { codigoSubGrupo: '21', nombre: 'Número Consultas de medicina general externas' },
  { codigoSubGrupo: '22', nombre: 'Número Consultas de medicina general urgencias' },
  { codigoSubGrupo: '23', nombre: 'Número Consultas de medicina especializada' },
  { codigoSubGrupo: '24', nombre: 'Otras consultas electivas realizadas por profesionales diferentes a médico, enfermero u odontólogo' },
  { codigoSubGrupo: '31', nombre: 'Número Consultas de odontologia' },
  { codigoSubGrupo: '32', nombre: 'Número Sellantes aplicados' },
  { codigoSubGrupo: '33', nombre: 'Número Superficies obturadas (cualquier material)' },
];

export default function ParametrizacionProduccionPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [codigoGrupo, setCodigoGrupo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar procedimientos según búsqueda
  const filteredProcedimientos = mockProcedimientos.filter(proc =>
    proc.codigoSubGrupo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proc.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredProcedimientos.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedProcedimientos = filteredProcedimientos.slice(startIndex, startIndex + entriesPerPage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aquí iría la lógica para guardar los datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Datos guardados',
        description: 'La parametrización se ha guardado correctamente.',
      });
      
      // Limpiar formulario
      setCodigo('');
      setNombre('');
      setCodigoGrupo('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los datos. Por favor, intente nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    // La búsqueda se realiza automáticamente con el filtro
    setCurrentPage(1); // Resetear a la primera página al buscar
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
      title="PARAMETRIZAR SUBGRUPOS PRODUCCIÓN (2193)"
      description="Configure los subgrupos de producción del sistema"
      actions={actions}
      maxWidth="7xl"
    >
      <form id="parametrizacion-form" onSubmit={handleSubmit}>
        {/* Sección DATOS SUBGRUPO */}
        <Card className="mb-6 bg-purple-50/50">
          <CardHeader>
            <CardTitle>DATOS SUBGRUPO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Código */}
              <div className="space-y-2">
                <Label htmlFor="codigo" className="text-sm font-medium">
                  Codigo
                </Label>
                <Input
                  id="codigo"
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="w-full"
                  placeholder="Ingrese el código"
                />
              </div>

              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-medium">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full"
                  placeholder="Ingrese el nombre"
                />
              </div>

              {/* Código Grupo */}
              <div className="space-y-2">
                <Label htmlFor="codigo-grupo" className="text-sm font-medium">
                  Codigo grupo
                </Label>
                <Input
                  id="codigo-grupo"
                  type="text"
                  value={codigoGrupo}
                  onChange={(e) => setCodigoGrupo(e.target.value)}
                  className="w-full"
                  placeholder="Ingrese el código grupo"
                />
              </div>
            </div>

            {/* Búsqueda */}
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2 block">
                Listado de procedimientos CUPS
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                    className="pl-10"
                    placeholder="Search"
                  />
                </div>
                <Button 
                  type="button"
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Procedimientos CUPS */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            {/* Controles de paginación superior */}
            <div className="flex justify-end mb-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="entries-per-page" className="text-sm font-medium whitespace-nowrap">
                  Entries per page:
                </Label>
                <select
                  id="entries-per-page"
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
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
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">
                      Codigo subGrupo
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">
                      Nombre
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProcedimientos.length > 0 ? (
                    paginatedProcedimientos.map((procedimiento, index) => (
                      <tr 
                        key={procedimiento.codigoSubGrupo}
                        className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                          setCodigo(procedimiento.codigoSubGrupo);
                          setNombre(procedimiento.nombre);
                        }}
                      >
                        <td className="p-3 text-sm text-gray-700 font-medium">
                          {procedimiento.codigoSubGrupo}
                        </td>
                        <td className="p-3 text-sm text-gray-700">
                          {procedimiento.nombre}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="p-8 text-center text-gray-500">
                        No se encontraron procedimientos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación inferior */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm rounded border disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm rounded border disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded border ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm rounded border disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm rounded border disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Last
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botón Guardar al final */}
        <div className="flex justify-center mt-6">
          <Button 
            type="submit" 
            form="parametrizacion-form"
            size="lg"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </ModulePageLayout>
  );
}

