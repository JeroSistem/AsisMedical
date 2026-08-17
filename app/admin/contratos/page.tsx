'use client';

import { useEffect, useState } from 'react';
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
import { toast } from 'sonner';
import {
  FileText,
  Building2,
  Plus,
} from 'lucide-react';
import {
  createPartnerContract,
  listPartnerContracts,
} from '@/lib/actions/entity-contracts';

const emptyForm = () => ({
  numeroContrato: '',
  entidad: '',
  tipoEntidad: '',
  representanteLegal: '',
  nit: '',
  direccion: '',
  telefono: '',
  email: '',
  fechaInicio: '',
  fechaFin: '',
  valorContrato: '',
  moneda: 'COP',
  tipoContrato: '',
  serviciosIncluidos: '',
  exclusiones: '',
  coberturaGeografica: '',
  poblacionObjetivo: '',
  plazoPago: '',
  formaPago: '',
  garantias: '',
  penalizaciones: '',
  documentosRequeridos: '',
  observaciones: '',
  estado: 'activo',
  activo: true,
});

type ContractRow = {
  id: string;
  numero: string;
  entidad: string;
  tipo: string;
  tipoContrato: string;
  fechaInicio: string;
  fechaFin: string;
  valor: string;
  moneda: string;
  estado: string;
  activo: boolean;
};

export default function ContratosPage() {
  const [contrato, setContrato] = useState(emptyForm());
  const [contratos, setContratos] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadContratos = async () => {
    setLoading(true);
    try {
      const res = await listPartnerContracts();
      if (!res.success) {
        toast.error(res.error || 'No se pudieron cargar los contratos');
        setContratos([]);
        return;
      }
      setContratos(res.data || []);
    } catch {
      toast.error('Error al cargar contratos');
      setContratos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContratos();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setContrato((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contrato.numeroContrato.trim() || !contrato.entidad.trim()) {
      toast.error('Complete número de contrato y entidad');
      return;
    }
    if (!contrato.tipoContrato) {
      toast.error('Seleccione tipo de contrato: Subsidiado o Contributivo');
      return;
    }

    setSaving(true);
    try {
      const result = await createPartnerContract(contrato);
      if (!result.success) {
        toast.error(result.error || 'No se pudo guardar el contrato');
        return;
      }
      toast.success(`Contrato ${result.data?.numero} guardado en la base de datos`);
      setContrato(emptyForm());
      await loadContratos();
    } catch {
      toast.error('Error al guardar el contrato');
    } finally {
      setSaving(false);
    }
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

  return (
    <ModulePageLayout
      title="Contratos con Entidades"
      description="Gestión de contratos y convenios (se guardan en la BD de su institución)"
      maxWidth="7xl"
      showBackButton={true}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="entidad">Entidad</Label>
                        <Input
                          id="entidad"
                          value={contrato.entidad}
                          onChange={(e) => handleInputChange('entidad', e.target.value)}
                          placeholder="Nombre de la entidad"
                          required
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
                          placeholder="Teléfono"
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
                      <div className="md:col-span-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input
                          id="direccion"
                          value={contrato.direccion}
                          onChange={(e) => handleInputChange('direccion', e.target.value)}
                          placeholder="Dirección"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Términos del Contrato</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                        <Input
                          id="fechaInicio"
                          type="date"
                          value={contrato.fechaInicio}
                          onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fechaFin">Fecha Fin</Label>
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
                          placeholder="500000000"
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
                        <Select
                          value={contrato.tipoContrato}
                          onValueChange={(value) => handleInputChange('tipoContrato', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="subsidiado">Subsidiado</SelectItem>
                            <SelectItem value="contributivo">Contributivo</SelectItem>
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
                      <div>
                        <Label htmlFor="formaPago">Forma de Pago</Label>
                        <Input
                          id="formaPago"
                          value={contrato.formaPago}
                          onChange={(e) => handleInputChange('formaPago', e.target.value)}
                          placeholder="Transferencia, cheque, etc."
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Cobertura</h3>
                    <div>
                      <Label htmlFor="serviciosIncluidos">Servicios Incluidos</Label>
                      <Textarea
                        id="serviciosIncluidos"
                        value={contrato.serviciosIncluidos}
                        onChange={(e) => handleInputChange('serviciosIncluidos', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="exclusiones">Exclusiones</Label>
                      <Textarea
                        id="exclusiones"
                        value={contrato.exclusiones}
                        onChange={(e) => handleInputChange('exclusiones', e.target.value)}
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
                        />
                      </div>
                      <div>
                        <Label htmlFor="poblacionObjetivo">Población Objetivo</Label>
                        <Input
                          id="poblacionObjetivo"
                          value={contrato.poblacionObjetivo}
                          onChange={(e) => handleInputChange('poblacionObjetivo', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Condiciones y Documentación</h3>
                    <div>
                      <Label htmlFor="garantias">Garantías</Label>
                      <Textarea
                        id="garantias"
                        value={contrato.garantias}
                        onChange={(e) => handleInputChange('garantias', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="penalizaciones">Penalizaciones</Label>
                      <Textarea
                        id="penalizaciones"
                        value={contrato.penalizaciones}
                        onChange={(e) => handleInputChange('penalizaciones', e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="documentosRequeridos">Documentos Requeridos</Label>
                      <Textarea
                        id="documentosRequeridos"
                        value={contrato.documentosRequeridos}
                        onChange={(e) => handleInputChange('documentosRequeridos', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="observaciones">Observaciones</Label>
                      <Textarea
                        id="observaciones"
                        value={contrato.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setContrato(emptyForm())}
                        disabled={saving}
                      >
                        Limpiar
                      </Button>
                      <Button type="submit" disabled={saving}>
                        <Plus className="w-4 h-4 mr-2" />
                        {saving ? 'Guardando…' : 'Guardar Contrato'}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ModuleCard>
        </div>

        <div className="lg:col-span-1">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Contratos registrados
                </CardTitle>
                <CardDescription>
                  Datos reales de la base de datos de su institución
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-gray-500">Cargando…</p>
                ) : contratos.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Aún no hay contratos. Guarde el primero con el formulario.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {contratos.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm">{item.numero}</h4>
                          {getEstadoBadge(item.estado)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{item.entidad}</p>
                        <p className="text-xs text-gray-500 mb-1">
                          {item.tipoContrato
                            ? item.tipoContrato.charAt(0).toUpperCase() +
                              item.tipoContrato.slice(1)
                            : item.tipo}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {item.fechaInicio || '—'} - {item.fechaFin || '—'}
                          </span>
                          <span className="font-medium">
                            {item.valor
                              ? `${item.moneda} ${item.valor}`
                              : '—'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </ModuleCard>
        </div>
      </div>
    </ModulePageLayout>
  );
}
