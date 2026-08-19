import type { StitchSection } from '@/components/stitch/StitchMockPage';

export interface StitchScreenDef {
  slug: string;
  title: string;
  description: string;
  icon: string;
  mobileFrame?: boolean;
  sections: StitchSection[];
}

export const PYM_VARIANTS = [
  { slug: 'adolescencia', title: 'HC Adolescencia PyM' },
  { slug: 'adultez', title: 'HC Adultez PyM' },
  { slug: 'cronico', title: 'HC Crónico PyM' },
  { slug: 'juventud', title: 'HC Juventud PyM' },
  { slug: 'morbilidad', title: 'HC Morbilidad PyM' },
  { slug: 'ninez', title: 'HC Niñez PyM' },
  { slug: 'planificacion', title: 'HC Planificación PyM' },
  { slug: 'preconcepcional', title: 'HC Preconcepcional PyM' },
  { slug: 'prenatal', title: 'HC Prenatal PyM' },
  { slug: 'primera-infancia', title: 'HC Primera Infancia PyM' },
  { slug: 'salud-mental', title: 'HC Salud Mental PyM' },
  { slug: 'salud-oral', title: 'HC Salud Oral PyM' },
  { slug: 'salud-visual', title: 'HC Salud Visual PyM' },
  { slug: 'vacunacion', title: 'HC Vacunación PyM' },
  { slug: 'vejez', title: 'HC Vejez PyM' },
] as const;

export function buildPymSections(variantTitle: string): StitchSection[] {
  return [
    {
      type: 'patientBar',
      name: 'Laura Méndez Rojas',
      id: 'CC 1029384756',
      age: '28 años',
      entity: 'EPS Demo Salud',
    },
    {
      type: 'banner',
      text: `${variantTitle}: formulario clínico de prototipo según Ruta de Promoción y Mantenimiento.`,
      tone: 'info',
    },
    {
      type: 'form',
      title: 'Datos de la consulta',
      fields: [
        { label: 'Fecha de atención', placeholder: '2026-08-08' },
        { label: 'Finalidad de la consulta', placeholder: 'Promoción y mantenimiento' },
        { label: 'Motivo de consulta', placeholder: 'Control de rutina', span: 2 },
        { label: 'Antecedentes relevantes', placeholder: 'Ninguno conocido', span: 2 },
        { label: 'Plan de cuidado', placeholder: 'Educación en hábitos saludables', span: 2 },
      ],
    },
    {
      type: 'table',
      title: 'Indicadores / hallazgos (mock)',
      columns: ['Ítem', 'Valor', 'Unidad', 'Estado'],
      rows: [
        ['Peso', '62', 'kg', 'Normal'],
        ['Talla', '165', 'cm', 'Normal'],
        ['IMC', '22.8', 'kg/m²', 'Normal'],
        ['PA', '118/76', 'mmHg', 'Óptimo'],
      ],
    },
  ];
}

