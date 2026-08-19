'use client';

import { useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Bot, 
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';

export default function ServiciosChatbotPage() {
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [servicio, setServicio] = useState({
    // Información básica
    codigo: '',
    nombre: '',
    descripcion: '',
    tipo: '',
    categoria: '',
    
    // Información del chatbot
    plataforma: '',
    token: '',
    webhook: '',
    idioma: 'es',
    
    // Información de configuración
    horarioAtencion: '',
    tiempoRespuesta: '',
    maximoConversaciones: '',
    requiereAutenticacion: false,
    
    // Información de funcionalidades
    funcionalidades: [],
    comandos: [],
    respuestasAutomaticas: [],
    
    // Información adicional
    observaciones: '',
    activo: true
  });

  // Estado para la lista de servicios
  const [servicios, setServicios] = useState([
    {
      id: 1,
      codigo: 'CHB001',
      nombre: 'ChatBot Atención al Cliente',
      tipo: 'Atención',
      categoria: 'Cliente',
      plataforma: 'WhatsApp',
      estado: 'activo'
    },
    {
      id: 2,
      codigo: 'CHB002',
      nombre: 'ChatBot Agendamiento',
      tipo: 'Agendamiento',
      categoria: 'Citas',
      plataforma: 'Telegram',
      estado: 'activo'
    },
    {
      id: 3,
      codigo: 'CHB003',
      nombre: 'ChatBot Información Médica',
      tipo: 'Información',
      categoria: 'Médica',
      plataforma: 'Facebook',
      estado: 'activo'
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setServicio(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Servicio ChatBot guardado",
      description: "El servicio ChatBot se ha guardado exitosamente.",
    });
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'inactivo':
        return <Badge variant="destructive">Inactivo</Badge>;
      case 'mantenimiento':
        return <Badge className="bg-yellow-100 text-yellow-800">Mantenimiento</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const actions = (
    <>
      <Button variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Exportar
      </Button>
      <Button variant="outline" size="sm">
        <Upload className="w-4 h-4 mr-2" />
        Importar
      </Button>
    </>
  );

  return (
    <ModulePageLayout
      title="Gestión de Servicios ChatBot"
      description="Administración de servicios de chatbot y atención automatizada"
      actions={actions}
      maxWidth="7xl"
      showBackButton={true}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className="lg:col-span-2">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2" />
                  Información del Servicio ChatBot
                </CardTitle>
                <CardDescription>
                  Complete la información del servicio ChatBot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="codigo">Código del Servicio</Label>
                        <Input
                          id="codigo"
                          value={servicio.codigo}
                          onChange={(e) => handleInputChange('codigo', e.target.value)}
                          placeholder="CHB001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nombre">Nombre del Servicio</Label>
                        <Input
                          id="nombre"
                          value={servicio.nombre}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          placeholder="Nombre del servicio ChatBot"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo">Tipo de Servicio</Label>
                        <Select value={servicio.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="atencion">Atención al Cliente</SelectItem>
                            <SelectItem value="agendamiento">Agendamiento</SelectItem>
                            <SelectItem value="informacion">Información</SelectItem>
                            <SelectItem value="soporte">Soporte Técnico</SelectItem>
                            <SelectItem value="ventas">Ventas</SelectItem>
                            <SelectItem value="recordatorios">Recordatorios</SelectItem>
                            <SelectItem value="encuestas">Encuestas</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="categoria">Categoría</Label>
                        <Select value={servicio.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cliente">Cliente</SelectItem>
                            <SelectItem value="citas">Citas</SelectItem>
                            <SelectItem value="medica">Médica</SelectItem>
                            <SelectItem value="administrativa">Administrativa</SelectItem>
                            <SelectItem value="tecnica">Técnica</SelectItem>
                            <SelectItem value="comercial">Comercial</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={servicio.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Descripción detallada del servicio ChatBot"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Información del chatbot */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Configuración del ChatBot</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="plataforma">Plataforma</Label>
                        <Select value={servicio.plataforma} onValueChange={(value) => handleInputChange('plataforma', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar plataforma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="telegram">Telegram</SelectItem>
                            <SelectItem value="facebook">Facebook Messenger</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="web">Web</SelectItem>
                            <SelectItem value="app">Aplicación Móvil</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="idioma">Idioma</Label>
                        <Select value={servicio.idioma} onValueChange={(value) => handleInputChange('idioma', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">Inglés</SelectItem>
                            <SelectItem value="fr">Francés</SelectItem>
                            <SelectItem value="pt">Portugués</SelectItem>
                            <SelectItem value="de">Alemán</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="token">Token de Acceso</Label>
                        <Input
                          id="token"
                          value={servicio.token}
                          onChange={(e) => handleInputChange('token', e.target.value)}
                          placeholder="Token de la plataforma"
                          type="password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="webhook">Webhook URL</Label>
                        <Input
                          id="webhook"
                          value={servicio.webhook}
                          onChange={(e) => handleInputChange('webhook', e.target.value)}
                          placeholder="https://ejemplo.com/webhook"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de configuración */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Configuración de Atención</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="horarioAtencion">Horario de Atención</Label>
                        <Input
                          id="horarioAtencion"
                          value={servicio.horarioAtencion}
                          onChange={(e) => handleInputChange('horarioAtencion', e.target.value)}
                          placeholder="Ej: Lunes a Viernes 8:00 AM - 6:00 PM"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tiempoRespuesta">Tiempo de Respuesta (segundos)</Label>
                        <Input
                          id="tiempoRespuesta"
                          type="number"
                          value={servicio.tiempoRespuesta}
                          onChange={(e) => handleInputChange('tiempoRespuesta', e.target.value)}
                          placeholder="30"
                          min="1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maximoConversaciones">Máximo de Conversaciones Simultáneas</Label>
                        <Input
                          id="maximoConversaciones"
                          type="number"
                          value={servicio.maximoConversaciones}
                          onChange={(e) => handleInputChange('maximoConversaciones', e.target.value)}
                          placeholder="100"
                          min="1"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="requiereAutenticacion"
                          checked={servicio.requiereAutenticacion}
                          onCheckedChange={(checked) => handleInputChange('requiereAutenticacion', checked)}
                        />
                        <Label htmlFor="requiereAutenticacion">Requiere Autenticación</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de funcionalidades */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Funcionalidades</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="funcionalidades">Funcionalidades Disponibles</Label>
                        <Select value={servicio.funcionalidades.join(',')} onValueChange={(value) => handleInputChange('funcionalidades', value.split(','))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar funcionalidades" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="agendar-cita">Agendar Cita</SelectItem>
                            <SelectItem value="cancelar-cita">Cancelar Cita</SelectItem>
                            <SelectItem value="consultar-horarios">Consultar Horarios</SelectItem>
                            <SelectItem value="informacion-medica">Información Médica</SelectItem>
                            <SelectItem value="resultados-laboratorio">Resultados de Laboratorio</SelectItem>
                            <SelectItem value="recordatorios">Recordatorios</SelectItem>
                            <SelectItem value="soporte-tecnico">Soporte Técnico</SelectItem>
                            <SelectItem value="encuestas">Encuestas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="comandos">Comandos Disponibles</Label>
                        <Textarea
                          id="comandos"
                          value={servicio.comandos.join('\n')}
                          onChange={(e) => handleInputChange('comandos', e.target.value.split('\n'))}
                          placeholder="Lista de comandos disponibles (uno por línea)"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="respuestasAutomaticas">Respuestas Automáticas</Label>
                      <Textarea
                        id="respuestasAutomaticas"
                        value={servicio.respuestasAutomaticas.join('\n')}
                        onChange={(e) => handleInputChange('respuestasAutomaticas', e.target.value.split('\n'))}
                        placeholder="Respuestas automáticas configuradas (una por línea)"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Información adicional */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Adicional</h3>
                    <div>
                      <Label htmlFor="observaciones">Observaciones</Label>
                      <Textarea
                        id="observaciones"
                        value={servicio.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        placeholder="Observaciones adicionales sobre el servicio ChatBot"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Estado */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="activo"
                        checked={servicio.activo}
                        onCheckedChange={(checked) => handleInputChange('activo', checked)}
                      />
                      <Label htmlFor="activo">Servicio Activo</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                      <Button type="submit">
                        <Plus className="w-4 h-4 mr-2" />
                        Guardar Servicio
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ModuleCard>
        </div>

        {/* Lista de servicios */}
        <div className="lg:col-span-1">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2" />
                  Servicios ChatBot
                </CardTitle>
                <CardDescription>
                  Lista de servicios configurados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {servicios.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{item.codigo}</h4>
                        {getEstadoBadge(item.estado)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.nombre}</p>
                      <p className="text-xs text-gray-500 mb-2">{item.tipo} - {item.categoria}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Plataforma: {item.plataforma}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ModuleCard>
        </div>
      </div>
    </ModulePageLayout>
  );
}
