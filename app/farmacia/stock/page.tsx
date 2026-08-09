'use client';

import React, { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, FileText, Calendar, Search, AlertTriangle, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function StockPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para los campos del formulario
  const [fechaInicial, setFechaInicial] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [medicamento, setMedicamento] = useState('');
  const [bodega, setBodega] = useState('');
  const [tipoMovimiento, setTipoMovimiento] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const handleFechaInicialChange = (value: string) => {
    const formatted = formatDate(value);
    setFechaInicial(formatted);
  };

  const handleFechaFinalChange = (value: string) => {
    const formatted = formatDate(value);
    setFechaFinal(formatted);
  };

  const handleNuevo = () => {
    setFechaInicial('');
    setFechaFinal('');
    setMedicamento('');
    setBodega('');
    setTipoMovimiento('');
    setSearchTerm('');
    
    toast({
      title: 'Formulario limpiado',
      description: 'Todos los campos han sido limpiados.',
    });
  };

  const handleGenerar = async () => {
    if (!fechaInicial || !fechaFinal) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor, complete las fechas inicial y final.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Reporte generado',
        description: 'El reporte de control de stock se ha generado correctamente.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo generar el reporte. Por favor, intente nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
      title="Control de Stock"
      description="Genere reportes y controle el stock de medicamentos"
      actions={actions}
      maxWidth="7xl"
    >
      <Card className="mb-6 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Búsqueda */}
          <div className="mb-6">
            <Label htmlFor="search" className="text-sm font-medium mb-2 block">
              Búsqueda
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                placeholder="Buscar medicamento..."
              />
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="fecha-inicial" className="text-sm font-medium">
                Fecha inicial <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fecha-inicial"
                  type="text"
                  value={fechaInicial}
                  onChange={(e) => handleFechaInicialChange(e.target.value)}
                  className="pl-10"
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha-final" className="text-sm font-medium">
                Fecha Final <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fecha-final"
                  type="text"
                  value={fechaFinal}
                  onChange={(e) => handleFechaFinalChange(e.target.value)}
                  className="pl-10"
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicamento" className="text-sm font-medium">
                Medicamento
              </Label>
              <Input
                id="medicamento"
                type="text"
                value={medicamento}
                onChange={(e) => setMedicamento(e.target.value)}
                className="w-full"
                placeholder="Nombre del medicamento"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bodega" className="text-sm font-medium">
                Bodega
              </Label>
              <Input
                id="bodega"
                type="text"
                value={bodega}
                onChange={(e) => setBodega(e.target.value)}
                className="w-full"
                placeholder="Nombre de la bodega"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tipo-movimiento" className="text-sm font-medium">
                Tipo de Movimiento
              </Label>
              <select
                id="tipo-movimiento"
                value={tipoMovimiento}
                onChange={(e) => setTipoMovimiento(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Todos</option>
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
                <option value="ajuste">Ajuste</option>
                <option value="vencimiento">Vencimiento</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Total</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Movimientos</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={handleNuevo}
          variant="outline"
          className="bg-white hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo
        </Button>
        <Button 
          onClick={handleGenerar}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <FileText className="h-4 w-4 mr-2" />
          {isLoading ? 'Generando...' : 'Generar Reporte'}
        </Button>
      </div>
    </ModulePageLayout>
  );
}

