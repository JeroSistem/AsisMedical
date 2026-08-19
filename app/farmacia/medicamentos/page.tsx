'use client';

import React, { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, FileText, Calendar, ChevronDown, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function MedicamentosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para los campos del formulario
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [principioActivo, setPrincipioActivo] = useState('');
  const [presentacion, setPresentacion] = useState('');
  const [concentracion, setConcentracion] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [registroSanitario, setRegistroSanitario] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleNuevo = () => {
    setCodigo('');
    setNombre('');
    setPrincipioActivo('');
    setPresentacion('');
    setConcentracion('');
    setUnidadMedida('');
    setFabricante('');
    setRegistroSanitario('');
    setSearchTerm('');
    
    toast({
      title: 'Formulario limpiado',
      description: 'Todos los campos han sido limpiados.',
    });
  };

  const handleGuardar = async () => {
    if (!codigo || !nombre) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor, complete el código y nombre del medicamento.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Medicamento guardado',
        description: 'El medicamento se ha guardado correctamente.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el medicamento. Por favor, intente nuevamente.',
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
      title="Gestión de Medicamentos"
      description="Registre y gestione los medicamentos del sistema"
      actions={actions}
      maxWidth="7xl"
    >
      <Card className="mb-6 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Datos del Medicamento
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
                placeholder="Buscar medicamento por código, nombre o principio activo..."
              />
            </div>
          </div>

          {/* Campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="codigo" className="text-sm font-medium">
                Código <span className="text-red-500">*</span>
              </Label>
              <Input
                id="codigo"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="w-full"
                placeholder="Código del medicamento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-medium">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full"
                placeholder="Nombre comercial"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="principio-activo" className="text-sm font-medium">
                Principio Activo
              </Label>
              <Input
                id="principio-activo"
                type="text"
                value={principioActivo}
                onChange={(e) => setPrincipioActivo(e.target.value)}
                className="w-full"
                placeholder="Principio activo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="presentacion" className="text-sm font-medium">
                Presentación
              </Label>
              <div className="relative">
                <select
                  id="presentacion"
                  value={presentacion}
                  onChange={(e) => setPresentacion(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none pr-8"
                >
                  <option value="">Seleccione...</option>
                  <option value="tabletas">Tabletas</option>
                  <option value="capsulas">Cápsulas</option>
                  <option value="jarabe">Jarabe</option>
                  <option value="inyectable">Inyectable</option>
                  <option value="crema">Crema</option>
                  <option value="unguento">Ungüento</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="concentracion" className="text-sm font-medium">
                Concentración
              </Label>
              <Input
                id="concentracion"
                type="text"
                value={concentracion}
                onChange={(e) => setConcentracion(e.target.value)}
                className="w-full"
                placeholder="Ej: 500mg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unidad-medida" className="text-sm font-medium">
                Unidad de Medida
              </Label>
              <div className="relative">
                <select
                  id="unidad-medida"
                  value={unidadMedida}
                  onChange={(e) => setUnidadMedida(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none pr-8"
                >
                  <option value="">Seleccione...</option>
                  <option value="mg">mg</option>
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="unidad">Unidad</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fabricante" className="text-sm font-medium">
                Fabricante
              </Label>
              <Input
                id="fabricante"
                type="text"
                value={fabricante}
                onChange={(e) => setFabricante(e.target.value)}
                className="w-full"
                placeholder="Laboratorio fabricante"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registro-sanitario" className="text-sm font-medium">
                Registro Sanitario
              </Label>
              <Input
                id="registro-sanitario"
                type="text"
                value={registroSanitario}
                onChange={(e) => setRegistroSanitario(e.target.value)}
                className="w-full"
                placeholder="Número de registro sanitario"
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

