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
  Building2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface Pregunta {
  id: number;
  texto: string;
  calificaciones: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    na: number;
    total: number;
  };
}

const preguntas: Pregunta[] = [
  {
    id: 1,
    texto: 'TRATO BRINDADO DURANTE LA ASIGNACION DE LA CITA...',
    calificaciones: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, na: 0, total: 0 }
  },
  {
    id: 2,
    texto: 'EL TIEMPO QUE TUVO QUE ESPERAR PARA SER ATENDIDO...',
    calificaciones: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, na: 0, total: 0 }
  },
  {
    id: 3,
    texto: 'CONDICIONES DE PRIVACIDAD, DISCRECION CONFIDENCIALIDAD...',
    calificaciones: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, na: 0, total: 0 }
  },
  {
    id: 4,
    texto: 'PRESENTACION PERSONAL DE LAS PERSONAS QUE LO ATENDIERON...',
    calificaciones: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, na: 0, total: 0 }
  },
  {
    id: 5,
    texto: 'COMODIDAD Y TEMPERATURA DE LAS INSTALACIONES...',
    calificaciones: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, na: 0, total: 0 }
  },
  {
    id: 6,
    texto: 'LIMPIEZA Y ASEO (SALA DE ESPERA, CONSULTORIOS, (...),ETC)',
    calificaciones: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, na: 0, total: 0 }
  },
  {
    id: 7,
    texto: 'LE INFORMARON OPORTUNAMENTE SOBRE DOCUMENTOS...',
    calificaciones: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, na: 0, total: 0 }
  },
  {
    id: 8,
    texto: 'EL PROFESIONAL EN SALUD LE HABLO CLARAMENTE...',
    calificaciones: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, na: 0, total: 0 }
  },
  {
    id: 9,
    texto: 'SI LE ORDENARON EXAMENES O PROCEDIMIENTOS LE FUERON...',
    calificaciones: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, na: 0, total: 0 }
  },
  {
    id: 10,
    texto: 'SI LE FORMULARON MEDICAMENTOS, LE EXPLICARON PARA QUE ERAN...',
    calificaciones: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, na: 0, total: 0 }
  },
  {
    id: 11,
    texto: 'COMO CALIFICA SU EXPERIENCIA GLOBAL AL RESPECTO A LOS SERVICIOS...',
    calificaciones: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, na: 0, total: 0 }
  },
];

export default function EncuestaSatisfaccionPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [fechaEncuesta, setFechaEncuesta] = useState('');
  const [centroServicios, setCentroServicios] = useState('');
  const [preguntasData, setPreguntasData] = useState<Pregunta[]>(preguntas);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalificacionChange = (
    preguntaId: number,
    tipo: '1' | '2' | '3' | '4' | '5' | 'na',
    value: string
  ) => {
    const numValue = value === '' ? 0 : parseInt(value) || 0;
    
    setPreguntasData(prev => prev.map(pregunta => {
      if (pregunta.id === preguntaId) {
        const newCalificaciones = {
          ...pregunta.calificaciones,
          [tipo]: numValue
        };
        const total = newCalificaciones[1] + 
                     newCalificaciones[2] + 
                     newCalificaciones[3] + 
                     newCalificaciones[4] + 
                     newCalificaciones[5] + 
                     newCalificaciones.na;
        return {
          ...pregunta,
          calificaciones: {
            ...newCalificaciones,
            total
          }
        };
      }
      return pregunta;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aquí iría la lógica para guardar la encuesta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Encuesta guardada',
        description: 'La encuesta de satisfacción se ha guardado correctamente.',
      });
      
      // Opcional: redirigir a la lista de encuestas
      // router.push('/calidad/encuesta-satisfaccion/listado');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la encuesta. Por favor, intente nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const actions = (
    <>
      <Button variant="outline" size="sm" onClick={() => router.push('/calidad/encuesta-satisfaccion/listado')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Listado
      </Button>
      <Button 
        type="submit" 
        form="encuesta-form"
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
      title="EDITAR ENCUESTA DE SATISFACCION"
      description="Complete la encuesta de satisfacción del paciente"
      actions={actions}
      maxWidth="7xl"
    >
      <form id="encuesta-form" onSubmit={handleSubmit}>
        {/* Información General */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fecha Encuesta */}
              <div className="space-y-2">
                <Label htmlFor="fecha-encuesta" className="text-sm font-medium">
                  Fecha Encuesta satisfaccion
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="fecha-encuesta"
                    type="date"
                    value={fechaEncuesta}
                    onChange={(e) => setFechaEncuesta(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Centro de Servicios */}
              <div className="space-y-2">
                <Label htmlFor="centro-servicios" className="text-sm font-medium">
                  Centro de servicios
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="centro-servicios"
                    type="text"
                    value={centroServicios}
                    onChange={(e) => setCentroServicios(e.target.value)}
                    className="pl-10"
                    placeholder="Ingrese el centro de servicios"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Preguntas y Calificaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Preguntas de Satisfacción</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 text-sm font-semibold text-gray-700 w-1/2">
                      Pregunta
                    </th>
                    <th className="text-center p-2 text-xs font-semibold text-gray-700 border-l">
                      1
                    </th>
                    <th className="text-center p-2 text-xs font-semibold text-gray-700">
                      2
                    </th>
                    <th className="text-center p-2 text-xs font-semibold text-gray-700">
                      3
                    </th>
                    <th className="text-center p-2 text-xs font-semibold text-gray-700">
                      4
                    </th>
                    <th className="text-center p-2 text-xs font-semibold text-gray-700">
                      5
                    </th>
                    <th className="text-center p-2 text-xs font-semibold text-gray-700 border-l">
                      NA
                    </th>
                    <th className="text-center p-2 text-xs font-semibold text-gray-700 border-l">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {preguntasData.map((pregunta, index) => (
                    <tr 
                      key={pregunta.id} 
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 text-sm text-gray-700 align-top">
                        {pregunta.texto}
                      </td>
                      {(['1', '2', '3', '4', '5', 'na'] as const).map((tipo) => (
                        <td key={tipo} className="p-2 border-l align-top">
                          <Input
                            type="number"
                            min="0"
                            value={pregunta.calificaciones[tipo] || ''}
                            onChange={(e) => handleCalificacionChange(
                              pregunta.id,
                              tipo,
                              e.target.value
                            )}
                            className="w-16 h-8 text-center text-sm"
                            placeholder="0"
                          />
                        </td>
                      ))}
                      <td className="p-2 border-l align-top">
                        <Input
                          type="number"
                          value={pregunta.calificaciones.total}
                          readOnly
                          className="w-16 h-8 text-center text-sm bg-gray-100 font-semibold"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </form>
    </ModulePageLayout>
  );
}

