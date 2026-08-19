'use client';

import React, { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, FileText, Search, Building2, Phone, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function ProveedoresPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para los campos del formulario
  const [nit, setNit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [nombreComercial, setNombreComercial] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [contacto, setContacto] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleNuevo = () => {
    setNit('');
    setRazonSocial('');
    setNombreComercial('');
    setDireccion('');
    setTelefono('');
    setEmail('');
    setContacto('');
    setCiudad('');
    setSearchTerm('');
    
    toast({
      title: 'Formulario limpiado',
      description: 'Todos los campos han sido limpiados.',
    });
  };

  const handleGuardar = async () => {
    if (!nit || !razonSocial) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor, complete el NIT y la razón social.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Proveedor guardado',
        description: 'El proveedor se ha guardado correctamente.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el proveedor. Por favor, intente nuevamente.',
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
      title="Gestión de Proveedores"
      description="Registre y gestione los proveedores de medicamentos"
      actions={actions}
      maxWidth="7xl"
    >
      <Card className="mb-6 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Datos del Proveedor
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
                placeholder="Buscar proveedor por NIT, razón social o nombre comercial..."
              />
            </div>
          </div>

          {/* Campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="nit" className="text-sm font-medium">
                NIT <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nit"
                type="text"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                className="w-full"
                placeholder="Número de identificación tributaria"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="razon-social" className="text-sm font-medium">
                Razón Social <span className="text-red-500">*</span>
              </Label>
              <Input
                id="razon-social"
                type="text"
                value={razonSocial}
                onChange={(e) => setRazonSocial(e.target.value)}
                className="w-full"
                placeholder="Razón social"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre-comercial" className="text-sm font-medium">
                Nombre Comercial
              </Label>
              <Input
                id="nombre-comercial"
                type="text"
                value={nombreComercial}
                onChange={(e) => setNombreComercial(e.target.value)}
                className="w-full"
                placeholder="Nombre comercial"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ciudad" className="text-sm font-medium">
                Ciudad
              </Label>
              <Input
                id="ciudad"
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                className="w-full"
                placeholder="Ciudad"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="direccion" className="text-sm font-medium">
                Dirección
              </Label>
              <Input
                id="direccion"
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full"
                placeholder="Dirección completa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-sm font-medium">
                Teléfono
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="pl-10"
                  placeholder="Número de teléfono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contacto" className="text-sm font-medium">
                Persona de Contacto
              </Label>
              <Input
                id="contacto"
                type="text"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
                className="w-full"
                placeholder="Nombre del contacto"
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

