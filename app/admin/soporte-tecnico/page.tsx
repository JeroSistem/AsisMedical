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
  Headphones, 
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
  Users,
  Phone,
  Mail
} from 'lucide-react';

export default function SoporteTecnicoPage() {
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [soporte, setSoporte] = useState({
    // Información básica
    codigo: '',
    nombre: '',
    descripcion: '',
    tipo: '',
    categoria: '',
    
    // Información de contacto
    telefono: '',
    email: '',
    horarioAtencion: '',
    tiempoRespuesta: '',
    
    // Información de personal
    responsable: '',
    telefonoResponsable: '',
    emailResponsable: '',
    especialidad: '',
    
    // Información de servicios
    servicios: [],
    nivelSoporte: '',
    requiereTicket: false,
    prioridad: '',
    
    // Información adicional
    observaciones: '',
    activo: true
  });

  // Estado para la lista de soportes
  const [soportes, setSoportes] = useState([
    {
      id: 1,
      codigo: 'ST001',
      nombre: 'Soporte Técnico General',
      tipo: 'Técnico',
      categoria: 'General',
      telefono: '300-123-4567',
      responsable: 'Ing. Carlos López',
      estado: 'activo'
    },
    {
      id: 2,
      codigo: 'ST002',
      nombre: 'Soporte de Software',
      tipo: 'Software',
      categoria: 'Especializado',
      telefono: '300-123-4568',
      responsable: 'Ing. María García',
      estado: 'activo'
    },
    {
      id: 3,
      codigo: 'ST003',
      nombre: 'Soporte de Hardware',
      tipo: 'Hardware',
      categoria: 'Especializado',
      telefono: '300-123-4569',
      responsable: 'Ing. Juan Pérez',
      estado: 'activo'
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setSoporte(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Soporte técnico guardado",
      description: "El soporte técnico se ha guardado exitosamente.",
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
      title="Gestión de Soporte Técnico"
      description="Administración de servicios de soporte técnico"
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
                  <Headphones className="w-5 h-5 mr-2" />
                  Información del Soporte Técnico
                </CardTitle>
                <CardDescription>
                  Complete la información del soporte técnico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="codigo">Código del Soporte</Label>
                        <Input
                          id="codigo"
                          value={soporte.codigo}
                          onChange={(e) => handleInputChange('codigo', e.target.value)}
                          placeholder="ST001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nombre">Nombre del Soporte</Label>
                        <Input
                          id="nombre"
                          value={soporte.nombre}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          placeholder="Nombre del soporte técnico"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo">Tipo de Soporte</Label>
                        <Select value={soporte.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tecnico">Técnico</SelectItem>
                            <SelectItem value="software">Software</SelectItem>
                            <SelectItem value="hardware">Hardware</SelectItem>
                            <SelectItem value="redes">Redes</SelectItem>
                            <SelectItem value="seguridad">Seguridad</SelectItem>
                            <SelectItem value="aplicaciones">Aplicaciones</SelectItem>
                            <SelectItem value="base-datos">Base de Datos</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="categoria">Categoría</Label>
                        <Select value={soporte.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="especializado">Especializado</SelectItem>
                            <SelectItem value="urgente">Urgente</SelectItem>
                            <SelectItem value="preventivo">Preventivo</SelectItem>
                            <SelectItem value="correctivo">Correctivo</SelectItem>
                            <SelectItem value="consultoria">Consultoría</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={soporte.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Descripción detallada del soporte técnico"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Información de contacto */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información de Contacto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="telefono">Teléfono de Contacto</Label>
                        <Input
                          id="telefono"
                          value={soporte.telefono}
                          onChange={(e) => handleInputChange('telefono', e.target.value)}
                          placeholder="300-123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email de Contacto</Label>
                        <Input
                          id="email"
                          type="email"
                          value={soporte.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="soporte@asis.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="horarioAtencion">Horario de Atención</Label>
                        <Input
                          id="horarioAtencion"
                          value={soporte.horarioAtencion}
                          onChange={(e) => handleInputChange('horarioAtencion', e.target.value)}
                          placeholder="Ej: Lunes a Viernes 8:00 AM - 6:00 PM"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tiempoRespuesta">Tiempo de Respuesta</Label>
                        <Input
                          id="tiempoRespuesta"
                          value={soporte.tiempoRespuesta}
                          onChange={(e) => handleInputChange('tiempoRespuesta', e.target.value)}
                          placeholder="Ej: 2 horas"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de personal */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información del Responsable</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="responsable">Responsable</Label>
                        <Input
                          id="responsable"
                          value={soporte.responsable}
                          onChange={(e) => handleInputChange('responsable', e.target.value)}
                          placeholder="Nombre del responsable"
                        />
                      </div>
                      <div>
                        <Label htmlFor="especialidad">Especialidad</Label>
                        <Input
                          id="especialidad"
                          value={soporte.especialidad}
                          onChange={(e) => handleInputChange('especialidad', e.target.value)}
                          placeholder="Especialidad técnica"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefonoResponsable">Teléfono del Responsable</Label>
                        <Input
                          id="telefonoResponsable"
                          value={soporte.telefonoResponsable}
                          onChange={(e) => handleInputChange('telefonoResponsable', e.target.value)}
                          placeholder="Teléfono del responsable"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emailResponsable">Email del Responsable</Label>
                        <Input
                          id="emailResponsable"
                          type="email"
                          value={soporte.emailResponsable}
                          onChange={(e) => handleInputChange('emailResponsable', e.target.value)}
                          placeholder="Email del responsable"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de servicios */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Configuración de Servicios</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nivelSoporte">Nivel de Soporte</Label>
                        <Select value={soporte.nivelSoporte} onValueChange={(value) => handleInputChange('nivelSoporte', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nivel1">Nivel 1 - Soporte Básico</SelectItem>
                            <SelectItem value="nivel2">Nivel 2 - Soporte Intermedio</SelectItem>
                            <SelectItem value="nivel3">Nivel 3 - Soporte Avanzado</SelectItem>
                            <SelectItem value="especializado">Especializado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="prioridad">Prioridad</Label>
                        <Select value={soporte.prioridad} onValueChange={(value) => handleInputChange('prioridad', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar prioridad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="baja">Baja</SelectItem>
                            <SelectItem value="media">Media</SelectItem>
                            <SelectItem value="alta">Alta</SelectItem>
                            <SelectItem value="critica">Crítica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="requiereTicket"
                          checked={soporte.requiereTicket}
                          onCheckedChange={(checked) => handleInputChange('requiereTicket', checked)}
                        />
                        <Label htmlFor="requiereTicket">Requiere Ticket</Label>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="servicios">Servicios Ofrecidos</Label>
                      <Textarea
                        id="servicios"
                        value={soporte.servicios.join(', ')}
                        onChange={(e) => handleInputChange('servicios', e.target.value.split(', '))}
                        placeholder="Lista de servicios ofrecidos (separados por comas)"
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
                        value={soporte.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        placeholder="Observaciones adicionales sobre el soporte técnico"
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
                        checked={soporte.activo}
                        onCheckedChange={(checked) => handleInputChange('activo', checked)}
                      />
                      <Label htmlFor="activo">Soporte Activo</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                      <Button type="submit">
                        <Plus className="w-4 h-4 mr-2" />
                        Guardar Soporte
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ModuleCard>
        </div>

        {/* Lista de soportes */}
        <div className="lg:col-span-1">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Headphones className="w-5 h-5 mr-2" />
                  Soporte Técnico
                </CardTitle>
                <CardDescription>
                  Lista de soportes configurados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {soportes.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{item.codigo}</h4>
                        {getEstadoBadge(item.estado)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.nombre}</p>
                      <p className="text-xs text-gray-500 mb-2">{item.tipo} - {item.categoria}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{item.telefono}</span>
                        <span className="font-medium">{item.responsable}</span>
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
