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
  Package, 
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
  Calendar,
  Users
} from 'lucide-react';

export default function ListasPreciosPage() {
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [listaPrecios, setListaPrecios] = useState({
    // Información básica
    codigo: '',
    nombre: '',
    descripcion: '',
    tipo: '',
    categoria: '',
    
    // Información de precios
    moneda: 'COP',
    porcentajeDescuento: '',
    porcentajeRecargo: '',
    
    // Información de vigencia
    fechaInicio: '',
    fechaFin: '',
    vigente: true,
    
    // Información de aplicación
    aplicaPacientes: true,
    aplicaEntidades: false,
    aplicaServicios: true,
    aplicaMedicamentos: true,
    
    // Información adicional
    observaciones: '',
    activo: true
  });

  // Estado para la lista de precios
  const [listasPrecios, setListasPrecios] = useState([
    {
      id: 1,
      codigo: 'LP001',
      nombre: 'Lista General',
      tipo: 'General',
      moneda: 'COP',
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      estado: 'vigente'
    },
    {
      id: 2,
      codigo: 'LP002',
      nombre: 'Lista VIP',
      tipo: 'Especial',
      moneda: 'COP',
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      estado: 'vigente'
    },
    {
      id: 3,
      codigo: 'LP003',
      nombre: 'Lista Convenios',
      tipo: 'Convenio',
      moneda: 'COP',
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      estado: 'vigente'
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setListaPrecios(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Lista de precios guardada",
      description: "La lista de precios se ha guardado exitosamente.",
    });
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'vigente':
        return <Badge className="bg-green-100 text-green-800">Vigente</Badge>;
      case 'vencida':
        return <Badge variant="destructive">Vencida</Badge>;
      case 'inactiva':
        return <Badge className="bg-gray-100 text-gray-800">Inactiva</Badge>;
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
      title="Gestión de Listas de Precios"
      description="Administración de listas de precios y tarifas"
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
                  Información de la Lista de Precios
                </CardTitle>
                <CardDescription>
                  Complete la información de la lista de precios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="codigo">Código de la Lista</Label>
                        <Input
                          id="codigo"
                          value={listaPrecios.codigo}
                          onChange={(e) => handleInputChange('codigo', e.target.value)}
                          placeholder="LP001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nombre">Nombre de la Lista</Label>
                        <Input
                          id="nombre"
                          value={listaPrecios.nombre}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          placeholder="Nombre de la lista"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo">Tipo de Lista</Label>
                        <Select value={listaPrecios.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="especial">Especial</SelectItem>
                            <SelectItem value="convenio">Convenio</SelectItem>
                            <SelectItem value="descuento">Descuento</SelectItem>
                            <SelectItem value="recargo">Recargo</SelectItem>
                            <SelectItem value="promocional">Promocional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="categoria">Categoría</Label>
                        <Select value={listaPrecios.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="servicios">Servicios</SelectItem>
                            <SelectItem value="medicamentos">Medicamentos</SelectItem>
                            <SelectItem value="procedimientos">Procedimientos</SelectItem>
                            <SelectItem value="consultas">Consultas</SelectItem>
                            <SelectItem value="hospitalizacion">Hospitalización</SelectItem>
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
                        value={listaPrecios.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Descripción detallada de la lista de precios"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Información de precios */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Configuración de Precios</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="moneda">Moneda</Label>
                        <Select value={listaPrecios.moneda} onValueChange={(value) => handleInputChange('moneda', value)}>
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
                        <Label htmlFor="porcentajeDescuento">Porcentaje de Descuento (%)</Label>
                        <Input
                          id="porcentajeDescuento"
                          type="number"
                          value={listaPrecios.porcentajeDescuento}
                          onChange={(e) => handleInputChange('porcentajeDescuento', e.target.value)}
                          placeholder="0"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="porcentajeRecargo">Porcentaje de Recargo (%)</Label>
                        <Input
                          id="porcentajeRecargo"
                          type="number"
                          value={listaPrecios.porcentajeRecargo}
                          onChange={(e) => handleInputChange('porcentajeRecargo', e.target.value)}
                          placeholder="0"
                          min="0"
                          max="100"
                        />
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
                          value={listaPrecios.fechaInicio}
                          onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fechaFin">Fecha de Fin</Label>
                        <Input
                          id="fechaFin"
                          type="date"
                          value={listaPrecios.fechaFin}
                          onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="vigente"
                        checked={listaPrecios.vigente}
                        onCheckedChange={(checked) => handleInputChange('vigente', checked)}
                      />
                      <Label htmlFor="vigente">Lista Vigente</Label>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de aplicación */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Aplicación de la Lista</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="aplicaPacientes"
                          checked={listaPrecios.aplicaPacientes}
                          onCheckedChange={(checked) => handleInputChange('aplicaPacientes', checked)}
                        />
                        <Label htmlFor="aplicaPacientes">Aplica a Pacientes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="aplicaEntidades"
                          checked={listaPrecios.aplicaEntidades}
                          onCheckedChange={(checked) => handleInputChange('aplicaEntidades', checked)}
                        />
                        <Label htmlFor="aplicaEntidades">Aplica a Entidades</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="aplicaServicios"
                          checked={listaPrecios.aplicaServicios}
                          onCheckedChange={(checked) => handleInputChange('aplicaServicios', checked)}
                        />
                        <Label htmlFor="aplicaServicios">Aplica a Servicios</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="aplicaMedicamentos"
                          checked={listaPrecios.aplicaMedicamentos}
                          onCheckedChange={(checked) => handleInputChange('aplicaMedicamentos', checked)}
                        />
                        <Label htmlFor="aplicaMedicamentos">Aplica a Medicamentos</Label>
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
                        value={listaPrecios.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        placeholder="Observaciones adicionales sobre la lista de precios"
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
                        checked={listaPrecios.activo}
                        onCheckedChange={(checked) => handleInputChange('activo', checked)}
                      />
                      <Label htmlFor="activo">Lista Activa</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                      <Button type="submit">
                        <Plus className="w-4 h-4 mr-2" />
                        Guardar Lista
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ModuleCard>
        </div>

        {/* Lista de precios */}
        <div className="lg:col-span-1">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Listas de Precios
                </CardTitle>
                <CardDescription>
                  Lista de precios configuradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {listasPrecios.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{item.codigo}</h4>
                        {getEstadoBadge(item.estado)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.nombre}</p>
                      <p className="text-xs text-gray-500 mb-2">{item.tipo}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Moneda: {item.moneda}</span>
                        <span className="font-medium">{item.fechaInicio} - {item.fechaFin}</span>
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
