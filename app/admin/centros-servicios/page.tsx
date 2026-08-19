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
  Building, 
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
  AlertTriangle,
  CheckCircle,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export default function CentrosServiciosPage() {
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [centro, setCentro] = useState({
    // Información básica
    codigo: '',
    nombre: '',
    descripcion: '',
    tipo: '',
    categoria: '',
    
    // Información de ubicación
    direccion: '',
    ciudad: '',
    departamento: '',
    codigoPostal: '',
    telefono: '',
    email: '',
    
    // Información de servicios
    servicios: [],
    horarioAtencion: '',
    capacidad: '',
    
    // Información de personal
    responsable: '',
    telefonoResponsable: '',
    emailResponsable: '',
    
    // Información adicional
    observaciones: '',
    activo: true
  });

  // Estado para la lista de centros
  const [centros, setCentros] = useState([
    {
      id: 1,
      codigo: 'CS001',
      nombre: 'Centro Médico Principal',
      tipo: 'Hospital',
      categoria: 'Atención Primaria',
      ciudad: 'Bogotá',
      responsable: 'Dr. Juan Pérez',
      estado: 'activo'
    },
    {
      id: 2,
      codigo: 'CS002',
      nombre: 'Centro de Especialidades',
      tipo: 'Clínica',
      categoria: 'Atención Especializada',
      ciudad: 'Bogotá',
      responsable: 'Dra. María García',
      estado: 'activo'
    },
    {
      id: 3,
      codigo: 'CS003',
      nombre: 'Centro de Laboratorio',
      tipo: 'Laboratorio',
      categoria: 'Diagnóstico',
      ciudad: 'Bogotá',
      responsable: 'Dr. Carlos López',
      estado: 'activo'
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setCentro(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Centro de servicios guardado",
      description: "El centro de servicios se ha guardado exitosamente.",
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
      title="Gestión de Centros de Servicios"
      description="Administración de centros de atención médica"
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
                  <Building className="w-5 h-5 mr-2" />
                  Información del Centro de Servicios
                </CardTitle>
                <CardDescription>
                  Complete la información del centro de servicios
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
                          value={centro.codigo}
                          onChange={(e) => handleInputChange('codigo', e.target.value)}
                          placeholder="CS001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nombre">Nombre del Centro</Label>
                        <Input
                          id="nombre"
                          value={centro.nombre}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          placeholder="Nombre del centro"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo">Tipo de Centro</Label>
                        <Select value={centro.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hospital">Hospital</SelectItem>
                            <SelectItem value="clinica">Clínica</SelectItem>
                            <SelectItem value="centro-salud">Centro de Salud</SelectItem>
                            <SelectItem value="laboratorio">Laboratorio</SelectItem>
                            <SelectItem value="imagenes">Centro de Imágenes</SelectItem>
                            <SelectItem value="farmacia">Farmacia</SelectItem>
                            <SelectItem value="urgencias">Centro de Urgencias</SelectItem>
                            <SelectItem value="rehabilitacion">Centro de Rehabilitación</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="categoria">Categoría</Label>
                        <Select value={centro.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="atencion-primaria">Atención Primaria</SelectItem>
                            <SelectItem value="atencion-especializada">Atención Especializada</SelectItem>
                            <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                            <SelectItem value="tratamiento">Tratamiento</SelectItem>
                            <SelectItem value="rehabilitacion">Rehabilitación</SelectItem>
                            <SelectItem value="prevencion">Prevención</SelectItem>
                            <SelectItem value="urgencias">Urgencias</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={centro.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Descripción detallada del centro"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Información de ubicación */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información de Ubicación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input
                          id="direccion"
                          value={centro.direccion}
                          onChange={(e) => handleInputChange('direccion', e.target.value)}
                          placeholder="Dirección completa"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ciudad">Ciudad</Label>
                        <Input
                          id="ciudad"
                          value={centro.ciudad}
                          onChange={(e) => handleInputChange('ciudad', e.target.value)}
                          placeholder="Ciudad"
                        />
                      </div>
                      <div>
                        <Label htmlFor="departamento">Departamento</Label>
                        <Input
                          id="departamento"
                          value={centro.departamento}
                          onChange={(e) => handleInputChange('departamento', e.target.value)}
                          placeholder="Departamento"
                        />
                      </div>
                      <div>
                        <Label htmlFor="codigoPostal">Código Postal</Label>
                        <Input
                          id="codigoPostal"
                          value={centro.codigoPostal}
                          onChange={(e) => handleInputChange('codigoPostal', e.target.value)}
                          placeholder="Código postal"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          value={centro.telefono}
                          onChange={(e) => handleInputChange('telefono', e.target.value)}
                          placeholder="Teléfono de contacto"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={centro.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Email de contacto"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de servicios */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información de Servicios</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="horarioAtencion">Horario de Atención</Label>
                        <Input
                          id="horarioAtencion"
                          value={centro.horarioAtencion}
                          onChange={(e) => handleInputChange('horarioAtencion', e.target.value)}
                          placeholder="Ej: Lunes a Viernes 8:00 AM - 6:00 PM"
                        />
                      </div>
                      <div>
                        <Label htmlFor="capacidad">Capacidad</Label>
                        <Input
                          id="capacidad"
                          value={centro.capacidad}
                          onChange={(e) => handleInputChange('capacidad', e.target.value)}
                          placeholder="Ej: 50 pacientes/día"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="servicios">Servicios Ofrecidos</Label>
                      <Textarea
                        id="servicios"
                        value={centro.servicios.join(', ')}
                        onChange={(e) => handleInputChange('servicios', e.target.value.split(', '))}
                        placeholder="Lista de servicios ofrecidos (separados por comas)"
                        rows={3}
                      />
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
                          value={centro.responsable}
                          onChange={(e) => handleInputChange('responsable', e.target.value)}
                          placeholder="Nombre del responsable"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefonoResponsable">Teléfono del Responsable</Label>
                        <Input
                          id="telefonoResponsable"
                          value={centro.telefonoResponsable}
                          onChange={(e) => handleInputChange('telefonoResponsable', e.target.value)}
                          placeholder="Teléfono del responsable"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emailResponsable">Email del Responsable</Label>
                        <Input
                          id="emailResponsable"
                          type="email"
                          value={centro.emailResponsable}
                          onChange={(e) => handleInputChange('emailResponsable', e.target.value)}
                          placeholder="Email del responsable"
                        />
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
                        value={centro.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        placeholder="Observaciones adicionales sobre el centro"
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
                        checked={centro.activo}
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

        {/* Lista de centros */}
        <div className="lg:col-span-1">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Centros de Servicios
                </CardTitle>
                <CardDescription>
                  Lista de centros configurados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {centros.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{item.codigo}</h4>
                        {getEstadoBadge(item.estado)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.nombre}</p>
                      <p className="text-xs text-gray-500 mb-2">{item.tipo} - {item.categoria}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{item.ciudad}</span>
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
