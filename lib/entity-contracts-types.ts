export type BillingGroupRow = {
  id: string;
  grupo: string;
  porcentaje: string;
};

export type ServiceCenterShare = {
  id: string;
  centro: string;
  porcentaje: string;
};

export type ContractOptionKey =
  | 'activo'
  | 'topeSoat'
  | 'cobrarCuotaModeradora'
  | 'cobrarCopagos'
  | 'entregaMedicamentosInventario'
  | 'particulares'
  | 'morbilidad'
  | 'pym'
  | 'alertasPym'
  | 'cronicos'
  | 'circular202'
  | 'consultas'
  | 'procedimientos'
  | 'observacionUrgencias'
  | 'hospitalizacion'
  | 'medicamentos'
  | 'materiales'
  | 'recienNacidos'
  | 'otrosConceptos'
  | 'sinContratacion'
  | 'pagoIndividualPaquete'
  | 'facturarMedicamentosHc'
  | 'listadoContratosDestino'
  | 'generarAdmisionesTriage45'
  | 'listadoContratosVigentes'
  | 'tarifasDiscriminadas';

export const CONTRACT_OPTION_KEYS: ContractOptionKey[] = [
  'activo',
  'topeSoat',
  'cobrarCuotaModeradora',
  'cobrarCopagos',
  'entregaMedicamentosInventario',
  'particulares',
  'morbilidad',
  'pym',
  'alertasPym',
  'cronicos',
  'circular202',
  'consultas',
  'procedimientos',
  'observacionUrgencias',
  'hospitalizacion',
  'medicamentos',
  'materiales',
  'recienNacidos',
  'otrosConceptos',
  'sinContratacion',
  'pagoIndividualPaquete',
  'facturarMedicamentosHc',
  'listadoContratosDestino',
  'generarAdmisionesTriage45',
  'listadoContratosVigentes',
  'tarifasDiscriminadas',
];

export type PartnerContractFormData = {
  numeroContrato: string;
  entidades: string;
  descripcion: string;
  planBeneficios: string;
  cobertura: string;
  numeroPoliza: string;
  codigoCucon: string;
  fechaInicio: string;
  fechaFin: string;
  tipoContrato: string;
  niveles: string;
  sede: string;
  valorContrato: string;
  valorUpc: string;
  numeroConsultas: string;
  numeroUsuarios: string;
  tarifasSoat: string;
  tarifasIss: string;
  mediosPago: string;
  tarifasSoatDetalle: string;
  porcentajeValor: string;
  listaPreciosProcedimientos: string;
  listaPreciosMedsOtros: string;
  cuentaContableRadicada: string;
  cuentaContableSinRadicar: string;
  rubroPresupuesto: string;
  fuenteFinanciacion: string;
  resolucionDian: string;
  asuntoCorreoMinHacienda: string;
  chatbotMorbilidadPym: string;
  notasFinalesFactura: string;
  opciones: Record<ContractOptionKey, boolean>;
  gruposFacturacion: BillingGroupRow[];
  centrosServicios: ServiceCenterShare[];
};
