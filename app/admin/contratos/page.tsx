'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { FileText, Building2, Plus, Trash2, Eye } from 'lucide-react';
import {
  createPartnerContract,
  updatePartnerContract,
  getPartnerContract,
  listPartnerContracts,
} from '@/lib/actions/entity-contracts';
import type {
  PartnerContractFormData,
  ContractOptionKey,
  BillingGroupRow,
  ServiceCenterShare,
} from '@/lib/entity-contracts-types';

const OPTION_LABELS: { key: ContractOptionKey; label: string }[] = [
  { key: 'activo', label: 'Activo' },
  { key: 'topeSoat', label: 'Tope SOAT' },
  { key: 'cobrarCuotaModeradora', label: 'Cobrar cuota moderadora' },
  { key: 'cobrarCopagos', label: 'Cobrar copagos' },
  { key: 'entregaMedicamentosInventario', label: 'Entrega medicamentos por inventario' },
  { key: 'particulares', label: 'Particulares' },
  { key: 'morbilidad', label: 'Morbilidad' },
  { key: 'pym', label: 'PyM' },
  { key: 'alertasPym', label: 'Alertas PyM' },
  { key: 'cronicos', label: 'Cronicos' },
  { key: 'circular202', label: '202' },
  { key: 'consultas', label: 'Consultas' },
  { key: 'procedimientos', label: 'Procedimientos' },
  { key: 'observacionUrgencias', label: 'Observacion/Urgencias' },
  { key: 'hospitalizacion', label: 'Hospitalización' },
  { key: 'medicamentos', label: 'Medicamentos' },
  { key: 'materiales', label: 'Materiales' },
  { key: 'recienNacidos', label: 'Recien nacidos' },
  { key: 'otrosConceptos', label: 'Otros Conceptos' },
  { key: 'sinContratacion', label: 'Sin contratación' },
  {
    key: 'pagoIndividualPaquete',
    label:
      'Pago individual por caso / Conjunto integral de atenciones / Paquete / Canasta',
  },
  {
    key: 'facturarMedicamentosHc',
    label: 'Facturar Medicamentos Ordenados en Historia Clínica',
  },
  { key: 'listadoContratosDestino', label: 'Listado contratos destino' },
  { key: 'generarAdmisionesTriage45', label: 'Generar Admisiones Triage 4 y 5' },
  { key: 'listadoContratosVigentes', label: 'Listado contratos vigentes' },
  { key: 'tarifasDiscriminadas', label: 'Tarifas Discriminadas' },
];

const emptyForm = (): PartnerContractFormData => ({
  numeroContrato: '',
  entidades: '',
  descripcion: '',
  planBeneficios: '',
  cobertura: '',
  numeroPoliza: '',
  codigoCucon: '',
  fechaInicio: '',
  fechaFin: '',
  tipoContrato: '',
  niveles: '',
  sede: '',
  valorContrato: '',
  valorUpc: '',
  numeroConsultas: '',
  numeroUsuarios: '',
  tarifasSoat: '',
  tarifasIss: '',
  mediosPago: '',
  tarifasSoatDetalle: '',
  porcentajeValor: '',
  listaPreciosProcedimientos: '',
  listaPreciosMedsOtros: '',
  cuentaContableRadicada: '',
  cuentaContableSinRadicar: '',
  rubroPresupuesto: '',
  fuenteFinanciacion: '',
  resolucionDian: '',
  asuntoCorreoMinHacienda: '',
  chatbotMorbilidadPym: '',
  notasFinalesFactura: '',
  opciones: Object.fromEntries(
    OPTION_LABELS.map(({ key }) => [key, key === 'activo'])
  ) as Record<ContractOptionKey, boolean>,
  gruposFacturacion: [],
  centrosServicios: [],
});

type ContractRow = {
  id: string;
  numero: string;
  entidad: string;
  tipo: string;
  tipoContrato: string;
  planBeneficios?: string;
  fechaInicio: string;
  fechaFin: string;
  valor: string;
  moneda: string;
  estado: string;
  activo: boolean;
};

