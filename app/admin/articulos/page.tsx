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
  Package, 
  ShoppingCart, 
  DollarSign, 
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
  CheckCircle
} from 'lucide-react';

export default function ArticulosPage() {
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [articulo, setArticulo] = useState({
    // Información básica
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    subcategoria: '',
    unidadMedida: '',
    
    // Información de proveedor
    proveedor: '',
    codigoProveedor: '',
    marca: '',
    modelo: '',
    
    // Información de inventario
    stockMinimo: '',
    stockMaximo: '',
    stockActual: '',
    ubicacion: '',
    estante: '',
    posicion: '',
    
    // Información de precios
    precioCompra: '',
    precioVenta: '',
    margenGanancia: '',
    moneda: 'COP',
    
    // Información adicional
    requiereRefrigeracion: false,
    requiereControlEspecial: false,
    fechaVencimiento: '',
    lote: '',
    observaciones: '',
    activo: true
  });

  // Estado para la lista de artículos
  const [articulos, setArticulos] = useState([
    {
      id: 1,
      codigo: 'ART001',
      nombre: 'Jeringa 10ml',
      categoria: 'Insumos Médicos',
      stockActual: 150,
      stockMinimo: 50,
      precioVenta: '$2,500',
      estado: 'disponible'
    },
    {
      id: 2,
      codigo: 'ART002',
      nombre: 'Guantes Látex M',
      categoria: 'Protección Personal',
      stockActual: 25,
      stockMinimo: 100,
      precioVenta: '$15,000',
      estado: 'bajo_stock'
    },
    {
      id: 3,
      codigo: 'ART003',
      nombre: 'Paracetamol 500mg',
      categoria: 'Medicamentos',
      stockActual: 0,
      stockMinimo: 200,
      precioVenta: '$1,200',
      estado: 'agotado'
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setArticulo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Artículo guardado",
      description: "El artículo se ha guardado exitosamente.",
    });
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'bajo_stock':
        return <Badge className="bg-yellow-100 text-yellow-800">Bajo Stock</Badge>;
      case 'agotado':
        return <Badge variant="destructive">Agotado</Badge>;
      case 'vencido':
        return <Badge className="bg-red-100 text-red-800">Vencido</Badge>;
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
      title="Gestión de Artículos"
      description="Administración de inventario y artículos del hospital"
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
                  <Package className="w-5 h-5 mr-2" />
                  Información del Artículo
                </CardTitle>
                <CardDescription>
                  Complete la información del artículo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="codigo">Código del Artículo</Label>
                        <Input
                          id="codigo"
                          value={articulo.codigo}
                          onChange={(e) => handleInputChange('codigo', e.target.value)}
                          placeholder="ART001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nombre">Nombre del Artículo</Label>
                        <Input
                          id="nombre"
                          value={articulo.nombre}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          placeholder="Nombre del artículo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoria">Categoría</Label>
                        <Select value={articulo.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="medicamentos">Medicamentos</SelectItem>
                            <SelectItem value="insumos-medicos">Insumos Médicos</SelectItem>
                            <SelectItem value="equipos-medicos">Equipos Médicos</SelectItem>
                            <SelectItem value="proteccion-personal">Protección Personal</SelectItem>
                            <SelectItem value="material-quirurgico">Material Quirúrgico</SelectItem>
                            <SelectItem value="laboratorio">Laboratorio</SelectItem>
                            <SelectItem value="limpieza">Limpieza</SelectItem>
                            <SelectItem value="oficina">Oficina</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subcategoria">Subcategoría</Label>
                        <Input
                          id="subcategoria"
                          value={articulo.subcategoria}
                          onChange={(e) => handleInputChange('subcategoria', e.target.value)}
                          placeholder="Subcategoría"
                        />
                      </div>
                      <div>
                        <Label htmlFor="unidadMedida">Unidad de Medida</Label>
                        <Select value={articulo.unidadMedida} onValueChange={(value) => handleInputChange('unidadMedida', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar unidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unidad">Unidad</SelectItem>
                            <SelectItem value="caja">Caja</SelectItem>
                            <SelectItem value="paquete">Paquete</SelectItem>
                            <SelectItem value="litro">Litro</SelectItem>
                            <SelectItem value="mililitro">Mililitro</SelectItem>
                            <SelectItem value="gramo">Gramo</SelectItem>
                            <SelectItem value="miligramo">Miligramo</SelectItem>
                            <SelectItem value="metro">Metro</SelectItem>
                            <SelectItem value="centimetro">Centímetro</SelectItem>
                            <SelectItem value="par">Par</SelectItem>
                            <SelectItem value="docena">Docena</SelectItem>
                            <SelectItem value="kilogramo">Kilogramo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={articulo.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Descripción detallada del artículo"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Información de proveedor */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información de Proveedor</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="proveedor">Proveedor</Label>
                        <Input
                          id="proveedor"
                          value={articulo.proveedor}
                          onChange={(e) => handleInputChange('proveedor', e.target.value)}
                          placeholder="Nombre del proveedor"
                        />
                      </div>
                      <div>
                        <Label htmlFor="codigoProveedor">Código del Proveedor</Label>
                        <Input
                          id="codigoProveedor"
                          value={articulo.codigoProveedor}
                          onChange={(e) => handleInputChange('codigoProveedor', e.target.value)}
                          placeholder="Código interno del proveedor"
                        />
                      </div>
                      <div>
                        <Label htmlFor="marca">Marca</Label>
                        <Input
                          id="marca"
                          value={articulo.marca}
                          onChange={(e) => handleInputChange('marca', e.target.value)}
                          placeholder="Marca del producto"
                        />
                      </div>
                      <div>
                        <Label htmlFor="modelo">Modelo</Label>
                        <Input
                          id="modelo"
                          value={articulo.modelo}
                          onChange={(e) => handleInputChange('modelo', e.target.value)}
                          placeholder="Modelo del producto"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de inventario */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Control de Inventario</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                        <Input
                          id="stockMinimo"
                          type="number"
                          value={articulo.stockMinimo}
                          onChange={(e) => handleInputChange('stockMinimo', e.target.value)}
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stockMaximo">Stock Máximo</Label>
                        <Input
                          id="stockMaximo"
                          type="number"
                          value={articulo.stockMaximo}
                          onChange={(e) => handleInputChange('stockMaximo', e.target.value)}
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="stockActual">Stock Actual</Label>
                        <Input
                          id="stockActual"
                          type="number"
                          value={articulo.stockActual}
                          onChange={(e) => handleInputChange('stockActual', e.target.value)}
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ubicacion">Ubicación</Label>
                        <Input
                          id="ubicacion"
                          value={articulo.ubicacion}
                          onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                          placeholder="Almacén, bodega, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="estante">Estante</Label>
                        <Input
                          id="estante"
                          value={articulo.estante}
                          onChange={(e) => handleInputChange('estante', e.target.value)}
                          placeholder="Número de estante"
                        />
                      </div>
                      <div>
                        <Label htmlFor="posicion">Posición</Label>
                        <Input
                          id="posicion"
                          value={articulo.posicion}
                          onChange={(e) => handleInputChange('posicion', e.target.value)}
                          placeholder="Posición en el estante"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de precios */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información de Precios</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="precioCompra">Precio de Compra</Label>
                        <Input
                          id="precioCompra"
                          type="number"
                          value={articulo.precioCompra}
                          onChange={(e) => handleInputChange('precioCompra', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="precioVenta">Precio de Venta</Label>
                        <Input
                          id="precioVenta"
                          type="number"
                          value={articulo.precioVenta}
                          onChange={(e) => handleInputChange('precioVenta', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="margenGanancia">Margen de Ganancia (%)</Label>
                        <Input
                          id="margenGanancia"
                          type="number"
                          value={articulo.margenGanancia}
                          onChange={(e) => handleInputChange('margenGanancia', e.target.value)}
                          placeholder="0"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="moneda">Moneda</Label>
                        <Select value={articulo.moneda} onValueChange={(value) => handleInputChange('moneda', value)}>
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

                  {/* Información adicional */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Adicional</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="requiereRefrigeracion"
                          checked={articulo.requiereRefrigeracion}
                          onCheckedChange={(checked) => handleInputChange('requiereRefrigeracion', checked)}
                        />
                        <Label htmlFor="requiereRefrigeracion">Requiere Refrigeración</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="requiereControlEspecial"
                          checked={articulo.requiereControlEspecial}
                          onCheckedChange={(checked) => handleInputChange('requiereControlEspecial', checked)}
                        />
                        <Label htmlFor="requiereControlEspecial">Control Especial</Label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
                        <Input
                          id="fechaVencimiento"
                          type="date"
                          value={articulo.fechaVencimiento}
                          onChange={(e) => handleInputChange('fechaVencimiento', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lote">Número de Lote</Label>
                        <Input
                          id="lote"
                          value={articulo.lote}
                          onChange={(e) => handleInputChange('lote', e.target.value)}
                          placeholder="Número de lote"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="observaciones">Observaciones</Label>
                      <Textarea
                        id="observaciones"
                        value={articulo.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        placeholder="Observaciones adicionales sobre el artículo"
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
                        checked={articulo.activo}
                        onCheckedChange={(checked) => handleInputChange('activo', checked)}
                      />
                      <Label htmlFor="activo">Artículo Activo</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                      <Button type="submit">
                        <Plus className="w-4 h-4 mr-2" />
                        Guardar Artículo
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ModuleCard>
        </div>

        {/* Lista de artículos */}
        <div className="lg:col-span-1">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Artículos
                </CardTitle>
                <CardDescription>
                  Lista de artículos en inventario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articulos.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{item.codigo}</h4>
                        {getEstadoBadge(item.estado)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.nombre}</p>
                      <p className="text-xs text-gray-500 mb-2">{item.categoria}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Stock: {item.stockActual}/{item.stockMinimo}</span>
                        <span className="font-medium">{item.precioVenta}</span>
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
