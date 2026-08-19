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

export default function Informe0256Page() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para los campos del formulario
  const [fechaInicial, setFechaInicial] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [entidades, setEntidades] = useState('');
  const [incluirContratosParticulares, setIncluirContratosParticulares] = useState(false);

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
    setEntidades('');
    setIncluirContratosParticulares(false);
    
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
        description: 'El listado Resolución 0256 se ha generado correctamente.',
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
      title="GENERAR LISTADO RESOLUCION 0256"
      description="Genere el listado según Resolución 0256"
      actions={actions}
      maxWidth="7xl"
    >
      <Card className="mb-6 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            GENERAR LISTADO RESOLUCION 0256
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Campos de Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

          {/* Campo Entidades */}
          <div className="mb-6">
            <div className="space-y-2">
              <Label htmlFor="entidades" className="text-sm font-medium">
                entidades
              </Label>
              <div className="relative">
                <select
                  id="entidades"
                  value={entidades}
                  onChange={(e) => setEntidades(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none pr-8"
                >
                  <option value="">Seleccione...</option>
                  <option value="entidad1">Entidad 1</option>
                  <option value="entidad2">Entidad 2</option>
                  <option value="entidad3">Entidad 3</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Checkbox */}
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="contratos-particulares"
                checked={incluirContratosParticulares}
                onCheckedChange={(checked) => setIncluirContratosParticulares(checked === true)}
              />
              <Label
                htmlFor="contratos-particulares"
                className="text-sm font-medium cursor-pointer"
              >
                incluir contratos particulares
              </Label>
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
