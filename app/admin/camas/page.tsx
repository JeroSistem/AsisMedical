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
  Bed, 
  Home, 
  Users, 
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Heart,
  AlertTriangle
} from 'lucide-react';

export default function CamasPage() {
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [cama, setCama] = useState({
    // Información básica
    numeroCama: '',
    habitacion: '',
    tipoCama: '',
    especialidad: '',
    
    // Características
    tieneMonitoreo: false,
    tieneVentilador: false,
    tieneBombaInfusion: false,
    tieneElectrocardiografo: false,
    tieneOximetro: false,
    tieneTensionArterial: false,
    
    // Estado y mantenimiento
    estado: 'disponible',
    estadoMantenimiento: 'bueno',
    ultimaLimpieza: '',
    proximaLimpieza: '',
    ultimoMantenimiento: '',
    proximoMantenimiento: '',
    
    // Información adicional
    observaciones: '',
    activa: true
  });

  // Estado para la lista de camas
  const [camas, setCamas] = useState([
    {
      id: 1,
      numero: 'C001',
      habitacion: '101',
      tipo: 'Estándar',
      especialidad: 'Medicina General',
      estado: 'disponible',
      ultimaLimpieza: '2024-01-15'
    },
    {
      id: 2,
      numero: 'C002',
      habitacion: '102',
      tipo: 'UCI',
      especialidad: 'Cuidados Intensivos',
      estado: 'ocupada',
      ultimaLimpieza: '2024-01-14'
    },
    {
      id: 3,
      numero: 'C003',
      habitacion: '201',
      tipo: 'Pediatría',
      especialidad: 'Pediatría',
      estado: 'mantenimiento',
      ultimaLimpieza: '2024-01-10'
    }
  ]);

  // Lista de habitaciones disponibles
  const habitaciones = [
    { id: '101', numero: '101', piso: '1' },
    { id: '102', numero: '102', piso: '1' },
    { id: '201', numero: '201', piso: '2' },
    { id: '202', numero: '202', piso: '2' },
    { id: '301', numero: '301', piso: '3' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setCama(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Cama guardada",
      description: "La cama se ha guardado exitosamente.",
    });
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'ocupada':
        return <Badge variant="destructive">Ocupada</Badge>;
      case 'mantenimiento':
        return <Badge className="bg-yellow-100 text-yellow-800">Mantenimiento</Badge>;
      case 'reservada':
        return <Badge className="bg-blue-100 text-blue-800">Reservada</Badge>;
      case 'limpieza':
        return <Badge className="bg-purple-100 text-purple-800">Limpieza</Badge>;
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
      title="Gestión de Camas"
      description="Administración de camas y equipamiento hospitalario"
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
                  <Bed className="w-5 h-5 mr-2" />
                  Información de la Cama
                </CardTitle>
                <CardDescription>
                  Complete la información de la cama y su equipamiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="numeroCama">Número de Cama</Label>
                        <Input
                          id="numeroCama"
                          value={cama.numeroCama}
                          onChange={(e) => handleInputChange('numeroCama', e.target.value)}
                          placeholder="C001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="habitacion">Habitación</Label>
                        <Select value={cama.habitacion} onValueChange={(value) => handleInputChange('habitacion', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar habitación" />
                          </SelectTrigger>
                          <SelectContent>
                            {habitaciones.map((hab) => (
                              <SelectItem key={hab.id} value={hab.id}>
                                Habitación {hab.numero} - Piso {hab.piso}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tipoCama">Tipo de Cama</Label>
                        <Select value={cama.tipoCama} onValueChange={(value) => handleInputChange('tipoCama', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="estandar">Estándar</SelectItem>
                            <SelectItem value="uci">UCI</SelectItem>
                            <SelectItem value="uti">UTI</SelectItem>
                            <SelectItem value="pediatria">Pediatría</SelectItem>
                            <SelectItem value="obstetricia">Obstetricia</SelectItem>
                            <SelectItem value="geriatria">Geriatría</SelectItem>
                            <SelectItem value="trauma">Trauma</SelectItem>
                            <SelectItem value="quemados">Quemados</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="especialidad">Especialidad</Label>
                        <Select value={cama.especialidad} onValueChange={(value) => handleInputChange('especialidad', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar especialidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="medicina-general">Medicina General</SelectItem>
                            <SelectItem value="cuidados-intensivos">Cuidados Intensivos</SelectItem>
                            <SelectItem value="pediatria">Pediatría</SelectItem>
                            <SelectItem value="obstetricia">Obstetricia</SelectItem>
                            <SelectItem value="geriatria">Geriatría</SelectItem>
                            <SelectItem value="trauma">Trauma</SelectItem>
                            <SelectItem value="cardiologia">Cardiología</SelectItem>
                            <SelectItem value="neurologia">Neurología</SelectItem>
                            <SelectItem value="cirugia">Cirugía</SelectItem>
                            <SelectItem value="oncologia">Oncología</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="estado">Estado</Label>
                        <Select value={cama.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="disponible">Disponible</SelectItem>
                            <SelectItem value="ocupada">Ocupada</SelectItem>
                            <SelectItem value="reservada">Reservada</SelectItem>
                            <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                            <SelectItem value="limpieza">Limpieza</SelectItem>
                            <SelectItem value="inactiva">Inactiva</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Equipamiento */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Equipamiento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="tieneMonitoreo"
                          checked={cama.tieneMonitoreo}
                          onCheckedChange={(checked) => handleInputChange('tieneMonitoreo', checked)}
                        />
                        <Label htmlFor="tieneMonitoreo">Monitor de signos vitales</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="tieneVentilador"
                          checked={cama.tieneVentilador}
                          onCheckedChange={(checked) => handleInputChange('tieneVentilador', checked)}
                        />
                        <Label htmlFor="tieneVentilador">Ventilador mecánico</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="tieneBombaInfusion"
                          checked={cama.tieneBombaInfusion}
                          onCheckedChange={(checked) => handleInputChange('tieneBombaInfusion', checked)}
                        />
                        <Label htmlFor="tieneBombaInfusion">Bomba de infusión</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="tieneElectrocardiografo"
                          checked={cama.tieneElectrocardiografo}
                          onCheckedChange={(checked) => handleInputChange('tieneElectrocardiografo', checked)}
                        />
                        <Label htmlFor="tieneElectrocardiografo">Electrocardiógrafo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="tieneOximetro"
                          checked={cama.tieneOximetro}
                          onCheckedChange={(checked) => handleInputChange('tieneOximetro', checked)}
                        />
                        <Label htmlFor="tieneOximetro">Oxímetro de pulso</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="tieneTensionArterial"
                          checked={cama.tieneTensionArterial}
                          onCheckedChange={(checked) => handleInputChange('tieneTensionArterial', checked)}
                        />
                        <Label htmlFor="tieneTensionArterial">Tensiómetro automático</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Mantenimiento */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Mantenimiento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="estadoMantenimiento">Estado de Mantenimiento</Label>
                        <Select value={cama.estadoMantenimiento} onValueChange={(value) => handleInputChange('estadoMantenimiento', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excelente">Excelente</SelectItem>
                            <SelectItem value="bueno">Bueno</SelectItem>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="malo">Malo</SelectItem>
                            <SelectItem value="requiere-reparacion">Requiere Reparación</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="ultimaLimpieza">Última Limpieza</Label>
                        <Input
                          id="ultimaLimpieza"
                          type="date"
                          value={cama.ultimaLimpieza}
                          onChange={(e) => handleInputChange('ultimaLimpieza', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="proximaLimpieza">Próxima Limpieza</Label>
                        <Input
                          id="proximaLimpieza"
                          type="date"
                          value={cama.proximaLimpieza}
                          onChange={(e) => handleInputChange('proximaLimpieza', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ultimoMantenimiento">Último Mantenimiento</Label>
                        <Input
                          id="ultimoMantenimiento"
                          type="date"
                          value={cama.ultimoMantenimiento}
                          onChange={(e) => handleInputChange('ultimoMantenimiento', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="proximoMantenimiento">Próximo Mantenimiento</Label>
                        <Input
                          id="proximoMantenimiento"
                          type="date"
                          value={cama.proximoMantenimiento}
                          onChange={(e) => handleInputChange('proximoMantenimiento', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Observaciones */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Adicional</h3>
                    <div>
                      <Label htmlFor="observaciones">Observaciones</Label>
                      <Textarea
                        id="observaciones"
                        value={cama.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        placeholder="Observaciones sobre la cama, equipamiento especial, restricciones, etc."
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Estado */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="activa"
                        checked={cama.activa}
                        onCheckedChange={(checked) => handleInputChange('activa', checked)}
                      />
                      <Label htmlFor="activa">Cama Activa</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                      <Button type="submit">
                        <Plus className="w-4 h-4 mr-2" />
                        Guardar Cama
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ModuleCard>
        </div>

        {/* Lista de camas */}
        <div className="lg:col-span-1">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bed className="w-5 h-5 mr-2" />
                  Camas Registradas
                </CardTitle>
                <CardDescription>
                  Lista de camas del hospital
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {camas.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">Cama {item.numero}</h4>
                        {getEstadoBadge(item.estado)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Habitación {item.habitacion} - {item.tipo}</p>
                      <p className="text-xs text-gray-500 mb-2">{item.especialidad}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Limpieza: {item.ultimaLimpieza}</span>
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
