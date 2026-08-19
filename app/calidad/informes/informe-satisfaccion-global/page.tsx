'use client';

import React, { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, FileText, Calendar, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function InformeSatisfaccionGlobalPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para los campos del formulario
  const [fechaInicial, setFechaInicial] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [centroServicios, setCentroServicios] = useState('');
  const [generarGraficas, setGenerarGraficas] = useState(false);

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

  const handleFechaInicialChange = (value: string) => {
    const formatted = formatDate(value);
    setFechaInicial(formatted);
  };

  const handleFechaFinalChange = (value: string) => {
    const formatted = formatDate(value);
    setFechaFinal(formatted);
  };

  const handleNuevo = () => {
    // Limpiar todos los campos
    setFechaInicial('');
    setFechaFinal('');
    setCentroServicios('');
    setGenerarGraficas(false);
    
    toast({
      title: 'Formulario limpiado',
      description: 'Todos los campos han sido limpiados.',
    });
  };

  const handleGenerar = async () => {
    // Validar campos requeridos
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
      // Aquí iría la lógica para generar el informe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Informe generado',
        description: `El informe de satisfacción global se ha generado correctamente${generarGraficas ? ' con gráficas' : ''}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo generar el informe. Por favor, intente nuevamente.',
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
      title="GENERAR INFORME SATISFACCION GLOBAL"
      description="Genere el informe de satisfacción global según los criterios seleccionados"
      actions={actions}
      maxWidth="7xl"
    >
      <Card className="mb-6 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            GENERAR INFORME SATISFACCION GLOBAL
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Sección FECHAS */}
          <div className="mb-6">
            <Label className="text-sm font-semibold mb-4 block">
              FECHAS <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha-inicial" className="text-sm font-medium">
                  Fecha inicial
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
                  Fecha Final
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
            </div>
          </div>

          {/* Sección Centro de Servicios y Generar Gráficas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Centro de Servicios */}
            <div className="space-y-2">
              <Label htmlFor="centro-servicios" className="text-sm font-medium">
                Centro de servicios
              </Label>
              <div className="relative">
                <select
                  id="centro-servicios"
                  value={centroServicios}
                  onChange={(e) => setCentroServicios(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none pr-8"
                >
                  <option value="">Seleccione...</option>
                  <option value="centro1">Centro Médico Principal</option>
                  <option value="centro2">Centro Médico Norte</option>
                  <option value="centro3">Centro Médico Sur</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Generar Gráficas */}
            <div className="space-y-2">
              <Label className="text-sm font-medium block mb-2">
                Opciones
              </Label>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="generar-graficas"
                  checked={generarGraficas}
                  onCheckedChange={(checked) => setGenerarGraficas(checked === true)}
                />
                <Label
                  htmlFor="generar-graficas"
                  className="text-sm font-medium cursor-pointer"
                >
                  Generar graficas
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          {isLoading ? 'Generando...' : 'Generar'}
        </Button>
      </div>
    </ModulePageLayout>
  );
}