function RequiredMark() {
  return <span className="text-red-600"> *</span>;
}

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <Label htmlFor={htmlFor}>
      {children}
      {required ? <RequiredMark /> : null}
    </Label>
  );
}

export default function ContratosPage() {
  const [contrato, setContrato] = useState<PartnerContractFormData>(emptyForm);
  const [contratos, setContratos] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);

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

  const resetForm = () => {
    setContrato(emptyForm());
    setEditingId(null);
  };

  const openContract = async (id: string) => {
    setOpening(true);
    try {
      const res = await getPartnerContract(id);
      if (!res.success) {
        toast.error(res.error || 'No se pudo abrir el contrato');
        return;
      }
      setContrato(res.data.form);
      setEditingId(res.data.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      toast.error('Error al abrir el contrato');
    } finally {
      setOpening(false);
    }
  };

  const setField = <K extends keyof PartnerContractFormData>(
    field: K,
    value: PartnerContractFormData[K]
  ) => {
    setContrato((prev) => ({ ...prev, [field]: value }));
  };

  const toggleOpcion = (key: ContractOptionKey, checked: boolean) => {
    setContrato((prev) => ({
      ...prev,
      opciones: { ...prev.opciones, [key]: checked },
    }));
  };

  const addBillingGroup = () => {
    const row: BillingGroupRow = {
      id: crypto.randomUUID(),
      grupo: '',
      porcentaje: '',
    };
    setContrato((prev) => ({
      ...prev,
      gruposFacturacion: [...prev.gruposFacturacion, row],
    }));
  };

  const updateBillingGroup = (
    id: string,
    field: keyof Omit<BillingGroupRow, 'id'>,
    value: string
  ) => {
    setContrato((prev) => ({
      ...prev,
      gruposFacturacion: prev.gruposFacturacion.map((g) =>
        g.id === id ? { ...g, [field]: value } : g
      ),
    }));
  };

  const removeBillingGroup = (id: string) => {
    setContrato((prev) => ({
      ...prev,
      gruposFacturacion: prev.gruposFacturacion.filter((g) => g.id !== id),
    }));
  };

  const addServiceCenter = () => {
    const row: ServiceCenterShare = {
      id: crypto.randomUUID(),
      centro: '',
      porcentaje: '',
    };
    setContrato((prev) => ({
      ...prev,
      centrosServicios: [...prev.centrosServicios, row],
    }));
  };

  const updateServiceCenter = (
    id: string,
    field: keyof Omit<ServiceCenterShare, 'id'>,
    value: string
  ) => {
    setContrato((prev) => ({
      ...prev,
      centrosServicios: prev.centrosServicios.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }));
  };

  const removeServiceCenter = (id: string) => {
    setContrato((prev) => ({
      ...prev,
      centrosServicios: prev.centrosServicios.filter((c) => c.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contrato.numeroContrato.trim()) {
      toast.error('Complete el código de contrato');
      return;
    }
    if (!contrato.entidades.trim()) {
      toast.error('Complete las entidades');
      return;
    }
    if (!contrato.descripcion.trim()) {
      toast.error('Complete la descripción del contrato');
      return;
    }
    if (!contrato.planBeneficios) {
      toast.error('Seleccione el plan de beneficios');
      return;
    }
    if (!contrato.fechaInicio || !contrato.fechaFin) {
      toast.error('Complete fecha inicio y fecha fin');
      return;
    }
    if (!contrato.tipoContrato) {
      toast.error('Seleccione el tipo de contrato');
      return;
    }
    if (!contrato.valorContrato.trim()) {
      toast.error('Complete el valor del contrato');
      return;
    }
    if (!contrato.listaPreciosMedsOtros.trim()) {
      toast.error(
        'Complete la lista de precios procedimientos medicamentos y otros'
      );
      return;
    }

    setSaving(true);
    try {
      const result = editingId
        ? await updatePartnerContract(editingId, contrato)
        : await createPartnerContract(contrato);
      if (!result.success) {
        toast.error(result.error || 'No se pudo guardar el contrato');
        return;
      }
      toast.success(
        editingId
          ? `Contrato ${result.data?.numero} actualizado`
          : `Contrato ${result.data?.numero} guardado en la base de datos`
      );
      if (!editingId) {
        resetForm();
      }
      await loadContratos();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error al guardar el contrato';
      toast.error(message);
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
                  {editingId
                    ? `Contrato ${contrato.numeroContrato || ''}`
                    : 'Contratos con entidades'}
                </CardTitle>
                <CardDescription>
                  {editingId
                    ? 'Información guardada del contrato. Puede modificarla y actualizar.'
                    : 'Complete los datos del contrato. Los campos con * son obligatorios.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Tabs defaultValue="contrato" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-auto">
                      <TabsTrigger value="contrato">Contrato</TabsTrigger>
                      <TabsTrigger value="centros">
                        Distribución en % por Centros de Servicios
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="contrato" className="space-y-6 mt-6">
                      <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Datos Básicos del Contrato
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FieldLabel htmlFor="numeroContrato" required>
                              Código contrato
                            </FieldLabel>
                            <Input
                              id="numeroContrato"
                              value={contrato.numeroContrato}
                              onChange={(e) =>
                                setField('numeroContrato', e.target.value)
                              }
                              placeholder="CTR-2026-001"
                              required
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="entidades" required>
                              Entidades
                            </FieldLabel>
                            <Input
                              id="entidades"
                              value={contrato.entidades}
                              onChange={(e) => setField('entidades', e.target.value)}
                              placeholder="EPS, IPS u otras entidades"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <FieldLabel htmlFor="descripcion" required>
                              Descripción del contrato
                            </FieldLabel>
                            <Textarea
                              id="descripcion"
                              value={contrato.descripcion}
                              onChange={(e) =>
                                setField('descripcion', e.target.value)
                              }
                              rows={2}
                              required
                            />
                          </div>
                          <div>
                            <FieldLabel required>Plan de beneficios</FieldLabel>
                            <Select
                              value={contrato.planBeneficios || undefined}
                              onValueChange={(value) =>
                                setField('planBeneficios', value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar plan" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PBS">PBS</SelectItem>
                                <SelectItem value="POS">POS</SelectItem>
                                <SelectItem value="complementario">
                                  Complementario
                                </SelectItem>
                                <SelectItem value="particular">Particular</SelectItem>
                                <SelectItem value="SOAT">SOAT</SelectItem>
                                <SelectItem value="ARL">ARL</SelectItem>
                                <SelectItem value="prepago">
                                  Medicina prepagada
                                </SelectItem>
                                <SelectItem value="otro">Otro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <FieldLabel htmlFor="cobertura">Cobertura</FieldLabel>
                            <Input
                              id="cobertura"
                              value={contrato.cobertura}
                              onChange={(e) => setField('cobertura', e.target.value)}
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="numeroPoliza">Número Póliza</FieldLabel>
                            <Input
                              id="numeroPoliza"
                              value={contrato.numeroPoliza}
                              onChange={(e) =>
                                setField('numeroPoliza', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="codigoCucon">Código CUCON</FieldLabel>
                            <Input
                              id="codigoCucon"
                              value={contrato.codigoCucon}
                              onChange={(e) =>
                                setField('codigoCucon', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="fechaInicio" required>
                              Fecha inicio contrato
                            </FieldLabel>
                            <Input
                              id="fechaInicio"
                              type="date"
                              value={contrato.fechaInicio}
                              onChange={(e) =>
                                setField('fechaInicio', e.target.value)
                              }
                              required
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="fechaFin" required>
                              Fecha fin contrato
                            </FieldLabel>
                            <Input
                              id="fechaFin"
                              type="date"
                              value={contrato.fechaFin}
                              onChange={(e) => setField('fechaFin', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <FieldLabel required>Tipo de contrato</FieldLabel>
                            <Select
                              value={contrato.tipoContrato || undefined}
                              onValueChange={(value) =>
                                setField('tipoContrato', value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="evento">Evento</SelectItem>
                                <SelectItem value="capitacion">Capitación</SelectItem>
                                <SelectItem value="paquete">
                                  Paquete / Canasta
                                </SelectItem>
                                <SelectItem value="pgp">PGP</SelectItem>
                                <SelectItem value="subsidiado">Subsidiado</SelectItem>
                                <SelectItem value="contributivo">
                                  Contributivo
                                </SelectItem>
                                <SelectItem value="particular">Particular</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <FieldLabel>Niveles</FieldLabel>
                            <Select
                              value={contrato.niveles || undefined}
                              onValueChange={(value) => setField('niveles', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar nivel" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="I">I</SelectItem>
                                <SelectItem value="II">II</SelectItem>
                                <SelectItem value="III">III</SelectItem>
                                <SelectItem value="IV">IV</SelectItem>
                                <SelectItem value="I-II">I - II</SelectItem>
                                <SelectItem value="I-III">I - III</SelectItem>
                                <SelectItem value="todos">Todos</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <FieldLabel htmlFor="sede">Sede</FieldLabel>
                            <Input
                              id="sede"
                              value={contrato.sede}
                              onChange={(e) => setField('sede', e.target.value)}
                            />
                          </div>
                        </div>
                      </section>

                      <Separator />

                      <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Valores y Tarifas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FieldLabel htmlFor="valorContrato" required>
                              Valor contrato
                            </FieldLabel>
                            <Input
                              id="valorContrato"
                              value={contrato.valorContrato}
                              onChange={(e) =>
                                setField('valorContrato', e.target.value)
                              }
                              placeholder="0"
                              required
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="valorUpc">Valor UPC</FieldLabel>
                            <Input
                              id="valorUpc"
                              value={contrato.valorUpc}
                              onChange={(e) => setField('valorUpc', e.target.value)}
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="numeroConsultas">
                              Número de consultas
                            </FieldLabel>
                            <Input
                              id="numeroConsultas"
                              type="number"
                              value={contrato.numeroConsultas}
                              onChange={(e) =>
                                setField('numeroConsultas', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="numeroUsuarios">
                              Número de usuarios
                            </FieldLabel>
                            <Input
                              id="numeroUsuarios"
                              type="number"
                              value={contrato.numeroUsuarios}
                              onChange={(e) =>
                                setField('numeroUsuarios', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <FieldLabel>Tarifas SOAT</FieldLabel>
                            <Select
                              value={contrato.tarifasSoat || undefined}
                              onValueChange={(value) =>
                                setField('tarifasSoat', value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar tarifa SOAT" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="soat-vigente">
                                  SOAT vigente
                                </SelectItem>
                                <SelectItem value="soat-2025">SOAT 2025</SelectItem>
                                <SelectItem value="soat-2026">SOAT 2026</SelectItem>
                                <SelectItem value="no-aplica">No aplica</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <FieldLabel>Tarifas ISS</FieldLabel>
                            <Select
                              value={contrato.tarifasIss || undefined}
                              onValueChange={(value) =>
                                setField('tarifasIss', value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar tarifa ISS" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="iss-2001">ISS 2001</SelectItem>
                                <SelectItem value="iss-2004">ISS 2004</SelectItem>
                                <SelectItem value="no-aplica">No aplica</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <FieldLabel htmlFor="mediosPago">Medios de pago</FieldLabel>
                            <Input
                              id="mediosPago"
                              value={contrato.mediosPago}
                              onChange={(e) =>
                                setField('mediosPago', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="tarifasSoatDetalle">
                              Tarifas Soat
                            </FieldLabel>
                            <Input
                              id="tarifasSoatDetalle"
                              value={contrato.tarifasSoatDetalle}
                              onChange={(e) =>
                                setField('tarifasSoatDetalle', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="porcentajeValor">
                              Porcentaje del valor
                            </FieldLabel>
                            <Input
                              id="porcentajeValor"
                              type="number"
                              value={contrato.porcentajeValor}
                              onChange={(e) =>
                                setField('porcentajeValor', e.target.value)
                              }
                              placeholder="%"
                            />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-3">
                            Listas de precios
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <FieldLabel htmlFor="listaPreciosProcedimientos">
                                lista de precios procedimientos
                              </FieldLabel>
                              <Input
                                id="listaPreciosProcedimientos"
                                value={contrato.listaPreciosProcedimientos}
                                onChange={(e) =>
                                  setField(
                                    'listaPreciosProcedimientos',
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <FieldLabel htmlFor="listaPreciosMedsOtros" required>
                                Lista de precios procedimientos medicamentos y otros
                              </FieldLabel>
                              <Input
                                id="listaPreciosMedsOtros"
                                value={contrato.listaPreciosMedsOtros}
                                onChange={(e) =>
                                  setField('listaPreciosMedsOtros', e.target.value)
                                }
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      <Separator />

                      <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Configuración Contable
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FieldLabel htmlFor="cuentaContableRadicada">
                              Cuenta contable radicada
                            </FieldLabel>
                            <Input
                              id="cuentaContableRadicada"
                              value={contrato.cuentaContableRadicada}
                              onChange={(e) =>
                                setField('cuentaContableRadicada', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="cuentaContableSinRadicar">
                              Cuenta contable sin radicar
                            </FieldLabel>
                            <Input
                              id="cuentaContableSinRadicar"
                              value={contrato.cuentaContableSinRadicar}
                              onChange={(e) =>
                                setField('cuentaContableSinRadicar', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="rubroPresupuesto">
                              Rubro de presupuesto
                            </FieldLabel>
                            <Input
                              id="rubroPresupuesto"
                              value={contrato.rubroPresupuesto}
                              onChange={(e) =>
                                setField('rubroPresupuesto', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="fuenteFinanciacion">
                              Fuente financiación
                            </FieldLabel>
                            <Input
                              id="fuenteFinanciacion"
                              value={contrato.fuenteFinanciacion}
                              onChange={(e) =>
                                setField('fuenteFinanciacion', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </section>

                      <Separator />

                      <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Información Adicional
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FieldLabel htmlFor="resolucionDian">
                              Resolución Dian
                            </FieldLabel>
                            <Input
                              id="resolucionDian"
                              value={contrato.resolucionDian}
                              onChange={(e) =>
                                setField('resolucionDian', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <FieldLabel htmlFor="asuntoCorreoMinHacienda">
                              Asunto correo ministerio de hacienda
                            </FieldLabel>
                            <Input
                              id="asuntoCorreoMinHacienda"
                              value={contrato.asuntoCorreoMinHacienda}
                              onChange={(e) =>
                                setField('asuntoCorreoMinHacienda', e.target.value)
                              }
                            />
                          </div>
                          <div className="md:col-span-2">
                            <FieldLabel htmlFor="chatbotMorbilidadPym">
                              Comportamiento morbilidad pym chatbot
                            </FieldLabel>
                            <Textarea
                              id="chatbotMorbilidadPym"
                              value={contrato.chatbotMorbilidadPym}
                              onChange={(e) =>
                                setField('chatbotMorbilidadPym', e.target.value)
                              }
                              rows={2}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <FieldLabel htmlFor="notasFinalesFactura">
                              Notas finales (impresión factura)
                            </FieldLabel>
                            <Textarea
                              id="notasFinalesFactura"
                              value={contrato.notasFinalesFactura}
                              onChange={(e) =>
                                setField('notasFinalesFactura', e.target.value)
                              }
                              rows={2}
                            />
                          </div>
                        </div>
                      </section>

                      <Separator />

                      <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Características y Opciones
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {OPTION_LABELS.map(({ key, label }) => (
                            <label
                              key={key}
                              className="flex items-start gap-2 text-sm text-gray-800"
                            >
                              <Checkbox
                                id={`opt-${key}`}
                                checked={contrato.opciones[key]}
                                onCheckedChange={(checked) =>
                                  toggleOpcion(key, checked === true)
                                }
                                className="mt-0.5"
                              />
                              <span>{label}</span>
                            </label>
                          ))}
                        </div>
                      </section>

                      <Separator />

                      <section className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Grupos de facturación
                          </h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addBillingGroup}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Grupo de facturación
                          </Button>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16">No.</TableHead>
                              <TableHead>Grupo</TableHead>
                              <TableHead className="w-36">Porcentaje</TableHead>
                              <TableHead className="w-24">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {contrato.gruposFacturacion.length === 0 ? (
                              <TableRow>
                                <TableCell
                                  colSpan={4}
                                  className="text-center text-slate-500 py-6"
                                >
                                  No hay datos disponibles.
                                </TableCell>
                              </TableRow>
                            ) : (
                              contrato.gruposFacturacion.map((row, index) => (
                                <TableRow key={row.id}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>
                                    <Input
                                      value={row.grupo}
                                      onChange={(e) =>
                                        updateBillingGroup(
                                          row.id,
                                          'grupo',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={row.porcentaje}
                                      onChange={(e) =>
                                        updateBillingGroup(
                                          row.id,
                                          'porcentaje',
                                          e.target.value
                                        )
                                      }
                                      placeholder="%"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeBillingGroup(row.id)}
                                      aria-label="Eliminar grupo"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </section>
                    </TabsContent>

                    <TabsContent value="centros" className="space-y-4 mt-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Distribución en % por Centros de Servicios
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addServiceCenter}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar centro
                        </Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">No.</TableHead>
                            <TableHead>Centro de servicios</TableHead>
                            <TableHead className="w-36">Porcentaje</TableHead>
                            <TableHead className="w-24">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contrato.centrosServicios.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="text-center text-slate-500 py-6"
                              >
                                No hay datos disponibles.
                              </TableCell>
                            </TableRow>
                          ) : (
                            contrato.centrosServicios.map((row, index) => (
                              <TableRow key={row.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  <Input
                                    value={row.centro}
                                    onChange={(e) =>
                                      updateServiceCenter(
                                        row.id,
                                        'centro',
                                        e.target.value
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    value={row.porcentaje}
                                    onChange={(e) =>
                                      updateServiceCenter(
                                        row.id,
                                        'porcentaje',
                                        e.target.value
                                      )
                                    }
                                    placeholder="%"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeServiceCenter(row.id)}
                                    aria-label="Eliminar centro"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={saving || opening}
                    >
                      {editingId ? 'Nuevo' : 'Limpiar'}
                    </Button>
                    <Button type="submit" disabled={saving || opening}>
                      <Plus className="w-4 h-4 mr-2" />
                      {saving
                        ? 'Guardando…'
                        : editingId
                          ? 'Actualizar Contrato'
                          : 'Guardar Contrato'}
                    </Button>
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
                  Pulse un contrato para abrir y ver su información
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
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => openContract(item.id)}
                        disabled={opening || saving}
                        className={`w-full text-left p-4 border rounded-lg hover:bg-gray-50 ${
                          editingId === item.id
                            ? 'border-blue-500 ring-1 ring-blue-200 bg-blue-50/40'
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            {item.numero}
                          </h4>
                          {getEstadoBadge(item.estado)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{item.entidad}</p>
                        <p className="text-xs text-gray-500 mb-1">
                          {[item.tipoContrato, item.planBeneficios]
                            .filter(Boolean)
                            .join(' · ') || item.tipo}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {item.fechaInicio || '—'} - {item.fechaFin || '—'}
                          </span>
                          <span className="font-medium">
                            {item.valor ? `${item.moneda} ${item.valor}` : '—'}
                          </span>
                        </div>
                      </button>
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
