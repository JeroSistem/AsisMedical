'use client';

import { useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Clock,
  Users,
  Activity,
  DollarSign,
  Bed,
  Stethoscope,
  Package,
  Settings,
  Filter,
  Search,
  Eye,
  X,
  RefreshCw
} from 'lucide-react';

export default function AlertasPage() {
  const [filtroTipo, setFiltroTipo] = useState('todas');
  const [filtroPrioridad, setFiltroPrioridad] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  // Configuración de alertas
  const [configuracion, setConfiguracion] = useState({
    notificacionesEmail: true,
    notificacionesSMS: false,
    notificacionesPush: true,
    alertasCriticas: true,
    alertasMedias: true,
    alertasBajas: false,
    horarioNotificaciones: '24h'
  });

  // Alertas activas
  const [alertas, setAlertas] = useState([
    {
      id: 1,
      titulo: 'Bajo stock en medicamentos críticos',
      descripcion: 'Los medicamentos de emergencia están por debajo del stock mínimo',
      tipo: 'inventario',
      prioridad: 'alta',
      fecha: '2024-01-15 14:30',
      estado: 'activa',
      departamento: 'Farmacia',
      accion: 'Reabastecer medicamentos críticos'
    },
    {
      id: 2,
      titulo: 'Mantenimiento programado para equipos',
      descripcion: 'Se requiere mantenimiento preventivo en equipos de UCI',
      tipo: 'equipo',
      prioridad: 'media',
      fecha: '2024-01-15 12:15',
      estado: 'activa',
      departamento: 'Mantenimiento',
      accion: 'Programar mantenimiento'
    },
    {
      id: 3,
      titulo: 'Personal médico requerido en UCI',
      descripcion: 'Se necesita personal médico adicional en la unidad de cuidados intensivos',
      tipo: 'personal',
      prioridad: 'alta',
      fecha: '2024-01-15 10:45',
      estado: 'activa',
      departamento: 'Recursos Humanos',
      accion: 'Asignar personal médico'
    },
    {
      id: 4,
      titulo: 'Paciente con resultados críticos',
      descripcion: 'Paciente Juan Pérez tiene resultados de laboratorio críticos',
      tipo: 'paciente',
      prioridad: 'alta',
      fecha: '2024-01-15 09:20',
      estado: 'resuelta',
      departamento: 'Laboratorio',
      accion: 'Revisar resultados'
    },
    {
      id: 5,
      titulo: 'Sistema de respaldo falló',
      descripcion: 'El sistema de respaldo automático no se ejecutó correctamente',
      tipo: 'sistema',
      prioridad: 'media',
      fecha: '2024-01-15 08:30',
      estado: 'activa',
      departamento: 'TI',
      accion: 'Verificar sistema de respaldo'
    },
    {
      id: 6,
      titulo: 'Temperatura fuera de rango en refrigerador',
      descripcion: 'La temperatura del refrigerador de medicamentos está fuera del rango seguro',
      tipo: 'equipo',
      prioridad: 'alta',
      fecha: '2024-01-15 07:15',
      estado: 'activa',
      departamento: 'Farmacia',
      accion: 'Verificar refrigerador'
    }
  ]);

  // Historial de alertas
  const [historial, setHistorial] = useState([
    {
      id: 7,
      titulo: 'Cama disponible en habitación 201',
      descripcion: 'La habitación 201 está disponible para nuevos pacientes',
      tipo: 'operativo',
      prioridad: 'baja',
      fecha: '2024-01-14 16:30',
      estado: 'resuelta',
      departamento: 'Enfermería',
      accion: 'Asignar paciente'
    },
    {
      id: 8,
      titulo: 'Actualización de software disponible',
      descripcion: 'Nueva versión del software médico disponible para actualización',
      tipo: 'sistema',
      prioridad: 'baja',
      fecha: '2024-01-14 15:45',
      estado: 'resuelta',
      departamento: 'TI',
      accion: 'Programar actualización'
    }
  ]);

  const handleMarcarResuelta = (id: number) => {
    setAlertas(prev => prev.map(alerta => 
      alerta.id === id ? { ...alerta, estado: 'resuelta' } : alerta
    ));
  };

  const handleConfiguracionChange = (campo: string, valor: boolean) => {
    setConfiguracion(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'inventario':
        return <Package className="w-5 h-5 text-orange-500" />;
      case 'equipo':
        return <Activity className="w-5 h-5 text-blue-500" />;
      case 'personal':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'paciente':
        return <Stethoscope className="w-5 h-5 text-green-500" />;
      case 'sistema':
        return <Settings className="w-5 h-5 text-gray-500" />;
      case 'operativo':
        return <Bed className="w-5 h-5 text-indigo-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const alertasFiltradas = alertas.filter(alerta => {
    const cumpleTipo = filtroTipo === 'todas' || alerta.tipo === filtroTipo;
    const cumplePrioridad = filtroPrioridad === 'todas' || alerta.prioridad === filtroPrioridad;
    const cumpleBusqueda = busqueda === '' || 
      alerta.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      alerta.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    
    return cumpleTipo && cumplePrioridad && cumpleBusqueda;
  });

  const alertasActivas = alertasFiltradas.filter(alerta => alerta.estado === 'activa');
  const alertasResueltas = alertasFiltradas.filter(alerta => alerta.estado === 'resuelta');

  return (
    <ModulePageLayout
      title="Alertas"
      description="Gestión de alertas y notificaciones del sistema"
      actions={
        <>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </Button>
        </>
      }
    >

      {/* Resumen de alertas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertas.length}</div>
            <p className="text-xs text-muted-foreground">
              {alertasActivas.length} activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Prioridad</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alertas.filter(a => a.prioridad === 'alta' && a.estado === 'activa').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Prioridad</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {alertas.filter(a => a.prioridad === 'media' && a.estado === 'activa').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Atención en las próximas horas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resueltas Hoy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {historial.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Alertas resueltas
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activas">Alertas Activas</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="activas" className="space-y-6">
          {/* Filtros */}
          <ModuleCard
            title="Filtros"
            description="Configura los filtros para mostrar alertas específicas"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="busqueda">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="busqueda"
                    placeholder="Buscar alertas..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todos los tipos</SelectItem>
                    <SelectItem value="inventario">Inventario</SelectItem>
                    <SelectItem value="equipo">Equipo</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="paciente">Paciente</SelectItem>
                    <SelectItem value="sistema">Sistema</SelectItem>
                    <SelectItem value="operativo">Operativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="prioridad">Prioridad</Label>
                <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las prioridades</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <X className="w-4 h-4 mr-2" />
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </ModuleCard>

          {/* Lista de alertas activas */}
          <div className="space-y-4">
            {alertasActivas.map((alerta) => (
              <Card key={alerta.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {getTipoIcon(alerta.tipo)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{alerta.titulo}</h3>
                          <Badge className={getPrioridadColor(alerta.prioridad)}>
                            {alerta.prioridad.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{alerta.departamento}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{alerta.descripcion}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {alerta.fecha}
                          </span>
                          <span className="flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            {alerta.accion}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMarcarResuelta(alerta.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Resolver
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="historial" className="space-y-6">
          <ModuleCard
            title="Historial de Alertas"
            description="Alertas resueltas y archivadas"
          >
            <div className="space-y-4">
              {historial.map((alerta) => (
                <div key={alerta.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {getTipoIcon(alerta.tipo)}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{alerta.titulo}</h4>
                        <Badge className={getPrioridadColor(alerta.prioridad)}>
                          {alerta.prioridad.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Resuelta
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{alerta.descripcion}</p>
                      <p className="text-xs text-gray-500 mt-1">{alerta.fecha}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ModuleCard>
        </TabsContent>

        <TabsContent value="configuracion" className="space-y-6">
          <ModuleCard
            title="Configuración de Alertas"
            description="Personaliza las notificaciones y alertas del sistema"
          >
            <div className="space-y-6">
              {/* Notificaciones */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Notificaciones</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email">Notificaciones por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibir alertas por correo electrónico
                      </p>
                    </div>
                    <Switch
                      id="email"
                      checked={configuracion.notificacionesEmail}
                      onCheckedChange={(checked) => handleConfiguracionChange('notificacionesEmail', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms">Notificaciones por SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibir alertas críticas por mensaje de texto
                      </p>
                    </div>
                    <Switch
                      id="sms"
                      checked={configuracion.notificacionesSMS}
                      onCheckedChange={(checked) => handleConfiguracionChange('notificacionesSMS', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push">Notificaciones Push</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibir notificaciones en el navegador
                      </p>
                    </div>
                    <Switch
                      id="push"
                      checked={configuracion.notificacionesPush}
                      onCheckedChange={(checked) => handleConfiguracionChange('notificacionesPush', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Tipos de Alertas</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="criticas">Alertas Críticas</Label>
                      <p className="text-sm text-muted-foreground">
                        Alertas de alta prioridad que requieren atención inmediata
                      </p>
                    </div>
                    <Switch
                      id="criticas"
                      checked={configuracion.alertasCriticas}
                      onCheckedChange={(checked) => handleConfiguracionChange('alertasCriticas', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="medias">Alertas Medias</Label>
                      <p className="text-sm text-muted-foreground">
                        Alertas de prioridad media para atención en las próximas horas
                      </p>
                    </div>
                    <Switch
                      id="medias"
                      checked={configuracion.alertasMedias}
                      onCheckedChange={(checked) => handleConfiguracionChange('alertasMedias', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="bajas">Alertas Bajas</Label>
                      <p className="text-sm text-muted-foreground">
                        Alertas informativas de baja prioridad
                      </p>
                    </div>
                    <Switch
                      id="bajas"
                      checked={configuracion.alertasBajas}
                      onCheckedChange={(checked) => handleConfiguracionChange('alertasBajas', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Guardar Configuración</Button>
                </div>
              </div>
            </div>
          </ModuleCard>
        </TabsContent>
      </Tabs>
    </ModulePageLayout>
  );
}