export const STITCH_SCREENS: Record<string, StitchScreenDef> = {
  teleconsulta: {
    slug: 'teleconsulta',
    title: 'Teleconsulta médica',
    description: 'Consulta remota en vivo — prototipo visual',
    icon: 'videocam',
    sections: [
      {
        type: 'patientBar',
        name: 'Andrés Ruiz Peña',
        id: 'CC 80123456',
        age: '41 años',
        entity: 'Particular',
      },
      {
        type: 'metrics',
        items: [
          { label: 'Duración', value: '18:24', icon: 'timer', meta: 'En curso' },
          { label: 'Calidad video', value: 'HD', icon: 'hd', meta: 'Estable' },
          { label: 'Latencia', value: '42 ms', icon: 'speed', meta: 'Óptima' },
          { label: 'Grabación', value: 'ON', icon: 'fiber_manual_record', meta: 'Consentida' },
        ],
      },
      {
        type: 'cards',
        title: 'Controles',
        items: [
          { title: 'Audio / video', description: 'Micrófono y cámara del profesional', icon: 'mic' },
          { title: 'Compartir pantalla', description: 'Resultados o imágenes', icon: 'present_to_all' },
          { title: 'Notas clínicas', description: 'Evolución durante la sesión', icon: 'edit_note' },
        ],
      },
    ],
  },
  copilot: {
    slug: 'copilot',
    title: 'Asistente clínico inteligente',
    description: 'Copilot ASIS — sugerencias IA (mock)',
    icon: 'psychology',
    sections: [
      {
        type: 'banner',
        text: 'Las sugerencias son ilustrativas. No sustituyen el criterio clínico.',
        tone: 'warning',
      },
      {
        type: 'metrics',
        items: [
          { label: 'Alertas activas', value: '7', icon: 'notification_important' },
          { label: 'Pacientes en riesgo', value: '23', icon: 'health_and_safety' },
          { label: 'Sugerencias hoy', value: '14', icon: 'auto_awesome' },
          { label: 'Precisión modelo', value: '91%', icon: 'model_training' },
        ],
      },
      {
        type: 'table',
        title: 'Sugerencias recientes',
        columns: ['Paciente', 'Hallazgo', 'Recomendación', 'Confianza'],
        rows: [
          ['M. Gómez', 'HbA1c 8.2%', 'Ajustar metformina / nutrición', '88%'],
          ['J. Pérez', 'PA 158/98', 'Control hipertensivo 48h', '92%'],
          ['C. Díaz', 'Polimedicación', 'Revisión interacciones', '85%'],
        ],
      },
    ],
  },
  ayuda: {
    slug: 'ayuda',
    title: 'Centro de ayuda y soporte',
    description: 'FAQ y soporte al paciente / institución',
    icon: 'support_agent',
    sections: [
      {
        type: 'cards',
        title: 'Temas frecuentes',
        items: [
          { title: 'Agendar cita', description: 'Cómo reservar y cancelar turnos', icon: 'event' },
          { title: 'Resultados', description: 'Consulta de laboratorio e imágenes', icon: 'biotech' },
          { title: 'Facturación', description: 'Estados de cuenta y autorizaciones', icon: 'receipt_long' },
          { title: 'Teleconsulta', description: 'Requisitos técnicos y acceso', icon: 'videocam' },
        ],
      },
      {
        type: 'form',
        title: 'Abrir ticket (mock)',
        fields: [
          { label: 'Asunto', placeholder: 'No puedo ver mis resultados' },
          { label: 'Categoría', placeholder: 'Portal paciente' },
          { label: 'Descripción', placeholder: 'Detalle del problema...', span: 2 },
        ],
      },
    ],
  },
  'dashboard-paciente': {
    slug: 'dashboard-paciente',
    title: 'Dashboard del paciente',
    description: 'Vista agregada del expediente (mock)',
    icon: 'personal_injury',
    sections: [
      {
        type: 'patientBar',
        name: 'Sofía Castillo Nieto',
        id: 'TI 1098765432',
        age: '34 años',
        entity: 'Nueva EPS',
      },
      {
        type: 'metrics',
        items: [
          { label: 'Citas próximas', value: '2', icon: 'event' },
          { label: 'Órdenes abiertas', value: '3', icon: 'prescriptions' },
          { label: 'Resultados nuevos', value: '1', icon: 'lab_profile' },
          { label: 'Autorizaciones', value: '0', icon: 'verified_user' },
        ],
      },
      {
        type: 'table',
        title: 'Timeline clínico',
        columns: ['Fecha', 'Evento', 'Servicio', 'Profesional'],
        rows: [
          ['2026-08-01', 'Consulta externa', 'Medicina general', 'Dra. Vega'],
          ['2026-07-20', 'Hemograma', 'Laboratorio', 'Lab Central'],
          ['2026-07-12', 'Dispensación', 'Farmacia', 'QF. Molina'],
        ],
      },
    ],
  },
  'riesgo-poblacional': {
    slug: 'riesgo-poblacional',
    title: 'Dashboard de riesgo poblacional e IA',
    description: 'Segmentación y predicción (mock)',
    icon: 'analytics',
    sections: [
      {
        type: 'metrics',
        items: [
          { label: 'Población cubierta', value: '18.4k', icon: 'groups' },
          { label: 'Alto riesgo', value: '6.2%', icon: 'crisis_alert' },
          { label: 'Crónicos controlados', value: '71%', icon: 'monitor_heart' },
          { label: 'Fugas de cobertura', value: '142', icon: 'trending_down' },
        ],
      },
      {
        type: 'table',
        title: 'Cohortes prioritarias',
        columns: ['Cohorte', 'Pacientes', 'Riesgo', 'Acción sugerida'],
        rows: [
          ['Diabetes descontrolada', '486', 'Alto', 'Llamada de enfermería'],
          ['Gestantes 3er trim.', '112', 'Medio', 'Control prenatal'],
          ['Adulto mayor + caídas', '230', 'Alto', 'Visita domiciliaria'],
        ],
      },
    ],
  },
  rips: {
    slug: 'rips',
    title: 'Generación de RIPS Res. 2275',
    description: 'Empaquetado y validación normativa (mock)',
    icon: 'dataset',
    sections: [
      {
        type: 'metrics',
        items: [
          { label: 'Facturas periodo', value: '1,204', icon: 'receipt' },
          { label: 'Validadas', value: '1,118', icon: 'task_alt' },
          { label: 'Con error', value: '86', icon: 'error' },
          { label: 'Archivos ZIP', value: '4', icon: 'folder_zip' },
        ],
      },
      {
        type: 'form',
        title: 'Parámetros de generación',
        fields: [
          { label: 'Periodo desde', placeholder: '2026-07-01' },
          { label: 'Periodo hasta', placeholder: '2026-07-31' },
          { label: 'Entidad / contrato', placeholder: 'Nueva EPS - Capita' },
          { label: 'Modalidad', placeholder: 'JSON RIPS 2275' },
        ],
      },
      {
        type: 'table',
        title: 'Últimos lotes',
        columns: ['Lote', 'Registros', 'Estado', 'Generado'],
        rows: [
          ['RIPS-202607-01', '312', 'OK', '2026-08-02'],
          ['RIPS-202607-02', '298', 'Con alertas', '2026-08-03'],
          ['RIPS-202607-03', '274', 'Pendiente', '—'],
        ],
      },
    ],
  },
  'portal-paciente': {
    slug: 'portal-paciente',
    title: 'App móvil — Home del paciente',
    description: 'Portal paciente (vista móvil mock)',
    icon: 'smartphone',
    mobileFrame: true,
    sections: [
      {
        type: 'banner',
        text: 'Hola, Sofía. Tienes 1 cita mañana a las 9:00 a.m.',
        tone: 'info',
      },
      {
        type: 'cards',
        items: [
          { title: 'Mis citas', description: 'Próximas y historial', icon: 'event', href: '/citas' },
          { title: 'Resultados', description: 'Lab e imágenes', icon: 'lab_profile' },
          { title: 'Teleconsulta', description: 'Entrar a sala', icon: 'videocam', href: '/portal-paciente/teleconsulta' },
          { title: 'Ayuda', description: 'Soporte', icon: 'support_agent', href: '/ayuda' },
        ],
      },
    ],
  },
  'portal-teleconsulta': {
    slug: 'portal-teleconsulta',
    title: 'App móvil — Teleconsulta en vivo',
    description: 'Sala móvil del paciente (mock)',
    icon: 'call',
    mobileFrame: true,
    sections: [
      {
        type: 'metrics',
        items: [
          { label: 'Estado', value: 'Conectado', icon: 'wifi' },
          { label: 'Médico', value: 'Dra. Vega', icon: 'stethoscope' },
        ],
      },
      {
        type: 'cards',
        items: [
          { title: 'Silenciar', description: 'Micrófono', icon: 'mic_off' },
          { title: 'Cámara', description: 'Activar / ocultar', icon: 'videocam' },
          { title: 'Finalizar', description: 'Colgar llamada', icon: 'call_end' },
        ],
      },
    ],
  },
  pym: {
    slug: 'pym',
    title: 'Historias clínicas PyM',
    description: 'Índice de formularios Promoción y Mantenimiento',
    icon: 'menu_book',
    sections: [
      {
        type: 'banner',
        text: 'Selecciona un ciclo de vida / programa para abrir el prototipo visual correspondiente.',
        tone: 'info',
      },
      {
        type: 'cards',
        title: 'Módulos PyM',
        items: PYM_VARIANTS.map((v) => ({
          title: v.title,
          description: `Formulario ${v.slug}`,
          icon: 'assignment',
          href: `/historias/pym/${v.slug}`,
        })),
      },
    ],
  },
};
