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
  Calendar,
  Hash,
  Stethoscope
} from 'lucide-react';

export default function CupsPropiosPage() {
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [cups, setCups] = useState({
    // Información básica
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    subcategoria: '',
    
    // Información de precios
    precio: '',
    moneda: 'COP',
    tipoPrecio: '',
    
    // Información médica
    especialidad: '',
    nivelAtencion: '',
    tipoServicio: '',
    requiereAutorizacion: false,
    
    // Información de facturación
    codigoFacturacion: '',
    codigoAlternativo: '',
    codigoInterno: '',
    
    // Información adicional
    observaciones: '',
    activo: true
  });

  // Estado para la lista de CUPS
  const [cupsList, setCupsList] = useState([
    {
      id: 1,
      codigo: 'CUP001',
      nombre: 'Consulta Médica General',
      categoria: 'Consultas',
      especialidad: 'Medicina General',
      precio: '$50,000',
      estado: 'activo'
    },
    {
      id: 2,
      codigo: 'CUP002',
      nombre: 'Consulta Especializada',
      categoria: 'Consultas',
      especialidad: 'Cardiología',
      precio: '$80,000',
      estado: 'activo'
    },
    {
      id: 3,
      codigo: 'CUP003',
      nombre: 'Procedimiento Quirúrgico Menor',
      categoria: 'Procedimientos',
      especialidad: 'Cirugía General',
      precio: '$150,000',
      estado: 'activo'
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setCups(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "CUPS guardado",
      description: "El CUPS se ha guardado exitosamente.",
    });
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'inactivo':
        return <Badge variant="destructive">Inactivo</Badge>;
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
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
      title="Gestión de CUPS Propios"
      description="Administración de códigos CUPS institucionales"
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
                  <FileText className="w-5 h-5 mr-2" />
                  Información del CUPS
                </CardTitle>
                <CardDescription>
                  Complete la información del código CUPS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="codigo">Código CUPS</Label>
                        <Input
                          id="codigo"
                          value={cups.codigo}
                          onChange={(e) => handleInputChange('codigo', e.target.value)}
                          placeholder="CUP001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nombre">Nombre del Servicio</Label>
                        <Input
                          id="nombre"
                          value={cups.nombre}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          placeholder="Nombre del servicio"
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoria">Categoría</Label>
                        <Select value={cups.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consultas">Consultas</SelectItem>
                            <SelectItem value="procedimientos">Procedimientos</SelectItem>
                            <SelectItem value="cirugias">Cirugías</SelectItem>
                            <SelectItem value="laboratorio">Laboratorio</SelectItem>
                            <SelectItem value="imagenes">Imágenes</SelectItem>
                            <SelectItem value="terapias">Terapias</SelectItem>
                            <SelectItem value="medicamentos">Medicamentos</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subcategoria">Subcategoría</Label>
                        <Input
                          id="subcategoria"
                          value={cups.subcategoria}
                          onChange={(e) => handleInputChange('subcategoria', e.target.value)}
                          placeholder="Subcategoría"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={cups.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Descripción detallada del servicio"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Información de precios */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información de Precios</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="precio">Precio</Label>
                        <Input
                          id="precio"
                          type="number"
                          value={cups.precio}
                          onChange={(e) => handleInputChange('precio', e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor="moneda">Moneda</Label>
                        <Select value={cups.moneda} onValueChange={(value) => handleInputChange('moneda', value)}>
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
                        <Select value={cups.tipoPrecio} onValueChange={(value) => handleInputChange('tipoPrecio', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fijo">Fijo</SelectItem>
                            <SelectItem value="variable">Variable</SelectItem>
                            <SelectItem value="por-hora">Por Hora</SelectItem>
                            <SelectItem value="por-sesion">Por Sesión</SelectItem>
                            <SelectItem value="por-dia">Por Día</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Información médica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Médica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="especialidad">Especialidad</Label>
                        <Select value={cups.especialidad} onValueChange={(value) => handleInputChange('especialidad', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar especialidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="medicina-general">Medicina General</SelectItem>
                            <SelectItem value="cardiologia">Cardiología</SelectItem>
                            <SelectItem value="neurologia">Neurología</SelectItem>
                            <SelectItem value="ortopedia">Ortopedia</SelectItem>
                            <SelectItem value="pediatria">Pediatría</SelectItem>
                            <SelectItem value="ginecologia">Ginecología</SelectItem>
                            <SelectItem value="cirugia-general">Cirugía General</SelectItem>
                            <SelectItem value="anestesiologia">Anestesiología</SelectItem>
                            <SelectItem value="radiologia">Radiología</SelectItem>
                            <SelectItem value="laboratorio">Laboratorio</SelectItem>
                            <SelectItem value="farmacia">Farmacia</SelectItem>
                            <SelectItem value="enfermeria">Enfermería</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="nivelAtencion">Nivel de Atención</Label>
                        <Select value={cups.nivelAtencion} onValueChange={(value) => handleInputChange('nivelAtencion', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primario">Primario</SelectItem>
                            <SelectItem value="secundario">Secundario</SelectItem>
                            <SelectItem value="terciario">Terciario</SelectItem>
                            <SelectItem value="especializado">Especializado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tipoServicio">Tipo de Servicio</Label>
                        <Select value={cups.tipoServicio} onValueChange={(value) => handleInputChange('tipoServicio', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ambulatorio">Ambulatorio</SelectItem>
                            <SelectItem value="hospitalario">Hospitalario</SelectItem>
                            <SelectItem value="urgencias">Urgencias</SelectItem>
                            <SelectItem value="domiciliario">Domiciliario</SelectItem>
                            <SelectItem value="preventivo">Preventivo</SelectItem>
                            <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                            <SelectItem value="terapeutico">Terapéutico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="requiereAutorizacion"
                          checked={cups.requiereAutorizacion}
                          onCheckedChange={(checked) => handleInputChange('requiereAutorizacion', checked)}
                        />
                        <Label htmlFor="requiereAutorizacion">Requiere Autorización</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de facturación */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información de Facturación</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="codigoFacturacion">Código de Facturación</Label>
                        <Input
                          id="codigoFacturacion"
                          value={cups.codigoFacturacion}
                          onChange={(e) => handleInputChange('codigoFacturacion', e.target.value)}
                          placeholder="Código para facturación"
                        />
                      </div>
                      <div>
                        <Label htmlFor="codigoAlternativo">Código Alternativo</Label>
                        <Input
                          id="codigoAlternativo"
                          value={cups.codigoAlternativo}
                          onChange={(e) => handleInputChange('codigoAlternativo', e.target.value)}
                          placeholder="Código alternativo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="codigoInterno">Código Interno</Label>
                        <Input
                          id="codigoInterno"
                          value={cups.codigoInterno}
                          onChange={(e) => handleInputChange('codigoInterno', e.target.value)}
                          placeholder="Código interno"
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
                        value={cups.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        placeholder="Observaciones adicionales sobre el CUPS"
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
                        checked={cups.activo}
                        onCheckedChange={(checked) => handleInputChange('activo', checked)}
                      />
                      <Label htmlFor="activo">CUPS Activo</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                      <Button type="submit">
                        <Plus className="w-4 h-4 mr-2" />
                        Guardar CUPS
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ModuleCard>
        </div>

        {/* Lista de CUPS */}
        <div className="lg:col-span-1">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  CUPS Propios
                </CardTitle>
                <CardDescription>
                  Lista de códigos CUPS configurados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cupsList.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{item.codigo}</h4>
                        {getEstadoBadge(item.estado)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.nombre}</p>
                      <p className="text-xs text-gray-500 mb-2">{item.categoria} - {item.especialidad}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium">{item.precio}</span>
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
