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
  Home, 
  Bed, 
  Users, 
  MapPin, 
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

export default function HabitacionesPage() {
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [habitacion, setHabitacion] = useState({
    // Información básica
    numeroHabitacion: '',
    piso: '',
    tipoHabitacion: '',
    capacidad: '',
    area: '',
    
    // Características
    tieneBano: true,
    tieneTelefono: true,
    tieneTelevision: true,
    tieneAireAcondicionado: true,
    tieneWifi: true,
    
    // Estado y mantenimiento
    estado: 'disponible',
    estadoMantenimiento: 'bueno',
    ultimaLimpieza: '',
    proximaLimpieza: '',
    
    // Información adicional
    observaciones: '',
    activa: true
  });

  // Estado para la lista de habitaciones
  const [habitaciones, setHabitaciones] = useState([
    {
      id: 1,
      numero: '101',
      piso: '1',
      tipo: 'Individual',
      capacidad: 1,
      estado: 'disponible',
      ultimaLimpieza: '2024-01-15'
    },
    {
      id: 2,
      numero: '102',
      piso: '1',
      tipo: 'Doble',
      capacidad: 2,
      estado: 'ocupada',
      ultimaLimpieza: '2024-01-14'
    },
    {
      id: 3,
      numero: '201',
      piso: '2',
      tipo: 'Suite',
      capacidad: 4,
      estado: 'mantenimiento',
      ultimaLimpieza: '2024-01-10'
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setHabitacion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Habitación guardada",
      description: "La habitación se ha guardado exitosamente.",
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
      title="Gestión de Habitaciones"
      description="Administración de habitaciones y camas del hospital"
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
                  <Home className="w-5 h-5 mr-2" />
                  Información de la Habitación
                </CardTitle>
                <CardDescription>
                  Complete la información de la habitación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="numeroHabitacion">Número de Habitación</Label>
                        <Input
                          id="numeroHabitacion"
                          value={habitacion.numeroHabitacion}
                          onChange={(e) => handleInputChange('numeroHabitacion', e.target.value)}
                          placeholder="101"
                        />
                      </div>
                      <div>
                        <Label htmlFor="piso">Piso</Label>
                        <Input
                          id="piso"
                          value={habitacion.piso}
                          onChange={(e) => handleInputChange('piso', e.target.value)}
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipoHabitacion">Tipo de Habitación</Label>
                        <Select value={habitacion.tipoHabitacion} onValueChange={(value) => handleInputChange('tipoHabitacion', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="doble">Doble</SelectItem>
                            <SelectItem value="triple">Triple</SelectItem>
                            <SelectItem value="suite">Suite</SelectItem>
                            <SelectItem value="uci">UCI</SelectItem>
                            <SelectItem value="uti">UTI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="capacidad">Capacidad (pacientes)</Label>
                        <Input
                          id="capacidad"
                          type="number"
                          value={habitacion.capacidad}
                          onChange={(e) => handleInputChange('capacidad', e.target.value)}
                          placeholder="1"
                          min="1"
                          max="10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="area">Área (m²)</Label>
                        <Input
                          id="area"
                          type="number"
                          value={habitacion.area}
                          onChange={(e) => handleInputChange('area', e.target.value)}
                          placeholder="20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="estado">Estado</Label>
                        <Select value={habitacion.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="disponible">Disponible</SelectItem>
                            <SelectItem value="ocupada">Ocupada</SelectItem>
                            <SelectItem value="reservada">Reservada</SelectItem>
                            <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                            <SelectItem value="inactiva">Inactiva</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Características */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Características</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="tieneBano"
                          checked={habitacion.tieneBano}
                          onCheckedChange={(checked) => handleInputChange('tieneBano', checked)}
                        />
                        <Label htmlFor="tieneBano">Baño privado</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="tieneTelefono"
                          checked={habitacion.tieneTelefono}
                          onCheckedChange={(checked) => handleInputChange('tieneTelefono', checked)}
                        />
                        <Label htmlFor="tieneTelefono">Teléfono</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="tieneTelevision"
                          checked={habitacion.tieneTelevision}
                          onCheckedChange={(checked) => handleInputChange('tieneTelevision', checked)}
                        />
                        <Label htmlFor="tieneTelevision">Televisión</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="tieneAireAcondicionado"
                          checked={habitacion.tieneAireAcondicionado}
                          onCheckedChange={(checked) => handleInputChange('tieneAireAcondicionado', checked)}
                        />
                        <Label htmlFor="tieneAireAcondicionado">Aire acondicionado</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="tieneWifi"
                          checked={habitacion.tieneWifi}
                          onCheckedChange={(checked) => handleInputChange('tieneWifi', checked)}
                        />
                        <Label htmlFor="tieneWifi">WiFi</Label>
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
                        <Select value={habitacion.estadoMantenimiento} onValueChange={(value) => handleInputChange('estadoMantenimiento', value)}>
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
                          value={habitacion.ultimaLimpieza}
                          onChange={(e) => handleInputChange('ultimaLimpieza', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="proximaLimpieza">Próxima Limpieza</Label>
                        <Input
                          id="proximaLimpieza"
                          type="date"
                          value={habitacion.proximaLimpieza}
                          onChange={(e) => handleInputChange('proximaLimpieza', e.target.value)}
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
                        value={habitacion.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        placeholder="Observaciones sobre la habitación, equipamiento especial, etc."
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
                        checked={habitacion.activa}
                        onCheckedChange={(checked) => handleInputChange('activa', checked)}
                      />
                      <Label htmlFor="activa">Habitación Activa</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                      <Button type="submit">
                        <Plus className="w-4 h-4 mr-2" />
                        Guardar Habitación
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ModuleCard>
        </div>

        {/* Lista de habitaciones */}
        <div className="lg:col-span-1">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bed className="w-5 h-5 mr-2" />
                  Habitaciones
                </CardTitle>
                <CardDescription>
                  Lista de habitaciones registradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {habitaciones.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">Habitación {item.numero}</h4>
                        {getEstadoBadge(item.estado)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Piso {item.piso} - {item.tipo}</p>
                      <p className="text-xs text-gray-500 mb-2">Capacidad: {item.capacidad} pacientes</p>
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
