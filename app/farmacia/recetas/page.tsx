'use client';

import React, { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, FileText, Calendar, Search, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function RecetasPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para los campos del formulario
  const [numeroReceta, setNumeroReceta] = useState('');
  const [fechaReceta, setFechaReceta] = useState('');
  const [paciente, setPaciente] = useState('');
  const [documentoPaciente, setDocumentoPaciente] = useState('');
  const [medico, setMedico] = useState('');
  const [medicamentos, setMedicamentos] = useState<Array<{medicamento: string, cantidad: string, indicaciones: string}>>([]);
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

  const handleFechaRecetaChange = (value: string) => {
    const formatted = formatDate(value);
    setFechaReceta(formatted);
  };

  const handleAgregarMedicamento = () => {
    setMedicamentos([...medicamentos, { medicamento: '', cantidad: '', indicaciones: '' }]);
  };

  const handleMedicamentoChange = (index: number, field: string, value: string) => {
    const updated = [...medicamentos];
    updated[index] = { ...updated[index], [field]: value };
    setMedicamentos(updated);
  };

  const handleEliminarMedicamento = (index: number) => {
    setMedicamentos(medicamentos.filter((_, i) => i !== index));
  };

  const handleNuevo = () => {
    setNumeroReceta('');
    setFechaReceta('');
    setPaciente('');
    setDocumentoPaciente('');
    setMedico('');
    setMedicamentos([]);
    setSearchTerm('');
    
    toast({
      title: 'Formulario limpiado',
      description: 'Todos los campos han sido limpiados.',
    });
  };

  const handleGuardar = async () => {
    if (!numeroReceta || !fechaReceta || !paciente || medicamentos.length === 0) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor, complete todos los campos requeridos y agregue al menos un medicamento.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Receta guardada',
        description: 'La receta se ha guardado correctamente.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la receta. Por favor, intente nuevamente.',
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
      <Button 
        onClick={handleGuardar}
        disabled={isLoading}
        size="sm"
      >
        <FileText className="h-4 w-4 mr-2" />
        {isLoading ? 'Guardando...' : 'Guardar'}
      </Button>
    </>
  );

  return (
    <ModulePageLayout
      title="Gestión de Recetas"
      description="Registre y gestione las recetas médicas"
      actions={actions}
      maxWidth="7xl"
    >
      <Card className="mb-6 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Datos de la Receta
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
                placeholder="Buscar receta por número, paciente o documento..."
              />
            </div>
          </div>

          {/* Información básica */}
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
              <Label htmlFor="fecha-receta" className="text-sm font-medium">
                Fecha de Receta <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fecha-receta"
                  type="text"
                  value={fechaReceta}
                  onChange={(e) => handleFechaRecetaChange(e.target.value)}
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

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="medico" className="text-sm font-medium">
                Médico Prescriptor
              </Label>
              <Input
                id="medico"
                type="text"
                value={medico}
                onChange={(e) => setMedico(e.target.value)}
                className="w-full"
                placeholder="Nombre del médico"
              />
            </div>
          </div>

          {/* Medicamentos */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-sm font-semibold">
                Medicamentos <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                onClick={handleAgregarMedicamento}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Medicamento
              </Button>
            </div>

            {medicamentos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No hay medicamentos agregados. Haga clic en "Agregar Medicamento" para comenzar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {medicamentos.map((med, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Medicamento</Label>
                        <Input
                          value={med.medicamento}
                          onChange={(e) => handleMedicamentoChange(index, 'medicamento', e.target.value)}
                          placeholder="Nombre del medicamento"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Cantidad</Label>
                        <Input
                          value={med.cantidad}
                          onChange={(e) => handleMedicamentoChange(index, 'cantidad', e.target.value)}
                          placeholder="Cantidad"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Indicaciones</Label>
                        <div className="flex gap-2">
                          <Input
                            value={med.indicaciones}
                            onChange={(e) => handleMedicamentoChange(index, 'indicaciones', e.target.value)}
                            placeholder="Indicaciones"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={() => handleEliminarMedicamento(index)}
                            variant="destructive"
                            size="sm"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
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
          onClick={handleGuardar}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <FileText className="h-4 w-4 mr-2" />
          {isLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </ModulePageLayout>
  );
}

