'use client';

import React, { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, FileText, Calendar, Search, User, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function DispensacionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para los campos del formulario
  const [numeroReceta, setNumeroReceta] = useState('');
  const [fechaDispensacion, setFechaDispensacion] = useState('');
  const [paciente, setPaciente] = useState('');
  const [documentoPaciente, setDocumentoPaciente] = useState('');
  const [medicamento, setMedicamento] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [lote, setLote] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [farmaceutico, setFarmaceutico] = useState('');
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

  const handleFechaDispensacionChange = (value: string) => {
    const formatted = formatDate(value);
    setFechaDispensacion(formatted);
  };

  const handleFechaVencimientoChange = (value: string) => {
    const formatted = formatDate(value);
    setFechaVencimiento(formatted);
  };

  const handleNuevo = () => {
    setNumeroReceta('');
    setFechaDispensacion('');
    setPaciente('');
    setDocumentoPaciente('');
    setMedicamento('');
    setCantidad('');
    setLote('');
    setFechaVencimiento('');
    setFarmaceutico('');
    setSearchTerm('');
    
    toast({
      title: 'Formulario limpiado',
      description: 'Todos los campos han sido limpiados.',
    });
  };

  const handleDispensar = async () => {
    if (!numeroReceta || !fechaDispensacion || !paciente || !medicamento || !cantidad) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor, complete todos los campos requeridos.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Dispensación registrada',
        description: 'La dispensación se ha registrado correctamente.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo registrar la dispensación. Por favor, intente nuevamente.',
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
      title="Dispensación de Medicamentos"
      description="Registre la dispensación de medicamentos según receta médica"
      actions={actions}
      maxWidth="7xl"
    >
      <Card className="mb-6 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Datos de Dispensación
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
                placeholder="Buscar por número de receta, paciente o documento..."
              />
            </div>
          </div>

          {/* Información de la receta y paciente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="numero-receta" className="text-sm font-medium">
                Número de Receta <span className="text-red-500">*</span>
              </Label>
              <Input
                id="numero-receta"
                type="text"
                value={numeroReceta}
                onChange={(e) => setNumeroReceta(e.target.value)}
                className="w-full"
                placeholder="Número de receta"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha-dispensacion" className="text-sm font-medium">
                Fecha de Dispensación <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fecha-dispensacion"
                  type="text"
                  value={fechaDispensacion}
                  onChange={(e) => handleFechaDispensacionChange(e.target.value)}
                  className="pl-10"
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paciente" className="text-sm font-medium">
                Paciente <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="paciente"
                  type="text"
                  value={paciente}
                  onChange={(e) => setPaciente(e.target.value)}
                  className="pl-10"
                  placeholder="Nombre del paciente"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documento-paciente" className="text-sm font-medium">
                Documento del Paciente
              </Label>
              <Input
                id="documento-paciente"
                type="text"
                value={documentoPaciente}
                onChange={(e) => setDocumentoPaciente(e.target.value)}
                className="w-full"
                placeholder="Número de documento"
              />
            </div>
          </div>

          {/* Información del medicamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="medicamento" className="text-sm font-medium">
                Medicamento <span className="text-red-500">*</span>
              </Label>
              <Input
                id="medicamento"
                type="text"
                value={medicamento}
                onChange={(e) => setMedicamento(e.target.value)}
                className="w-full"
                placeholder="Nombre del medicamento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cantidad" className="text-sm font-medium">
                Cantidad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full"
                placeholder="Cantidad a dispensar"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lote" className="text-sm font-medium">
                Lote
              </Label>
              <Input
                id="lote"
                type="text"
                value={lote}
                onChange={(e) => setLote(e.target.value)}
                className="w-full"
                placeholder="Número de lote"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha-vencimiento" className="text-sm font-medium">
                Fecha de Vencimiento
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fecha-vencimiento"
                  type="text"
                  value={fechaVencimiento}
                  onChange={(e) => handleFechaVencimientoChange(e.target.value)}
                  className="pl-10"
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="farmaceutico" className="text-sm font-medium">
                Farmacéutico Responsable
              </Label>
              <Input
                id="farmaceutico"
                type="text"
                value={farmaceutico}
                onChange={(e) => setFarmaceutico(e.target.value)}
                className="w-full"
                placeholder="Nombre del farmacéutico"
              />
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
          onClick={handleDispensar}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Package className="h-4 w-4 mr-2" />
          {isLoading ? 'Registrando...' : 'Dispensar'}
        </Button>
      </div>
    </ModulePageLayout>
  );
}

