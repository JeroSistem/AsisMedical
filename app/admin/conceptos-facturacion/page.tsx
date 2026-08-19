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
  FileText, 
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
  CheckCircle,
  Calculator,
  Receipt
} from 'lucide-react';

export default function ConceptosFacturacionPage() {
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [concepto, setConcepto] = useState({
    // Información básica
    codigo: '',
    nombre: '',
    descripcion: '',
    tipo: '',
    categoria: '',
    
    // Información de precios
    precio: '',
    moneda: 'COP',
    tipoPrecio: '',
    aplicaIva: true,
    porcentajeIva: '19',
    
    // Información de facturación
    codigoFacturacion: '',
    codigoAlternativo: '',
    cuentaContable: '',
    centroCosto: '',
    
    // Información de aplicación
    aplicaDescuento: false,
    porcentajeDescuento: '',
    requiereAutorizacion: false,
    aplicaCopago: false,
    
    // Información adicional
    observaciones: '',
    activo: true
  });

  // Estado para la lista de conceptos
  const [conceptos, setConceptos] = useState([
    {
      id: 1,
      codigo: 'CF001',
      nombre: 'Consulta Médica General',
      tipo: 'Servicio',
      categoria: 'Consultas',
      precio: '$50,000',
      aplicaIva: true,
      estado: 'activo'
    },
    {
      id: 2,
      codigo: 'CF002',
      nombre: 'Examen de Laboratorio',
      tipo: 'Servicio',
      categoria: 'Laboratorio',
      precio: '$25,000',
      aplicaIva: true,
      estado: 'activo'
    },
    {
      id: 3,
      codigo: 'CF003',
      nombre: 'Medicamento Recetado',
      tipo: 'Producto',
      categoria: 'Medicamentos',
      precio: '$15,000',
      aplicaIva: true,
      estado: 'activo'
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setConcepto(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Concepto de facturación guardado",
      description: "El concepto de facturación se ha guardado exitosamente.",
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
      title="Gestión de Conceptos de Facturación"
      description="Administración de conceptos y tarifas de facturación"
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
                  <Receipt className="w-5 h-5 mr-2" />
                  Información del Concepto de Facturación
                </CardTitle>
                <CardDescription>
                  Complete la información del concepto de facturación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="codigo">Código del Concepto</Label>
                        <Input
                          id="codigo"
                          value={concepto.codigo}
                          onChange={(e) => handleInputChange('codigo', e.target.value)}
                          placeholder="CF001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nombre">Nombre del Concepto</Label>
                        <Input
                          id="nombre"
                          value={concepto.nombre}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          placeholder="Nombre del concepto"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo">Tipo de Concepto</Label>
                        <Select value={concepto.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="servicio">Servicio</SelectItem>
                            <SelectItem value="producto">Producto</SelectItem>
                            <SelectItem value="procedimiento">Procedimiento</SelectItem>
                            <SelectItem value="consulta">Consulta</SelectItem>
                            <SelectItem value="examen">Examen</SelectItem>
                            <SelectItem value="medicamento">Medicamento</SelectItem>
                            <SelectItem value="equipo">Equipo</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="categoria">Categoría</Label>
                        <Select value={concepto.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consultas">Consultas</SelectItem>
                            <SelectItem value="procedimientos">Procedimientos</SelectItem>
                            <SelectItem value="laboratorio">Laboratorio</SelectItem>
                            <SelectItem value="imagenes">Imágenes</SelectItem>
                            <SelectItem value="medicamentos">Medicamentos</SelectItem>
                            <SelectItem value="equipos">Equipos</SelectItem>
                            <SelectItem value="hospitalizacion">Hospitalización</SelectItem>
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
                        value={concepto.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Descripción detallada del concepto"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Información de precios */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información de Precios</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="precio">Precio</Label>
                        <Input
                          id="precio"
                          type="number"
                          value={concepto.precio}
                          onChange={(e) => handleInputChange('precio', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="moneda">Moneda</Label>
                        <Select value={concepto.moneda} onValueChange={(value) => handleInputChange('moneda', value)}>
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
                        <Label htmlFor="tipoPrecio">Tipo de Precio</Label>
                        <Select value={concepto.tipoPrecio} onValueChange={(value) => handleInputChange('tipoPrecio', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fijo">Fijo</SelectItem>
                            <SelectItem value="variable">Variable</SelectItem>
                            <SelectItem value="por-hora">Por Hora</SelectItem>
                            <SelectItem value="por-sesion">Por Sesión</SelectItem>
                            <SelectItem value="por-dia">Por Día</SelectItem>
                            <SelectItem value="por-unidad">Por Unidad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="porcentajeIva">Porcentaje de IVA (%)</Label>
                        <Input
                          id="porcentajeIva"
                          type="number"
                          value={concepto.porcentajeIva}
                          onChange={(e) => handleInputChange('porcentajeIva', e.target.value)}
                          placeholder="19"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="aplicaIva"
                        checked={concepto.aplicaIva}
                        onCheckedChange={(checked) => handleInputChange('aplicaIva', checked)}
                      />
                      <Label htmlFor="aplicaIva">Aplica IVA</Label>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de facturación */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información de Facturación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="codigoFacturacion">Código de Facturación</Label>
                        <Input
                          id="codigoFacturacion"
                          value={concepto.codigoFacturacion}
                          onChange={(e) => handleInputChange('codigoFacturacion', e.target.value)}
                          placeholder="Código para facturación"
                        />
                      </div>
                      <div>
                        <Label htmlFor="codigoAlternativo">Código Alternativo</Label>
                        <Input
                          id="codigoAlternativo"
                          value={concepto.codigoAlternativo}
                          onChange={(e) => handleInputChange('codigoAlternativo', e.target.value)}
                          placeholder="Código alternativo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cuentaContable">Cuenta Contable</Label>
                        <Input
                          id="cuentaContable"
                          value={concepto.cuentaContable}
                          onChange={(e) => handleInputChange('cuentaContable', e.target.value)}
                          placeholder="Cuenta contable"
                        />
                      </div>
                      <div>
                        <Label htmlFor="centroCosto">Centro de Costo</Label>
                        <Select value={concepto.centroCosto} onValueChange={(value) => handleInputChange('centroCosto', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar centro" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CC001">CC001 - Centro Médico</SelectItem>
                            <SelectItem value="CC002">CC002 - Centro Administrativo</SelectItem>
                            <SelectItem value="CC003">CC003 - Centro Laboratorio</SelectItem>
                            <SelectItem value="CC004">CC004 - Centro Imágenes</SelectItem>
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
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="aplicaDescuento"
                          checked={concepto.aplicaDescuento}
                          onCheckedChange={(checked) => handleInputChange('aplicaDescuento', checked)}
                        />
                        <Label htmlFor="aplicaDescuento">Aplica Descuento</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="requiereAutorizacion"
                          checked={concepto.requiereAutorizacion}
                          onCheckedChange={(checked) => handleInputChange('requiereAutorizacion', checked)}
                        />
                        <Label htmlFor="requiereAutorizacion">Requiere Autorización</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="aplicaCopago"
                          checked={concepto.aplicaCopago}
                          onCheckedChange={(checked) => handleInputChange('aplicaCopago', checked)}
                        />
                        <Label htmlFor="aplicaCopago">Aplica Copago</Label>
                      </div>
                      <div>
                        <Label htmlFor="porcentajeDescuento">Porcentaje de Descuento (%)</Label>
                        <Input
                          id="porcentajeDescuento"
                          type="number"
                          value={concepto.porcentajeDescuento}
                          onChange={(e) => handleInputChange('porcentajeDescuento', e.target.value)}
                          placeholder="0"
                          min="0"
                          max="100"
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
                        value={concepto.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        placeholder="Observaciones adicionales sobre el concepto"
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
                        checked={concepto.activo}
                        onCheckedChange={(checked) => handleInputChange('activo', checked)}
                      />
                      <Label htmlFor="activo">Concepto Activo</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                      <Button type="submit">
                        <Plus className="w-4 h-4 mr-2" />
                        Guardar Concepto
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ModuleCard>
        </div>

        {/* Lista de conceptos */}
        <div className="lg:col-span-1">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="w-5 h-5 mr-2" />
                  Conceptos de Facturación
                </CardTitle>
                <CardDescription>
                  Lista de conceptos configurados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conceptos.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{item.codigo}</h4>
                        {getEstadoBadge(item.estado)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.nombre}</p>
                      <p className="text-xs text-gray-500 mb-2">{item.tipo} - {item.categoria}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium">{item.precio}</span>
                        <span>{item.aplicaIva ? 'Con IVA' : 'Sin IVA'}</span>
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
