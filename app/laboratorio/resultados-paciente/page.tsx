'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Save, 
  Search, 
  HelpCircle, 
  ExternalLink,
  Star,
  ChevronDown,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { AppLayout } from '@/components/shared/app-layout';

export default function ResultadosPacientePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [admissionSearch, setAdmissionSearch] = useState('');

  const handleGuardar = async () => {
    setIsLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Guardado exitoso',
        description: 'Los resultados se han guardado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar los resultados',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLimpiar = () => {
    setAdmissionSearch('');
    toast({
      title: 'Formulario limpiado',
      description: 'Los campos han sido limpiados',
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-white">
        {/* Header azul con título y botones */}
        <div className="bg-blue-600 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-start justify-between">
              {/* Lado izquierdo: Título con iconos y botones */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {/* Icono naranja (dos V) */}
                  <div className="bg-orange-500 text-white rounded p-2">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h1 className="text-xl font-semibold text-white">Resultado examenes laboratorio</h1>
                  <Star className="h-5 w-5 text-gray-300 cursor-pointer hover:text-yellow-300" />
                </div>
                {/* Botones Guardar y Limpiar */}
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleGuardar} 
                    disabled={isLoading}
                    className="bg-white text-blue-600 hover:bg-gray-100"
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button 
                    onClick={handleLimpiar}
                    variant="outline"
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300"
                    size="sm"
                  >
                    Limpiar
                  </Button>
                </div>
              </div>
              
              {/* Lado derecho: Listado y Ayuda */}
              <div className="flex items-center gap-4 pt-1">
                <Link 
                  href="/laboratorio/resultados-paciente/listado"
                  className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
                >
                  <Search className="h-4 w-4" />
                  <span>Listado</span>
                </Link>
                <button className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors">
                  <HelpCircle className="h-4 w-4" />
                  <span>Ayuda</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Sección Información Admisión */}
          <div className="mb-6">
            <Label className="text-lg font-semibold text-orange-600 mb-3 block">
              Información Admisión
            </Label>
            <div className="relative">
              <Input
                placeholder="Escriba mínimo tres caracteres"
                value={admissionSearch}
                onChange={(e) => setAdmissionSearch(e.target.value)}
                className="pr-20"
                minLength={3}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    // Acción para dropdown
                    toast({
                      title: 'Búsqueda',
                      description: 'Mostrando opciones de búsqueda',
                    });
                  }}
                >
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  asChild
                >
                  <Link href="/laboratorio/admisiones/nuevo">
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                  </Link>
                </Button>
              </div>
            </div>
            {admissionSearch.length > 0 && admissionSearch.length < 3 && (
              <p className="text-xs text-red-500 mt-1">
                Debe escribir al menos 3 caracteres
              </p>
            )}
          </div>

          {/* Área de contenido (vacía por ahora) */}
          <div className="mt-8">
            {/* Aquí se mostrarían los resultados del examen cuando se seleccione una admisión */}
            {admissionSearch.length >= 3 && (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <p>Seleccione una admisión para ver los resultados del examen</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
