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
  Building2, 
  Calendar, 
  DollarSign, 
  Users, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';

export default function ContratosPage() {
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [contrato, setContrato] = useState({
    // Información básica
    numeroContrato: '',
    entidad: '',
    tipoEntidad: '',
    representanteLegal: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: '',
    
    // Términos del contrato
    fechaInicio: '',
    fechaFin: '',
    valorContrato: '',
    moneda: 'COP',
    tipoContrato: '',
    
    // Cobertura
    serviciosIncluidos: '',
    exclusiones: '',
    coberturaGeografica: '',
    poblacionObjetivo: '',
    
    // Condiciones
    plazoPago: '',
    formaPago: '',
    garantias: '',
    penalizaciones: '',
    
    // Documentación
    documentosRequeridos: '',
    observaciones: '',
    
    // Estado
    estado: 'activo',
    activo: true
  });

  // Estado para la lista de contratos
  const [contratos, setContratos] = useState([
    {
      id: 1,
      numero: 'CTR-2024-001',
      entidad: 'EPS Sura',
      tipo: 'EPS',
      fechaInicio: '2024-01-01',
      fechaFin: '2024-12-31',
      valor: '$500,000,000',
      estado: 'activo'
    },
    {
      id: 2,
      numero: 'CTR-2024-002',
      entidad: 'EPS Famisanar',
      tipo: 'EPS',
      fechaInicio: '2024-02-01',
      fechaFin: '2025-01-31',
      valor: '$300,000,000',
      estado: 'activo'
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setContrato(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Contrato guardado",
      description: "El contrato se ha guardado exitosamente.",
    });
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'inactivo':
        return <Badge variant="secondary">Inactivo</Badge>;
      case 'vencido':
        return <Badge variant="destructive">Vencido</Badge>;
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
      title="Contratos con Entidades"
      description="Gestión de contratos y convenios con entidades prestadoras de servicios"
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
                  Información del Contrato
                </CardTitle>
                <CardDescription>
                  Complete la información del contrato con la entidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información básica */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="numeroContrato">Número de Contrato</Label>
                        <Input
                          id="numeroContrato"
                          value={contrato.numeroContrato}
                          onChange={(e) => handleInputChange('numeroContrato', e.target.value)}
                          placeholder="CTR-2024-001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="entidad">Entidad</Label>
                        <Input
                          id="entidad"
                          value={contrato.entidad}
                          onChange={(e) => handleInputChange('entidad', e.target.value)}
                          placeholder="Nombre de la entidad"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipoEntidad">Tipo de Entidad</Label>
                        <Select value={contrato.tipoEntidad} onValueChange={(value) => handleInputChange('tipoEntidad', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eps">EPS</SelectItem>
                            <SelectItem value="ips">IPS</SelectItem>
                            <SelectItem value="cliente">Cliente Directo</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="representanteLegal">Representante Legal</Label>
                        <Input
                          id="representanteLegal"
                          value={contrato.representanteLegal}
                          onChange={(e) => handleInputChange('representanteLegal', e.target.value)}
                          placeholder="Nombre completo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nit">NIT</Label>
                        <Input
                          id="nit"
                          value={contrato.nit}
                          onChange={(e) => handleInputChange('nit', e.target.value)}
                          placeholder="Número de identificación tributaria"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          value={contrato.telefono}
                          onChange={(e) => handleInputChange('telefono', e.target.value)}
                          placeholder="Teléfono de contacto"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="direccion">Dirección</Label>
                      <Input
                        id="direccion"
                        value={contrato.direccion}
                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                        placeholder="Dirección completa"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contrato.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="correo@entidad.com"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Términos del contrato */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Términos del Contrato</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                        <Input
                          id="fechaInicio"
                          type="date"
                          value={contrato.fechaInicio}
                          onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fechaFin">Fecha de Fin</Label>
                        <Input
                          id="fechaFin"
                          type="date"
                          value={contrato.fechaFin}
                          onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="valorContrato">Valor del Contrato</Label>
                        <Input
                          id="valorContrato"
                          value={contrato.valorContrato}
                          onChange={(e) => handleInputChange('valorContrato', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="moneda">Moneda</Label>
                        <Select value={contrato.moneda} onValueChange={(value) => handleInputChange('moneda', value)}>
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
                        <Label htmlFor="tipoContrato">Tipo de Contrato</Label>
                        <Select value={contrato.tipoContrato} onValueChange={(value) => handleInputChange('tipoContrato', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prestacion-servicios">Prestación de Servicios</SelectItem>
                            <SelectItem value="compraventa">Compraventa</SelectItem>
                            <SelectItem value="arrendamiento">Arrendamiento</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="plazoPago">Plazo de Pago (días)</Label>
                        <Input
                          id="plazoPago"
                          type="number"
                          value={contrato.plazoPago}
                          onChange={(e) => handleInputChange('plazoPago', e.target.value)}
                          placeholder="30"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Cobertura */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Cobertura y Servicios</h3>
                    <div>
                      <Label htmlFor="serviciosIncluidos">Servicios Incluidos</Label>
                      <Textarea
                        id="serviciosIncluidos"
                        value={contrato.serviciosIncluidos}
                        onChange={(e) => handleInputChange('serviciosIncluidos', e.target.value)}
                        placeholder="Describa los servicios incluidos en el contrato"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="exclusiones">Exclusiones</Label>
                      <Textarea
                        id="exclusiones"
                        value={contrato.exclusiones}
                        onChange={(e) => handleInputChange('exclusiones', e.target.value)}
                        placeholder="Describa los servicios excluidos"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="coberturaGeografica">Cobertura Geográfica</Label>
                        <Input
                          id="coberturaGeografica"
                          value={contrato.coberturaGeografica}
                          onChange={(e) => handleInputChange('coberturaGeografica', e.target.value)}
                          placeholder="Ciudades, regiones, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="poblacionObjetivo">Población Objetivo</Label>
                        <Input
                          id="poblacionObjetivo"
                          value={contrato.poblacionObjetivo}
                          onChange={(e) => handleInputChange('poblacionObjetivo', e.target.value)}
                          placeholder="Número de beneficiarios"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Condiciones adicionales */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Condiciones Adicionales</h3>
                    <div>
                      <Label htmlFor="garantias">Garantías</Label>
                      <Textarea
                        id="garantias"
                        value={contrato.garantias}
                        onChange={(e) => handleInputChange('garantias', e.target.value)}
                        placeholder="Describa las garantías del contrato"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="penalizaciones">Penalizaciones</Label>
                      <Textarea
                        id="penalizaciones"
                        value={contrato.penalizaciones}
                        onChange={(e) => handleInputChange('penalizaciones', e.target.value)}
                        placeholder="Describa las penalizaciones por incumplimiento"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="observaciones">Observaciones</Label>
                      <Textarea
                        id="observaciones"
                        value={contrato.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        placeholder="Observaciones adicionales"
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
                        checked={contrato.activo}
                        onCheckedChange={(checked) => handleInputChange('activo', checked)}
                      />
                      <Label htmlFor="activo">Contrato Activo</Label>
                    </div>
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                      <Button type="submit">
                        <Plus className="w-4 h-4 mr-2" />
                        Guardar Contrato
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ModuleCard>
        </div>

        {/* Lista de contratos */}
        <div className="lg:col-span-1">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Contratos Activos
                </CardTitle>
                <CardDescription>
                  Lista de contratos vigentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contratos.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{item.numero}</h4>
                        {getEstadoBadge(item.estado)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{item.entidad}</p>
                      <p className="text-xs text-gray-500 mb-2">{item.tipo}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{item.fechaInicio} - {item.fechaFin}</span>
                        <span className="font-medium">{item.valor}</span>
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
