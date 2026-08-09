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
  DollarSign, 
  Calculator, 
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
  TrendingUp,
  Building,
  Users
} from 'lucide-react';

export default function CentrosCostosPage() {
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [centroCosto, setCentroCosto] = useState({
    // Información básica
    codigo: '',
    nombre: '',
    descripcion: '',
    tipo: '',
    categoria: '',
    
    // Información de costos
    presupuestoAnual: '',
    presupuestoMensual: '',
    moneda: 'COP',
    tipoPresupuesto: '',
    
    // Información de responsabilidad
    responsable: '',
    telefono: '',
    email: '',
    departamento: '',
    
    // Información de asignación
    asignacionAutomatica: false,
    porcentajeAsignacion: '',
    criterioAsignacion: '',
    
    // Información adicional
    observaciones: '',
    activo: true
  });

  // Estado para la lista de centros de costos
  const [centrosCostos, setCentrosCostos] = useState([
    {
      id: 1,
      codigo: 'CC001',
      nombre: 'Centro de Costos Médicos',
      tipo: 'Médico',
      categoria: 'Atención Directa',
      presupuestoAnual: '$500,000,000',
      responsable: 'Dr. Juan Pérez',
      estado: 'activo'
    },
    {
      id: 2,
      codigo: 'CC002',
      nombre: 'Centro de Costos Administrativos',
      tipo: 'Administrativo',
      categoria: 'Gestión',
      presupuestoAnual: '$200,000,000',
      responsable: 'Lic. María García',
      estado: 'activo'
    },
    {
      id: 3,
      codigo: 'CC003',
      nombre: 'Centro de Costos de Laboratorio',
      tipo: 'Servicios',
      categoria: 'Diagnóstico',
      presupuestoAnual: '$150,000,000',
      responsable: 'Dr. Carlos López',
      estado: 'activo'
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setCentroCosto(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Centro de costos guardado",
      description: "El centro de costos se ha guardado exitosamente.",
    });
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'inactivo':
        return <Badge variant="destructive">Inactivo</Badge>;
      case 'suspendido':
        return <Badge className="bg-yellow-100 text-yellow-800">Suspendido</Badge>;
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
      title="Gestión de Centros de Costos"
      description="Administración de centros de costos y presupuestos"
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
                  <DollarSign className="w-5 h-5 mr-2" />
                  Información del Centro de Costos
                </CardTitle>
                <CardDescription>
                  Complete la información del centro de costos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="codigo">Código del Centro</Label>
                        <Input
                          id="codigo"
                          value={centroCosto.codigo}
                          onChange={(e) => handleInputChange('codigo', e.target.value)}
                          placeholder="CC001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nombre">Nombre del Centro</Label>
                        <Input
                          id="nombre"
                          value={centroCosto.nombre}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          placeholder="Nombre del centro de costos"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo">Tipo de Centro</Label>
                        <Select value={centroCosto.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="medico">Médico</SelectItem>
                            <SelectItem value="administrativo">Administrativo</SelectItem>
                            <SelectItem value="servicios">Servicios</SelectItem>
                            <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                            <SelectItem value="logistica">Logística</SelectItem>
                            <SelectItem value="tecnologia">Tecnología</SelectItem>
                            <SelectItem value="recursos-humanos">Recursos Humanos</SelectItem>
                            <SelectItem value="financiero">Financiero</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="categoria">Categoría</Label>
                        <Select value={centroCosto.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="atencion-directa">Atención Directa</SelectItem>
                            <SelectItem value="atencion-indirecta">Atención Indirecta</SelectItem>
                            <SelectItem value="gestion">Gestión</SelectItem>
                            <SelectItem value="soporte">Soporte</SelectItem>
                            <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                            <SelectItem value="tratamiento">Tratamiento</SelectItem>
                            <SelectItem value="prevencion">Prevención</SelectItem>
                            <SelectItem value="investigacion">Investigación</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={centroCosto.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Descripción detallada del centro de costos"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Información de costos */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información de Presupuesto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="presupuestoAnual">Presupuesto Anual</Label>
                        <Input
                          id="presupuestoAnual"
                          type="number"
                          value={centroCosto.presupuestoAnual}
                          onChange={(e) => handleInputChange('presupuestoAnual', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="presupuestoMensual">Presupuesto Mensual</Label>
                        <Input
                          id="presupuestoMensual"
                          type="number"
                          value={centroCosto.presupuestoMensual}
                          onChange={(e) => handleInputChange('presupuestoMensual', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="moneda">Moneda</Label>
                        <Select value={centroCosto.moneda} onValueChange={(value) => handleInputChange('moneda', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                            <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tipoPresupuesto">Tipo de Presupuesto</Label>
                        <Select value={centroCosto.tipoPresupuesto} onValueChange={(value) => handleInputChange('tipoPresupuesto', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fijo">Fijo</SelectItem>
                            <SelectItem value="variable">Variable</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                            <SelectItem value="por-proyecto">Por Proyecto</SelectItem>
                            <SelectItem value="por-actividad">Por Actividad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de responsabilidad */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información de Responsabilidad</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="responsable">Responsable</Label>
                        <Input
                          id="responsable"
                          value={centroCosto.responsable}
                          onChange={(e) => handleInputChange('responsable', e.target.value)}
                          placeholder="Nombre del responsable"
                        />
                      </div>
                      <div>
                        <Label htmlFor="departamento">Departamento</Label>
                        <Input
                          id="departamento"
                          value={centroCosto.departamento}
                          onChange={(e) => handleInputChange('departamento', e.target.value)}
                          placeholder="Departamento"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          value={centroCosto.telefono}
                          onChange={(e) => handleInputChange('telefono', e.target.value)}
                          placeholder="Teléfono de contacto"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={centroCosto.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Email de contacto"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de asignación */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Configuración de Asignación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="asignacionAutomatica"
                          checked={centroCosto.asignacionAutomatica}
                          onCheckedChange={(checked) => handleInputChange('asignacionAutomatica', checked)}
                        />
                        <Label htmlFor="asignacionAutomatica">Asignación Automática</Label>
                      </div>
                      <div>
                        <Label htmlFor="porcentajeAsignacion">Porcentaje de Asignación (%)</Label>
                        <Input
                          id="porcentajeAsignacion"
                          type="number"
                          value={centroCosto.porcentajeAsignacion}
                          onChange={(e) => handleInputChange('porcentajeAsignacion', e.target.value)}
                          placeholder="0"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="criterioAsignacion">Criterio de Asignación</Label>
                        <Select value={centroCosto.criterioAsignacion} onValueChange={(value) => handleInputChange('criterioAsignacion', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar criterio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="por-paciente">Por Paciente</SelectItem>
                            <SelectItem value="por-procedimiento">Por Procedimiento</SelectItem>
                            <SelectItem value="por-hora">Por Hora</SelectItem>
                            <SelectItem value="por-uso">Por Uso</SelectItem>
                            <SelectItem value="por-costo-directo">Por Costo Directo</SelectItem>
                            <SelectItem value="por-actividad">Por Actividad</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                        value={centroCosto.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        placeholder="Observaciones adicionales sobre el centro de costos"
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
                        checked={centroCosto.activo}
                        onCheckedChange={(checked) => handleInputChange('activo', checked)}
                      />
                      <Label htmlFor="activo">Centro Activo</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                      <Button type="submit">
                        <Plus className="w-4 h-4 mr-2" />
                        Guardar Centro
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ModuleCard>
        </div>

        {/* Lista de centros de costos */}
        <div className="lg:col-span-1">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Centros de Costos
                </CardTitle>
                <CardDescription>
                  Lista de centros de costos configurados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {centrosCostos.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{item.codigo}</h4>
                        {getEstadoBadge(item.estado)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.nombre}</p>
                      <p className="text-xs text-gray-500 mb-2">{item.tipo} - {item.categoria}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium">{item.presupuestoAnual}</span>
                        <span>{item.responsable}</span>
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
