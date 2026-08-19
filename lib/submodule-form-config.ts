export type SubmoduleFormFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'select'
  | 'switch'
  | 'email';

export type SubmoduleFormField = {
  name: string;
  label: string;
  type: SubmoduleFormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  span?: 1 | 2;
  defaultValue?: string | boolean;
};

export type SubmoduleFormMode = 'crud' | 'report' | 'process';

export type SubmoduleFormConfig = {
  title: string;
  description?: string;
  mode: SubmoduleFormMode;
  fields: SubmoduleFormField[];
  submitLabel: string;
  resetLabel: string;
};

const ESTADO_OPTIONS = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
];

const FORMATO_OPTIONS = [
  { value: 'pdf', label: 'PDF' },
  { value: 'excel', label: 'Excel' },
  { value: 'csv', label: 'CSV' },
];

function humanizeSlug(segment: string): string {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function inferMode(href: string): SubmoduleFormMode {
  const path = href.toLowerCase();
  if (
    path.includes('/informe') ||
    path.includes('listado') ||
    path.includes('reporte') ||
    path.includes('hallazgos') ||
    path.includes('pendientes') ||
    path.includes('proyecciones') ||
    path.includes('vencidas')
  ) {
    return 'report';
  }
  if (
    path.includes('/proceso') ||
    path.includes('liquidacion') ||
    path.includes('asignar') ||
    path.includes('cobranza') ||
    path.includes('interface')
  ) {
    return 'process';
  }
  return 'crud';
}

function reportFields(href: string): SubmoduleFormField[] {
  const fields: SubmoduleFormField[] = [
    { name: 'fechaInicial', label: 'Fecha inicial', type: 'date', required: true },
    { name: 'fechaFinal', label: 'Fecha final', type: 'date', required: true },
    {
      name: 'centroServicios',
      label: 'Centro de servicios',
      type: 'text',
      placeholder: 'Todos los centros',
    },
    {
      name: 'formato',
      label: 'Formato de salida',
      type: 'select',
      options: FORMATO_OPTIONS,
      defaultValue: 'pdf',
    },
  ];

  if (href.includes('paciente') || href.includes('citas') || href.includes('historias')) {
    fields.splice(2, 0, {
      name: 'documentoPaciente',
      label: 'Documento del paciente',
      type: 'text',
      placeholder: 'Opcional',
    });
  }

  fields.push({
    name: 'observaciones',
    label: 'Observaciones',
    type: 'textarea',
    span: 2,
    placeholder: 'Criterios adicionales del informe',
  });

  return fields;
}

function processFields(href: string): SubmoduleFormField[] {
  const fields: SubmoduleFormField[] = [
    { name: 'periodo', label: 'Periodo', type: 'text', required: true, placeholder: 'Ej. 2026-08' },
    { name: 'fechaProceso', label: 'Fecha de proceso', type: 'date', required: true },
    { name: 'responsable', label: 'Responsable', type: 'text', placeholder: 'Usuario responsable' },
  ];

  if (href.includes('liquidacion') || href.includes('nomina')) {
    fields.push({
      name: 'tipoLiquidacion',
      label: 'Tipo de liquidación',
      type: 'select',
      options: [
        { value: 'ordinaria', label: 'Ordinaria' },
        { value: 'extraordinaria', label: 'Extraordinaria' },
        { value: 'ajuste', label: 'Ajuste' },
      ],
    });
  }

  fields.push({
    name: 'observaciones',
    label: 'Observaciones',
    type: 'textarea',
    span: 2,
  });

  return fields;
}

function crudFields(href: string): SubmoduleFormField[] {
  const path = href.toLowerCase();
  const lastSegment = href.split('/').filter(Boolean).pop() ?? 'registro';
  const entityLabel = humanizeSlug(lastSegment);

  const fields: SubmoduleFormField[] = [
    {
      name: 'codigo',
      label: 'Código',
      type: 'text',
      required: true,
      placeholder: `Código de ${entityLabel.toLowerCase()}`,
    },
    {
      name: 'nombre',
      label: 'Nombre / Descripción',
      type: 'text',
      required: true,
      placeholder: `Nombre de ${entityLabel.toLowerCase()}`,
    },
  ];

  if (path.includes('paciente') || path.includes('empleado') || path.includes('tercero')) {
    fields.push(
      { name: 'tipoDocumento', label: 'Tipo de documento', type: 'text', placeholder: 'CC, CE, NIT...' },
      { name: 'documento', label: 'Número de documento', type: 'text', required: true }
    );
  }

  if (path.includes('banco') || path.includes('cuenta') || path.includes('tesoreria')) {
    fields.push(
      { name: 'numeroCuenta', label: 'Número de cuenta', type: 'text' },
      { name: 'entidadBancaria', label: 'Entidad bancaria', type: 'text' }
    );
  }

  if (path.includes('medicamento') || path.includes('articulo') || path.includes('insumo')) {
    fields.push(
      { name: 'cantidad', label: 'Cantidad', type: 'number', placeholder: '0' },
      { name: 'unidadMedida', label: 'Unidad de medida', type: 'text', placeholder: 'Und, mg, ml...' }
    );
  }

  if (path.includes('orden') || path.includes('remision') || path.includes('epicrisis')) {
    fields.push(
      { name: 'paciente', label: 'Paciente', type: 'text', required: true },
      { name: 'medico', label: 'Profesional', type: 'text' },
      { name: 'diagnostico', label: 'Diagnóstico / Motivo', type: 'textarea', span: 2 }
    );
  }

  if (path.includes('cita') || path.includes('consultorio') || path.includes('horario')) {
    fields.push(
      { name: 'fecha', label: 'Fecha', type: 'date', required: true },
      { name: 'hora', label: 'Hora', type: 'text', placeholder: 'HH:MM' },
      { name: 'profesional', label: 'Profesional', type: 'text' }
    );
  }

  if (path.includes('imagen') || path.includes('laboratorio') || path.includes('examen')) {
    fields.push(
      { name: 'procedimiento', label: 'Procedimiento / Estudio', type: 'text', required: true },
      { name: 'resultado', label: 'Resultado / Interpretación', type: 'textarea', span: 2 }
    );
  }

  fields.push(
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      options: ESTADO_OPTIONS,
      defaultValue: 'activo',
    },
    {
      name: 'observaciones',
      label: 'Observaciones',
      type: 'textarea',
      span: 2,
      placeholder: 'Notas adicionales',
    }
  );

  return fields;
}

export function buildSubmoduleFormConfig(
  href: string,
  title: string,
  description?: string
): SubmoduleFormConfig {
  const mode = inferMode(href);
  const fields =
    mode === 'report'
      ? reportFields(href)
      : mode === 'process'
        ? processFields(href)
        : crudFields(href);

  const submitLabel =
    mode === 'report' ? 'Generar informe' : mode === 'process' ? 'Ejecutar proceso' : 'Guardar registro';

  return {
    title,
    description:
      description ??
      (mode === 'report'
        ? 'Configure los parámetros y genere el informe.'
        : mode === 'process'
          ? 'Complete los datos para ejecutar el proceso.'
          : 'Complete el formulario para registrar la información.'),
    mode,
    fields,
    submitLabel,
    resetLabel: 'Limpiar',
  };
}
