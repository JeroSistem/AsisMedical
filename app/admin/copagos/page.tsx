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
  Percent,
  Users
} from 'lucide-react';

export default function CopagosPage() {
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [copago, setCopago] = useState({
    // Información básica
    codigo: '',
    nombre: '',
    descripcion: '',
    tipo: '',
    categoria: '',
    
    // Información de porcentajes
    porcentajeCopago: '',
    porcentajeCobertura: '',
    montoMinimo: '',
    montoMaximo: '',
    moneda: 'COP',
    
    // Información de aplicación
    aplicaServicios: [],
    aplicaPacientes: [],
    aplicaEntidades: [],
    requiereAutorizacion: false,
    
    // Información de vigencia
    fechaInicio: '',
    fechaFin: '',
    vigente: true,
    
    // Información adicional
    observaciones: '',
    activo: true
  });

  // Estado para la lista de copagos
  const [copagos, setCopagos] = useState([
    {
      id: 1,
      codigo: 'COP001',
      nombre: 'Copago General',
      tipo: 'Porcentual',
      categoria: 'General',
      porcentajeCopago: '20%',
      porcentajeCobertura: '80%',
      estado: 'vigente'
    },
    {
      id: 2,
      codigo: 'COP002',
      nombre: 'Copago Especializado',
      tipo: 'Fijo',
      categoria: 'Especializado',
      porcentajeCopago: '$10,000',
      porcentajeCobertura: '90%',
      estado: 'vigente'
    },
    {
      id: 3,
      codigo: 'COP003',
      nombre: 'Copago Urgencias',
      tipo: 'Porcentual',
      categoria: 'Urgencias',
      porcentajeCopago: '10%',
      porcentajeCobertura: '90%',
      estado: 'vigente'
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setCopago(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Copago guardado",
      description: "El copago se ha guardado exitosamente.",
    });
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'vigente':
        return <Badge className="bg-green-100 text-green-800">Vigente</Badge>;
      case 'vencido':
        return <Badge variant="destructive">Vencido</Badge>;
      case 'inactivo':
        return <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>;
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
      title="Gestión de Copagos"
      description="Administración de copagos y coberturas"
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
                  <Percent className="w-5 h-5 mr-2" />
                  Información del Copago
                </CardTitle>
                <CardDescription>
                  Complete la información del copago
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="codigo">Código del Copago</Label>
                        <Input
                          id="codigo"
                          value={copago.codigo}
                          onChange={(e) => handleInputChange('codigo', e.target.value)}
                          placeholder="COP001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nombre">Nombre del Copago</Label>
                        <Input
                          id="nombre"
                          value={copago.nombre}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          placeholder="Nombre del copago"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo">Tipo de Copago</Label>
                        <Select value={copago.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="porcentual">Porcentual</SelectItem>
                            <SelectItem value="fijo">Fijo</SelectItem>
                            <SelectItem value="mixto">Mixto</SelectItem>
                            <SelectItem value="escalonado">Escalonado</SelectItem>
                            <SelectItem value="por-rango">Por Rango</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="categoria">Categoría</Label>
                        <Select value={copago.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="especializado">Especializado</SelectItem>
                            <SelectItem value="urgencias">Urgencias</SelectItem>
                            <SelectItem value="consultas">Consultas</SelectItem>
                            <SelectItem value="procedimientos">Procedimientos</SelectItem>
                            <SelectItem value="medicamentos">Medicamentos</SelectItem>
                            <SelectItem value="laboratorio">Laboratorio</SelectItem>
                            <SelectItem value="imagenes">Imágenes</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={copago.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Descripción detallada del copago"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Información de porcentajes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información de Porcentajes y Montos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="porcentajeCopago">Porcentaje de Copago (%)</Label>
                        <Input
                          id="porcentajeCopago"
                          type="number"
                          value={copago.porcentajeCopago}
                          onChange={(e) => handleInputChange('porcentajeCopago', e.target.value)}
                          placeholder="20"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="porcentajeCobertura">Porcentaje de Cobertura (%)</Label>
                        <Input
                          id="porcentajeCobertura"
                          type="number"
                          value={copago.porcentajeCobertura}
                          onChange={(e) => handleInputChange('porcentajeCobertura', e.target.value)}
                          placeholder="80"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="montoMinimo">Monto Mínimo</Label>
                        <Input
                          id="montoMinimo"
                          type="number"
                          value={copago.montoMinimo}
                          onChange={(e) => handleInputChange('montoMinimo', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="montoMaximo">Monto Máximo</Label>
                        <Input
                          id="montoMaximo"
                          type="number"
                          value={copago.montoMaximo}
                          onChange={(e) => handleInputChange('montoMaximo', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="moneda">Moneda</Label>
                        <Select value={copago.moneda} onValueChange={(value) => handleInputChange('moneda', value)}>
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
                    </div>
                  </div>

                  <Separator />

                  {/* Información de aplicación */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Configuración de Aplicación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="aplicaServicios">Servicios Aplicables</Label>
                        <Select value={copago.aplicaServicios.join(',')} onValueChange={(value) => handleInputChange('aplicaServicios', value.split(','))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar servicios" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consultas">Consultas</SelectItem>
                            <SelectItem value="procedimientos">Procedimientos</SelectItem>
                            <SelectItem value="laboratorio">Laboratorio</SelectItem>
                            <SelectItem value="imagenes">Imágenes</SelectItem>
                            <SelectItem value="medicamentos">Medicamentos</SelectItem>
                            <SelectItem value="urgencias">Urgencias</SelectItem>
                            <SelectItem value="hospitalizacion">Hospitalización</SelectItem>
                            <SelectItem value="todos">Todos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="aplicaPacientes">Tipos de Pacientes</Label>
                        <Select value={copago.aplicaPacientes.join(',')} onValueChange={(value) => handleInputChange('aplicaPacientes', value.split(','))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="particular">Particular</SelectItem>
                            <SelectItem value="asegurado">Asegurado</SelectItem>
                            <SelectItem value="convenio">Convenio</SelectItem>
                            <SelectItem value="prepagada">Prepaga</SelectItem>
                            <SelectItem value="todos">Todos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="aplicaEntidades">Entidades Aplicables</Label>
                        <Select value={copago.aplicaEntidades.join(',')} onValueChange={(value) => handleInputChange('aplicaEntidades', value.split(','))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar entidades" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eps">EPS</SelectItem>
                            <SelectItem value="ars">ARS</SelectItem>
                            <SelectItem value="prepagada">Prepaga</SelectItem>
                            <SelectItem value="particular">Particular</SelectItem>
                            <SelectItem value="todos">Todos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="requiereAutorizacion"
                          checked={copago.requiereAutorizacion}
                          onCheckedChange={(checked) => handleInputChange('requiereAutorizacion', checked)}
                        />
                        <Label htmlFor="requiereAutorizacion">Requiere Autorización</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de vigencia */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Período de Vigencia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                        <Input
                          id="fechaInicio"
                          type="date"
                          value={copago.fechaInicio}
                          onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fechaFin">Fecha de Fin</Label>
                        <Input
                          id="fechaFin"
                          type="date"
                          value={copago.fechaFin}
                          onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="vigente"
                        checked={copago.vigente}
                        onCheckedChange={(checked) => handleInputChange('vigente', checked)}
                      />
                      <Label htmlFor="vigente">Copago Vigente</Label>
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
                        value={copago.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        placeholder="Observaciones adicionales sobre el copago"
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
                        checked={copago.activo}
                        onCheckedChange={(checked) => handleInputChange('activo', checked)}
                      />
                      <Label htmlFor="activo">Copago Activo</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                      <Button type="submit">
                        <Plus className="w-4 h-4 mr-2" />
                        Guardar Copago
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ModuleCard>
        </div>

        {/* Lista de copagos */}
        <div className="lg:col-span-1">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Percent className="w-5 h-5 mr-2" />
                  Copagos
                </CardTitle>
                <CardDescription>
                  Lista de copagos configurados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {copagos.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{item.codigo}</h4>
                        {getEstadoBadge(item.estado)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.nombre}</p>
                      <p className="text-xs text-gray-500 mb-2">{item.tipo} - {item.categoria}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Copago: {item.porcentajeCopago}</span>
                        <span>Cobertura: {item.porcentajeCobertura}</span>
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
