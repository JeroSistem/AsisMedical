'use client';

import React, { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Search,
  Plus,
  Send,
  ChevronDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function MensajeDifusionPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para los campos del formulario
  const [entidad, setEntidad] = useState('');
  const [edadInicial, setEdadInicial] = useState('');
  const [edadFinal, setEdadFinal] = useState('');
  const [sexo, setSexo] = useState('');
  const [entidadTexto, setEntidadTexto] = useState('');
  const [tiposAfiliacion, setTiposAfiliacion] = useState('');
  const [zonaResidencia, setZonaResidencia] = useState('');
  const [tiposPaciente, setTiposPaciente] = useState('');
  const [componente, setComponente] = useState('');
  const [mesesSinAsistir, setMesesSinAsistir] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mensajesPorDia, setMensajesPorDia] = useState('');
  const [consultasCUPS, setConsultasCUPS] = useState('');
  const [direccionContiene, setDireccionContiene] = useState('');
  const [mensaje, setMensaje] = useState('');
  
  // Contador de pacientes (simulado)
  const [pacientesCount, setPacientesCount] = useState(0);

  const handleSearch = () => {
    // Simular búsqueda de pacientes según filtros
    const count = Math.floor(Math.random() * 1000);
    setPacientesCount(count);
    
    toast({
      title: 'Búsqueda realizada',
      description: `Se encontraron ${count} pacientes que coinciden con los filtros.`,
    });
  };

  const handleNuevo = () => {
    // Limpiar todos los campos
    setEntidad('');
    setEdadInicial('');
    setEdadFinal('');
    setSexo('');
    setEntidadTexto('');
    setTiposAfiliacion('');
    setZonaResidencia('');
    setTiposPaciente('');
    setComponente('');
    setMesesSinAsistir('');
    setSearchTerm('');
    setMensajesPorDia('');
    setConsultasCUPS('');
    setDireccionContiene('');
    setMensaje('');
    setPacientesCount(0);
    
    toast({
      title: 'Formulario limpiado',
      description: 'Todos los campos han sido limpiados.',
    });
  };

  const handleGenerar = async () => {
    if (!mensaje.trim()) {
      toast({
        title: 'Mensaje requerido',
        description: 'Por favor, ingrese el mensaje a enviar.',
        variant: 'destructive',
      });
      return;
    }

    if (pacientesCount === 0) {
      toast({
        title: 'Sin pacientes',
        description: 'No hay pacientes que coincidan con los filtros. Por favor, ajuste los criterios de búsqueda.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Aquí iría la lógica para generar y enviar los mensajes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Mensajes generados',
        description: `Se generaron ${pacientesCount} mensajes para envío por WhatsApp.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron generar los mensajes. Por favor, intente nuevamente.',
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
      title="GENERAR MENSAJE DIFUSIÓN (DEMANDA INDUCIDA)"
      description="Genere mensajes de difusión para pacientes según criterios específicos"
      actions={actions}
      maxWidth="7xl"
    >
      <Card className="mb-6 bg-purple-50/50">
        <CardHeader>
          <CardTitle>Criterios de Filtrado</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Fila 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="entidad" className="text-sm font-medium">
                ENTIDAD <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <select
                  id="entidad"
                  value={entidad}
                  onChange={(e) => setEntidad(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none pr-8"
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="entidad1">Entidad 1</option>
                  <option value="entidad2">Entidad 2</option>
                  <option value="entidad3">Entidad 3</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edad-inicial" className="text-sm font-medium">
                Edad inicial
              </Label>
              <Input
                id="edad-inicial"
                type="number"
                value={edadInicial}
                onChange={(e) => setEdadInicial(e.target.value)}
                className="w-full"
                placeholder="0"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edad-final" className="text-sm font-medium">
                Edad final
              </Label>
              <Input
                id="edad-final"
                type="number"
                value={edadFinal}
                onChange={(e) => setEdadFinal(e.target.value)}
                className="w-full"
                placeholder="0"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sexo" className="text-sm font-medium">
                Sexo
              </Label>
              <div className="relative">
                <select
                  id="sexo"
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none pr-8"
                >
                  <option value="">Seleccione...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Fila 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="entidad-texto" className="text-sm font-medium">
                Entidad
              </Label>
              <Input
                id="entidad-texto"
                type="text"
                value={entidadTexto}
                onChange={(e) => setEntidadTexto(e.target.value)}
                className="w-full"
                placeholder="Ingrese entidad"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipos-afiliacion" className="text-sm font-medium">
                Tipos de afiliación
              </Label>
              <div className="relative">
                <select
                  id="tipos-afiliacion"
                  value={tiposAfiliacion}
                  onChange={(e) => setTiposAfiliacion(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none pr-8"
                >
                  <option value="">Seleccione...</option>
                  <option value="contributivo">Contributivo</option>
                  <option value="subsidado">Subsidado</option>
                  <option value="vinculado">Vinculado</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zona-residencia" className="text-sm font-medium">
                Zona de residencia
              </Label>
              <Input
                id="zona-residencia"
                type="text"
                value={zonaResidencia}
                onChange={(e) => setZonaResidencia(e.target.value)}
                className="w-full"
                placeholder="Ingrese zona"
              />
            </div>
          </div>

          {/* Fila 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="tipos-paciente" className="text-sm font-medium">
                Tipos de paciente
              </Label>
              <div className="relative">
                <select
                  id="tipos-paciente"
                  value={tiposPaciente}
                  onChange={(e) => setTiposPaciente(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none pr-8"
                >
                  <option value="">Seleccione...</option>
                  <option value="nuevo">Nuevo</option>
                  <option value="recurrente">Recurrente</option>
                  <option value="crónico">Crónico</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="componente" className="text-sm font-medium">
                Componente
              </Label>
              <Input
                id="componente"
                type="text"
                value={componente}
                onChange={(e) => setComponente(e.target.value)}
                className="w-full"
                placeholder="Ingrese componente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meses-sin-asistir" className="text-sm font-medium">
                mas de x meses sin asistir
              </Label>
              <Input
                id="meses-sin-asistir"
                type="number"
                value={mesesSinAsistir}
                onChange={(e) => setMesesSinAsistir(e.target.value)}
                className="w-full"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Fila 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-medium">
                Search
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="mensajes-por-dia" className="text-sm font-medium">
                Mensajes por dia
              </Label>
              <Input
                id="mensajes-por-dia"
                type="number"
                value={mensajesPorDia}
                onChange={(e) => setMensajesPorDia(e.target.value)}
                className="w-full"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Fila 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="consultas-cups" className="text-sm font-medium">
                Listado de consultas CUPS
              </Label>
              <div className="relative">
                <select
                  id="consultas-cups"
                  value={consultasCUPS}
                  onChange={(e) => setConsultasCUPS(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none pr-8"
                >
                  <option value="">Seleccione...</option>
                  <option value="consulta1">Consulta General</option>
                  <option value="consulta2">Consulta Especializada</option>
                  <option value="consulta3">Consulta Odontológica</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion-contiene" className="text-sm font-medium">
                Dirección contiene
              </Label>
              <Input
                id="direccion-contiene"
                type="text"
                value={direccionContiene}
                onChange={(e) => setDireccionContiene(e.target.value)}
                className="w-full"
                placeholder="Ingrese dirección"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Área de Mensaje */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Mensaje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mensaje" className="text-sm font-medium">
                Contenido del mensaje
              </Label>
              <textarea
                id="mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                placeholder="Escriba aquí el mensaje que se enviará a los pacientes..."
              />
            </div>
            <p className="text-xs text-gray-600">
              Mensaje, será enviado por WhatsApp, no tiene límite de caracteres y puede incluir caracteres de estilos de texto como *~, etc.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contador de Pacientes y Botones */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-sm font-medium text-gray-700">
              El mensaje llegara a <span className="text-blue-600 font-bold">{pacientesCount}</span> pacientes
            </div>
            <div className="flex gap-4">
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
                disabled={isLoading || pacientesCount === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? 'Generando...' : 'Generar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </ModulePageLayout>
  );
}

