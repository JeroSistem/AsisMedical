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
  Calendar, 
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
  Building,
  Hash
} from 'lucide-react';

export default function ResolucionesDianPage() {
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [resolucion, setResolucion] = useState({
    // Información básica
    numeroResolucion: '',
    tipoResolucion: '',
    descripcion: '',
    entidad: '',
    
    // Información de fechas
    fechaExpedicion: '',
    fechaVigencia: '',
    fechaVencimiento: '',
    vigente: true,
    
    // Información de rangos
    rangoInicial: '',
    rangoFinal: '',
    consecutivoActual: '',
    prefijo: '',
    
    // Información de autorización
    autorizacion: '',
    responsable: '',
    telefono: '',
    email: '',
    
    // Información adicional
    observaciones: '',
    activo: true
  });

  // Estado para la lista de resoluciones
  const [resoluciones, setResoluciones] = useState([
    {
      id: 1,
      numeroResolucion: '18764000001',
      tipoResolucion: 'Facturación Electrónica',
      entidad: 'DIAN',
      fechaExpedicion: '2024-01-15',
      fechaVencimiento: '2024-12-31',
      rangoInicial: '1',
      rangoFinal: '1000',
      consecutivoActual: '150',
      estado: 'vigente'
    },
    {
      id: 2,
      numeroResolucion: '18764000002',
      tipoResolucion: 'Notas Crédito',
      entidad: 'DIAN',
      fechaExpedicion: '2024-01-15',
      fechaVencimiento: '2024-12-31',
      rangoInicial: '1',
      rangoFinal: '500',
      consecutivoActual: '25',
      estado: 'vigente'
    },
    {
      id: 3,
      numeroResolucion: '18764000003',
      tipoResolucion: 'Notas Débito',
      entidad: 'DIAN',
      fechaExpedicion: '2024-01-15',
      fechaVencimiento: '2024-12-31',
      rangoInicial: '1',
      rangoFinal: '500',
      consecutivoActual: '10',
      estado: 'vigente'
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setResolucion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Resolución guardada",
      description: "La resolución se ha guardado exitosamente.",
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
      title="Gestión de Resoluciones DIAN"
      description="Administración de resoluciones de facturación electrónica"
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
                  Información de la Resolución
                </CardTitle>
                <CardDescription>
                  Complete la información de la resolución DIAN
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="numeroResolucion">Número de Resolución</Label>
                        <Input
                          id="numeroResolucion"
                          value={resolucion.numeroResolucion}
                          onChange={(e) => handleInputChange('numeroResolucion', e.target.value)}
                          placeholder="18764000001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipoResolucion">Tipo de Resolución</Label>
                        <Select value={resolucion.tipoResolucion} onValueChange={(value) => handleInputChange('tipoResolucion', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="facturacion-electronica">Facturación Electrónica</SelectItem>
                            <SelectItem value="notas-credito">Notas Crédito</SelectItem>
                            <SelectItem value="notas-debito">Notas Débito</SelectItem>
                            <SelectItem value="documentos-soporte">Documentos de Soporte</SelectItem>
                            <SelectItem value="otros">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="entidad">Entidad</Label>
                        <Select value={resolucion.entidad} onValueChange={(value) => handleInputChange('entidad', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar entidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DIAN">DIAN</SelectItem>
                            <SelectItem value="SUPERINTENDENCIA">Superintendencia</SelectItem>
                            <SelectItem value="MINISTERIO">Ministerio</SelectItem>
                            <SelectItem value="OTROS">Otros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="prefijo">Prefijo</Label>
                        <Input
                          id="prefijo"
                          value={resolucion.prefijo}
                          onChange={(e) => handleInputChange('prefijo', e.target.value)}
                          placeholder="FE"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={resolucion.descripcion}
                        onChange={(e) => handleInputChange('descripcion', e.target.value)}
                        placeholder="Descripción detallada de la resolución"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Información de fechas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Período de Vigencia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="fechaExpedicion">Fecha de Expedición</Label>
                        <Input
                          id="fechaExpedicion"
                          type="date"
                          value={resolucion.fechaExpedicion}
                          onChange={(e) => handleInputChange('fechaExpedicion', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fechaVigencia">Fecha de Vigencia</Label>
                        <Input
                          id="fechaVigencia"
                          type="date"
                          value={resolucion.fechaVigencia}
                          onChange={(e) => handleInputChange('fechaVigencia', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
                        <Input
                          id="fechaVencimiento"
                          type="date"
                          value={resolucion.fechaVencimiento}
                          onChange={(e) => handleInputChange('fechaVencimiento', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="vigente"
                        checked={resolucion.vigente}
                        onCheckedChange={(checked) => handleInputChange('vigente', checked)}
                      />
                      <Label htmlFor="vigente">Resolución Vigente</Label>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de rangos */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Rangos de Numeración</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="rangoInicial">Rango Inicial</Label>
                        <Input
                          id="rangoInicial"
                          type="number"
                          value={resolucion.rangoInicial}
                          onChange={(e) => handleInputChange('rangoInicial', e.target.value)}
                          placeholder="1"
                          min="1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rangoFinal">Rango Final</Label>
                        <Input
                          id="rangoFinal"
                          type="number"
                          value={resolucion.rangoFinal}
                          onChange={(e) => handleInputChange('rangoFinal', e.target.value)}
                          placeholder="1000"
                          min="1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="consecutivoActual">Consecutivo Actual</Label>
                        <Input
                          id="consecutivoActual"
                          type="number"
                          value={resolucion.consecutivoActual}
                          onChange={(e) => handleInputChange('consecutivoActual', e.target.value)}
                          placeholder="1"
                          min="1"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Información de autorización */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información de Autorización</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="autorizacion">Número de Autorización</Label>
                        <Input
                          id="autorizacion"
                          value={resolucion.autorizacion}
                          onChange={(e) => handleInputChange('autorizacion', e.target.value)}
                          placeholder="Número de autorización"
                        />
                      </div>
                      <div>
                        <Label htmlFor="responsable">Responsable</Label>
                        <Input
                          id="responsable"
                          value={resolucion.responsable}
                          onChange={(e) => handleInputChange('responsable', e.target.value)}
                          placeholder="Nombre del responsable"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          value={resolucion.telefono}
                          onChange={(e) => handleInputChange('telefono', e.target.value)}
                          placeholder="Teléfono de contacto"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={resolucion.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Email de contacto"
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
                        value={resolucion.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        placeholder="Observaciones adicionales sobre la resolución"
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
                        checked={resolucion.activo}
                        onCheckedChange={(checked) => handleInputChange('activo', checked)}
                      />
                      <Label htmlFor="activo">Resolución Activa</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                      <Button type="submit">
                        <Plus className="w-4 h-4 mr-2" />
                        Guardar Resolución
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ModuleCard>
        </div>

        {/* Lista de resoluciones */}
        <div className="lg:col-span-1">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Resoluciones DIAN
                </CardTitle>
                <CardDescription>
                  Lista de resoluciones configuradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resoluciones.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{item.numeroResolucion}</h4>
                        {getEstadoBadge(item.estado)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.tipoResolucion}</p>
                      <p className="text-xs text-gray-500 mb-2">{item.entidad}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Rango: {item.rangoInicial}-{item.rangoFinal}</span>
                        <span className="font-medium">Actual: {item.consecutivoActual}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span>Vence: {item.fechaVencimiento}</span>
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
