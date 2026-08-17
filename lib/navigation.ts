import { MODULE_TYPES, type ModuleType, type NavigationItem, type ModuleConfig } from '@/lib/types';

// Normaliza el rol proveniente de BD/NextAuth (SUPER_ADMIN, MEDICO, etc.)
// a los roles usados por la navegación ("Administrador", "Médico", ...)
function normalizeRole(userRole: string): string {
  if (!userRole) return 'Administrador';
  const role = userRole.trim();
  switch (role) {
    case 'SUPER_ADMIN':
    case 'ENTITY_ADMIN':
    case 'ADMIN':
    case 'Administrador':
      return 'Administrador';
    case 'MEDICO':
    case 'Médico':
    case 'Medico':
      return 'Médico';
    case 'ENFERMERO':
    case 'Enfermero':
      return 'Enfermero';
    case 'USER':
    case 'Usuario':
      return 'Usuario';
    default:
      // Cualquier rol desconocido por defecto a Administrador para no ocultar módulos
      return 'Administrador';
  }
}

// 🧭 Sistema de Navegación Unificado con Submódulos

// Configuración de módulos del sistema con submódulos - MÓDULOS PRINCIPALES ACTUALIZADOS
export const MODULES_CONFIG: Record<ModuleType, ModuleConfig> = {
  admin: {
    id: 'admin',
    title: 'Administración',
    description: 'Configuración del sistema',
    icon: '⚙️',
    color: 'bg-gray-500',
    href: '/admin',
    requiresAuth: true,
    roles: ['Administrador'],
    isActive: true,
  },
  configuracion: {
    id: 'configuracion',
    title: 'Configuración General',
    description: 'Configuración general del sistema',
    icon: '🔧',
    color: 'bg-blue-500',
    href: '/configuracion',
    requiresAuth: true,
    roles: ['Administrador'],
    isActive: true,
  },
  plataforma: {
    id: 'plataforma',
    title: 'Plataforma',
    description: 'Administración exclusiva del dueño de la plataforma',
    icon: '🛡️',
    color: 'bg-slate-700',
    href: '/plataforma/usuarios-principales',
    requiresAuth: true,
    roles: ['Administrador'],
    isActive: true,
  },
  // Mantener clave para cumplir tipos, pero desactivada
  facturacion: {
    id: 'facturacion',
    title: 'Facturación',
    description: 'Gestión financiera y facturación',
    icon: '💰',
    color: 'bg-emerald-500',
    href: '/facturacion',
    requiresAuth: true,
    roles: ['Administrador'],
    isActive: true,
  },
  historias: {
    id: 'historias',
    title: 'Historias Clínicas',
    description: 'Gestión de historias médicas',
    icon: '📋',
    color: 'bg-purple-500',
    href: '/historias',
    requiresAuth: true,
    roles: ['Administrador', 'Médico', 'Enfermero'],
    isActive: true,
  },
  triage: {
    id: 'triage',
    title: 'Triage',
    description: 'Sistema de priorización',
    icon: '🏥',
    color: 'bg-red-500',
    href: '/triage',
    requiresAuth: true,
    roles: ['Administrador', 'Médico', 'Enfermero'],
    isActive: true,
  },
  asistencial: {
    id: 'asistencial',
    title: 'Asistencial',
    description: 'Gestión asistencial y atención médica',
    icon: '🏨',
    color: 'bg-teal-500',
    href: '/asistencial',
    requiresAuth: true,
    roles: ['Médico', 'Enfermero', 'Administrador'],
    isActive: true,
  },
  inventario: {
    id: 'inventario',
    title: 'Inventario',
    description: 'Control de inventario, bodegas, proveedores y movimientos de artículos',
    icon: '📦',
    color: 'bg-amber-500',
    href: '/inventario',
    requiresAuth: true,
    roles: ['Administrador'],
    isActive: true,
  },
  auditoria: {
    id: 'auditoria',
    title: 'Auditoría',
    description: 'Auditoría y control de calidad',
    icon: '🔍',
    color: 'bg-violet-500',
    href: '/auditoria',
    requiresAuth: true,
    roles: ['Administrador'],
    isActive: true,
  },
  laboratorio: {
    id: 'laboratorio',
    title: 'Laboratorio',
    description: 'Exámenes y resultados de laboratorio clínico',
    icon: '🧪',
    color: 'bg-cyan-500',
    href: '/laboratorio',
    requiresAuth: true,
    roles: ['Administrador', 'Médico', 'Enfermero'],
    isActive: true,
  },
  'imagenes-diagnosticas': {
    id: 'imagenes-diagnosticas',
    title: 'Imágenes Diagnósticas',
    description: 'Gestión de imágenes médicas',
    icon: '🖼️',
    color: 'bg-pink-500',
    href: '/imagenes-diagnosticas',
    requiresAuth: true,
    roles: ['Administrador', 'Médico', 'Enfermero'],
    isActive: true,
  },
  contabilidad: {
    id: 'contabilidad',
    title: 'Contabilidad',
    description: 'Gestión contable, financiera y tesorería',
    icon: '📈',
    color: 'bg-lime-500',
    href: '/contabilidad',
    requiresAuth: true,
    roles: ['Administrador'],
    isActive: true,
  },
  presupuesto: {
    id: 'presupuesto',
    title: 'Presupuesto',
    description: 'Gestión presupuestaria y ejecución financiera',
    icon: '📋',
    color: 'bg-sky-500',
    href: '/presupuesto',
    requiresAuth: true,
    roles: ['Administrador'],
    isActive: true,
  },
  nomina: {
    id: 'nomina',
    title: 'Nómina',
    description: 'Gestión de recursos humanos y liquidación de nómina',
    icon: '👥',
    color: 'bg-fuchsia-500',
    href: '/nomina',
    requiresAuth: true,
    roles: ['Administrador'],
    isActive: true,
  },
  cartera: {
    id: 'cartera',
    title: 'Cartera',
    description: 'Gestión de cartera y cobranza',
    icon: '💳',
    color: 'bg-cyan-500',
    href: '/cartera',
    requiresAuth: true,
    roles: ['Administrador'],
    isActive: true,
  },
  citas: {
    id: 'citas',
    title: 'Citas',
    description: 'Gestión de citas médicas',
    icon: '🗓️',
    color: 'bg-indigo-500',
    href: '/citas',
    requiresAuth: true,
    roles: ['Administrador', 'Médico', 'Enfermero'],
    isActive: true,
  },
  admision: {
    id: 'admision',
    title: 'Admisiones',
    description: 'Gestión de admisiones',
    icon: '🏥',
    color: 'bg-orange-500',
    href: '/admision',
    requiresAuth: true,
    roles: ['Administrador', 'Médico', 'Enfermero'],
    isActive: true,
  },
  farmacia: {
    id: 'farmacia',
    title: 'Farmacia',
    description: 'Gestión de medicamentos',
    icon: '💊',
    color: 'bg-green-500',
    href: '/farmacia',
    requiresAuth: true,
    roles: ['Administrador', 'Médico', 'Enfermero'],
    isActive: true,
  },
  calidad: {
    id: 'calidad',
    title: 'Calidad',
    description: 'Gestión de calidad y satisfacción del paciente',
    icon: '⭐',
    color: 'bg-yellow-500',
    href: '/calidad',
    requiresAuth: true,
    roles: ['Administrador'],
    isActive: true,
  },
};

// 🎯 Navegación principal con submódulos - NUEVO ORDEN ACTUALIZADO
export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
    description: 'Panel principal del sistema',
    requiresAuth: true,
    roles: ['Administrador', 'Médico', 'Enfermero'],
    children: [
      {
        id: 'dashboard-principal',
        title: 'Panel Principal',
        href: '/dashboard',
        icon: '📊',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'dashboard-estadisticas',
        title: 'Estadísticas',
        href: '/dashboard/estadisticas',
        icon: '📈',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'dashboard-reportes',
        title: 'Reportes',
        href: '/dashboard/reportes',
        icon: '📋',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'dashboard-alertas',
        title: 'Alertas',
        href: '/dashboard/alertas',
        icon: '⚠️',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
    ],
  },
  {
    id: 'plataforma',
    title: 'Plataforma',
    href: '/plataforma/usuarios-principales',
    icon: '🛡️',
    description: 'Módulo exclusivo del administrador principal',
    requiresAuth: true,
    roles: ['Administrador'],
    children: [
      {
        id: 'plataforma-usuarios-principales',
        title: 'Usuarios principales',
        href: '/plataforma/usuarios-principales',
        icon: '👤',
        description: 'Crear y gestionar el admin principal de cada entidad contratada',
        requiresAuth: true,
        roles: ['Administrador'],
      },
    ],
  },
  {
    id: 'configuracion',
    title: 'Configuración General',
    href: '/configuracion',
    icon: '🔧',
    description: 'Configuración general del sistema',
    requiresAuth: true,
    roles: ['Administrador'],
    children: [
      {
        id: 'configuracion-general',
        title: 'Configuración General',
        href: '/configuracion/general',
        icon: '⚙️',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'configuracion-sistema',
        title: 'Configuración del Sistema',
        href: '/configuracion/sistema',
        icon: '🔧',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'configuracion-seguridad',
        title: 'Seguridad',
        href: '/configuracion/seguridad',
        icon: '🔐',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'configuracion-notificaciones',
        title: 'Notificaciones',
        href: '/configuracion/notificaciones',
        icon: '🔔',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'configuracion-backup',
        title: 'Backup y Restauración',
        href: '/configuracion/backup',
        icon: '💾',
        requiresAuth: true,
        roles: ['Administrador'],
      },
    ],
  },
  {
    id: 'admin',
    title: 'Administración',
    href: '/admin',
    icon: '⚙️',
    description: 'Configuración del sistema',
    requiresAuth: true,
    roles: ['Administrador', 'Médico', 'Enfermero'],
    children: [
      {
        id: 'admin-institucion',
        title: 'Institución',
        href: '/admin/institucion',
        icon: '🏥',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-usuarios',
        title: 'Usuarios del Sistema',
        href: '/admin/usuarios',
        icon: '👥',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-pacientes',
        title: 'Pacientes',
        href: '/patients',
        icon: '👥',
        description: 'Formulario de pacientes',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'admin-roles',
        title: 'Perfiles',
        href: '/admin/roles',
        icon: '🔐',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-configuracion',
        title: 'Configuración General',
        href: '/admin/configuracion',
        icon: '⚙️',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-contratos',
        title: 'Contratos con entidades',
        href: '/admin/contratos',
        icon: '🤝',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-habitaciones',
        title: 'Habitaciones',
        href: '/admin/habitaciones',
        icon: '🏠',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-camas',
        title: 'Camas',
        href: '/admin/camas',
        icon: '🛏️',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-articulos',
        title: 'Artículos',
        href: '/admin/articulos',
        icon: '📦',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-listas-precios',
        title: 'Listas de precios',
        href: '/admin/listas-precios',
        icon: '📋',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-resoluciones-dian',
        title: 'Resoluciones Dian',
        href: '/admin/resoluciones-dian',
        icon: '📈',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-cups-propios',
        title: 'Cups propios',
        href: '/admin/cups-propios',
        icon: '📋',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-centros-servicios',
        title: 'Centros de servicios',
        href: '/admin/centros-servicios',
        icon: '🔵',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-centros-costos',
        title: 'Centros de costos',
        href: '/admin/centros-costos',
        icon: '💰',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-conceptos-facturacion',
        title: 'Conceptos de facturación',
        href: '/admin/conceptos-facturacion',
        icon: '📋',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-copagos',
        title: 'Copagos',
        href: '/admin/copagos',
        icon: '💻',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-servicios-chatbot',
        title: 'Servicios ChatBot',
        href: '/admin/servicios-chatbot',
        icon: '🤖',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-soporte-tecnico',
        title: 'Soporte Técnico',
        href: '/admin/soporte-tecnico',
        icon: '🎧',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'admin-informe',
        title: 'Informe',
        href: '/admin/informe',
        icon: '📄',
        requiresAuth: true,
        roles: ['Administrador'],
        children: [
          {
            id: 'admin-informe-listado-camas',
            title: 'Listado Camas',
            href: '/admin/informe/listado-camas',
            icon: '📄',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'admin-informe-listado-articulos',
            title: 'Listado Artículos',
            href: '/admin/informe/listado-articulos',
            icon: '📄',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'admin-informe-listado-contratos',
            title: 'Listado Contratos',
            href: '/admin/informe/listado-contratos',
            icon: '📄',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'admin-informe-listado-entidades',
            title: 'Listado Entidades',
            href: '/admin/informe/listado-entidades',
            icon: '📄',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'admin-informe-listado-habitaciones',
            title: 'Listado Habitaciones',
            href: '/admin/informe/listado-habitaciones',
            icon: '📄',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'admin-informe-listado-usuarios',
            title: 'Listado Usuarios',
            href: '/admin/informe/listado-usuarios',
            icon: '📄',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'admin-informe-listado-conceptos',
            title: 'Listado Conceptos',
            href: '/admin/informe/listado-conceptos',
            icon: '📄',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'admin-informe-facturacion',
            title: 'Facturación',
            href: '/admin/informe/facturacion',
            icon: '📄',
            requiresAuth: true,
            roles: ['Administrador'],
          },
        ],
      },
    ],
  },
  {
    id: 'facturacion',
    title: 'Facturación',
    href: '/facturacion',
    icon: '💰',
    description: 'Gestión financiera y facturación',
    requiresAuth: true,
    roles: ['Administrador'],
    children: [
      { id: 'facturacion-pacientes', title: 'Pacientes', href: '/facturacion/administracion/pacientes', icon: '🧍‍♂️', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-admisiones', title: 'Admisiones', href: '/facturacion/administracion/admisiones', icon: '✅', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-recibos-caja', title: 'Recibos de caja', href: '/facturacion/administracion/recibos-caja', icon: '💵', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-traslados', title: 'Traslados', href: '/facturacion/administracion/traslados', icon: '🚑', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-homologaciones-proc', title: 'Homologaciones proc', href: '/facturacion/administracion/homologaciones-proc', icon: '🔗', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-anexo-inconsistencia', title: 'Anexo técnico Inconsistencia base de datos', href: '/facturacion/administracion/anexo-inconsistencia', icon: '📎', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-anexo-urgencia', title: 'Anexo técnico Informe atención urgencia', href: '/facturacion/administracion/anexo-urgencia', icon: '📎', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-anexo-autorizaciones', title: 'Anexo técnico Autorizaciones', href: '/facturacion/administracion/anexo-autorizaciones', icon: '📎', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-resolucion-202', title: 'Resolución 202', href: '/facturacion/administracion/resolucion-202', icon: '📄', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-resolucion-4505', title: 'Resolución 4505', href: '/facturacion/administracion/resolucion-4505', icon: '📄', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-grupos-etareos', title: 'Grupos etareos', href: '/facturacion/administracion/grupos-etareos', icon: '👥', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-furips', title: 'Furips', href: '/facturacion/administracion/furips', icon: '📄', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-furtran', title: 'Furtran', href: '/facturacion/administracion/furtran', icon: '🏷️', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-anexo-tecnico-uno', title: 'Anexo Técnico Uno', href: '/facturacion/administracion/anexo-tecnico-uno', icon: '📎', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-parejas', title: 'Parejas', href: '/facturacion/administracion/parejas', icon: '👥', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-informe', title: 'Informe', href: '/facturacion/informe', icon: '▸', requiresAuth: true, roles: ['Administrador'] },
      { id: 'facturacion-proceso', title: 'Proceso', href: '/facturacion/proceso', icon: '▸', requiresAuth: true, roles: ['Administrador'] },
    ],
  },
  {
    id: 'citas',
    title: 'Citas',
    href: '/citas',
    icon: '🗓️',
    description: 'Gestión de citas médicas',
    requiresAuth: true,
    roles: ['Administrador', 'Médico', 'Enfermero'],
    children: [
      {
        id: 'citas-consultorios',
        title: 'Consultorios',
        href: '/citas/consultorios',
        icon: '🏥',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'citas-horarios',
        title: 'Horarios citas',
        href: '/citas/horarios',
        icon: '🕐',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'citas-asignar',
        title: 'Asignar citas',
        href: '/citas/asignar',
        icon: '➕',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'citas-informe',
        title: 'Informe',
        href: '/citas/informe',
        icon: '📊',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
        children: [
          {
            id: 'citas-informe-listado-citas',
            title: 'Listado Citas',
            href: '/citas/informe/listado-citas',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'citas-informe-citas-canceladas',
            title: 'Citas Canceladas',
            href: '/citas/informe/citas-canceladas',
            icon: '❌',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'citas-informe-inasistentes',
            title: 'Inasistentes',
            href: '/citas/informe/inasistentes',
            icon: '⏰',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
        ],
      },
    ],
  },
  {
    id: 'historias',
    title: 'Historias Clínicas',
    href: '/historias',
    icon: '📋',
    description: 'Gestión de historias médicas',
    requiresAuth: true,
    roles: ['Administrador', 'Médico', 'Enfermero'],
    children: [
      {
        id: 'historias-clinica',
        title: 'Historia Clínica',
        href: '/historias/historia-clinica',
        icon: '📋',
        requiresAuth: true,
        // ENTITY_ADMIN se normaliza a Administrador; si no está aquí, el menú padre se oculta
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'historias-listado',
        title: 'Listado de historias',
        href: '/historias/listado',
        icon: '📑',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'historias-remisiones',
        title: 'Remisiones',
        href: '/historias/remisiones',
        icon: '📤',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'historias-paquetes-medicamentos',
        title: 'Paquetes Medicamentos',
        href: '/historias/paquetes-medicamentos',
        icon: '💊',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'historias-paquetes-procedimientos',
        title: 'Paquetes Procedimientos',
        href: '/historias/paquetes-procedimientos',
        icon: '🔬',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'historias-partograma',
        title: 'Partograma',
        href: '/historias/partograma',
        icon: '👶',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'historias-evolucion-ambulatoria',
        title: 'Evolución Ambulatoria',
        href: '/historias/evolucion-ambulatoria',
        icon: '🏥',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'historias-informe',
        title: 'Informe',
        href: '/historias/informe',
        icon: '📊',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
        children: [
          {
            id: 'historias-informe-listado-historias',
            title: 'Listado Historias clínicas',
            href: '/historias/informe/listado-historias',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'historias-informe-listado-cronicos',
            title: 'Listado Crónicos',
            href: '/historias/informe/listado-cronicos',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'historias-informe-listado-remisiones',
            title: 'Listado remisiones',
            href: '/historias/informe/listado-remisiones',
            icon: '📤',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'historias-informe-listado-prenatal',
            title: 'Listado Prenatal',
            href: '/historias/informe/listado-prenatal',
            icon: '🤰',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'historias-informe-listado-evoluciones',
            title: 'Listado Evoluciones',
            href: '/historias/informe/listado-evoluciones',
            icon: '📈',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'historias-informe-listado-evoluciones-ambulatoria',
            title: 'Listado Evoluciones Ambulatoria',
            href: '/historias/informe/listado-evoluciones-ambulatoria',
            icon: '🏥',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
        ],
      },
    ],
  },
  {
    id: 'triage',
    title: 'Triage',
    href: '/triage',
    icon: '🏥',
    description: 'Sistema de priorización',
    requiresAuth: true,
    roles: ['Administrador', 'Médico', 'Enfermero'],
    children: [
      {
        id: 'triage-ingreso-paciente',
        title: 'Ingreso paciente',
        href: '/triage/ingreso-paciente',
        icon: '👤',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'triage-valoracion',
        title: 'Valoración triage',
        href: '/triage/valoracion',
        icon: '🔍',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'triage-niveles',
        title: 'Niveles de triage',
        href: '/triage/niveles',
        icon: '📊',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'triage-informe',
        title: 'Informe',
        href: '/triage/informe',
        icon: '📋',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
        children: [
          {
            id: 'triage-informe-listado-ingreso',
            title: 'Listado Ingreso Paciente',
            href: '/triage/informe/listado-ingreso',
            icon: '👥',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'triage-informe-listado-valoracion',
            title: 'Listado Valoración Triage',
            href: '/triage/informe/listado-valoracion',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
        ],
      },
    ],
  },
  {
    id: 'asistencial',
    title: 'Asistencial',
    href: '/asistencial',
    icon: '🏨',
    description: 'Gestión asistencial',
    requiresAuth: true,
    roles: ['Médico', 'Enfermero', 'Administrador'],
    children: [
      {
        id: 'asistencial-ordenes-medicas',
        title: 'Órdenes Médicas',
        href: '/asistencial/ordenes-medicas',
        icon: '📋',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'asistencial-evoluciones',
        title: 'Evoluciones',
        href: '/asistencial/evoluciones',
        icon: '📈',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'asistencial-notas-enfermeria',
        title: 'Notas de Enfermería',
        href: '/asistencial/notas-enfermeria',
        icon: '📝',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'asistencial-remisiones',
        title: 'Remisiones',
        href: '/asistencial/remisiones',
        icon: '📤',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'asistencial-epicrisis',
        title: 'Epicrisis',
        href: '/asistencial/epicrisis',
        icon: '📄',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'asistencial-informes-quirurgicos',
        title: 'Informes quirúrgicos',
        href: '/asistencial/informes-quirurgicos',
        icon: '🔪',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'asistencial-notas-historia',
        title: 'Notas Historia',
        href: '/asistencial/notas-historia',
        icon: '📖',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'asistencial-solicitud-articulos',
        title: 'Solicitud de Artículos',
        href: '/asistencial/solicitud-articulos',
        icon: '🛒',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'asistencial-informe',
        title: 'Informe',
        href: '/asistencial/informe',
        icon: '📊',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
        children: [
          {
            id: 'asistencial-informe-listado-historias',
            title: 'Listado Historias asistenciales',
            href: '/asistencial/informe/listado-historias',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'asistencial-informe-listado-epicrisis',
            title: 'Listado Epicrisis',
            href: '/asistencial/informe/listado-epicrisis',
            icon: '📄',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'asistencial-informe-listado-evoluciones',
            title: 'Listado Evoluciones',
            href: '/asistencial/informe/listado-evoluciones',
            icon: '📈',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'asistencial-informe-listado-ordenes',
            title: 'Listado Órdenes Médicas',
            href: '/asistencial/informe/listado-ordenes',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'asistencial-informe-listado-notas-enfermeria',
            title: 'Listado Notas de Enfermería',
            href: '/asistencial/informe/listado-notas-enfermeria',
            icon: '📝',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'asistencial-informe-listado-remisiones',
            title: 'Listado remisiones',
            href: '/asistencial/informe/listado-remisiones',
            icon: '📤',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'asistencial-informe-censo-pacientes-medicamentos',
            title: 'Censo de pacientes con medicamentos',
            href: '/asistencial/informe/censo-pacientes-medicamentos',
            icon: '💊',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'asistencial-informe-hoja-administracion-medicamentos',
            title: 'Hoja de administración de medicamentos',
            href: '/asistencial/informe/hoja-administracion-medicamentos',
            icon: '💊',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'asistencial-informe-hoja-gastos-materiales',
            title: 'Hoja de gastos materiales',
            href: '/asistencial/informe/hoja-gastos-materiales',
            icon: '📊',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'asistencial-informe-listado-epicrisis-control',
            title: 'Listado Epicrisis con control',
            href: '/asistencial/informe/listado-epicrisis-control',
            icon: '📄',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'asistencial-informe-listado-administracion-medicamentos',
            title: 'Listado Administración Medicamentos',
            href: '/asistencial/informe/listado-administracion-medicamentos',
            icon: '💊',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
          {
            id: 'asistencial-informe-listado-administracion-insumos',
            title: 'Listado Administración Insumos',
            href: '/asistencial/informe/listado-administracion-insumos',
            icon: '🩹',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
        ],
      },
    ],
  },
  {
    id: 'inventario',
    title: 'Inventario',
    href: '/inventario',
    icon: '📦',
    description: 'Control de inventario, bodegas, proveedores y movimientos de artículos',
    requiresAuth: true,
    roles: ['Administrador'],
    children: [
      {
        id: 'inventario-bodegas',
        title: 'Bodegas',
        href: '/inventario/bodegas',
        icon: '🏢',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'inventario-equivalencias',
        title: 'Equivalencias',
        href: '/inventario/equivalencias',
        icon: '🔄',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'inventario-proveedores',
        title: 'Proveedores',
        href: '/inventario/proveedores',
        icon: '🏪',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'inventario-tipos-inventario',
        title: 'Tipos de inventario',
        href: '/inventario/tipos-inventario',
        icon: '🏷️',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'inventario-tipos-notas',
        title: 'Tipos de notas',
        href: '/inventario/tipos-notas',
        icon: '📝',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'inventario-tipo-ingreso',
        title: 'Tipo ingreso artículos',
        href: '/inventario/tipo-ingreso',
        icon: '📥',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'inventario-nota-salida',
        title: 'Nota salida artículos',
        href: '/inventario/nota-salida',
        icon: '📤',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'inventario-movimiento',
        title: 'Movimiento de artículos',
        href: '/inventario/movimiento',
        icon: '🔄',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'inventario-ordenes-compra',
        title: 'Órdenes de Compra',
        href: '/inventario/ordenes-compra',
        icon: '🛒',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'inventario-compras',
        title: 'Compras',
        href: '/inventario/compras',
        icon: '💰',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'inventario-entrega-ambulatorio',
        title: 'Entrega Ambulatorio',
        href: '/inventario/entrega-ambulatorio',
        icon: '🏥',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'inventario-entrega-hospitalizacion',
        title: 'Entrega Hospitalización',
        href: '/inventario/entrega-hospitalizacion',
        icon: '🏨',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'inventario-interface',
        title: 'Interface Inventario',
        href: '/inventario/interface',
        icon: '🔗',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'inventario-informe',
        title: 'Informe',
        href: '/inventario/informe',
        icon: '📊',
        requiresAuth: true,
        roles: ['Administrador'],
        children: [
          {
            id: 'inventario-informe-movimiento',
            title: 'Listar Movimiento',
            href: '/inventario/informe/movimiento',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'inventario-informe-kardex',
            title: 'Kardex',
            href: '/inventario/informe/kardex',
            icon: '📊',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'inventario-informe-existencias',
            title: 'Listado de existencias',
            href: '/inventario/informe/existencias',
            icon: '📦',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'inventario-informe-ordenes-compra',
            title: 'Listado órdenes de compra',
            href: '/inventario/informe/ordenes-compra',
            icon: '🛒',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'inventario-informe-entrega-ambulatorio',
            title: 'Listado entrega artículos ambulatorio',
            href: '/inventario/informe/entrega-ambulatorio',
            icon: '🏥',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'inventario-informe-vendidos',
            title: 'Listado vendidos',
            href: '/inventario/informe/vendidos',
            icon: '💰',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'inventario-informe-pendientes',
            title: 'Listado Pendientes',
            href: '/inventario/informe/pendientes',
            icon: '⏳',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'inventario-informe-planilla-dispensacion',
            title: 'Listado Planilla Dispensación',
            href: '/inventario/informe/planilla-dispensacion',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador'],
          },
        ],
      },
    ],
  },
  {
    id: 'auditoria',
    title: 'Auditoría',
    href: '/auditoria',
    icon: '🔍',
    description: 'Auditoría y control',
    requiresAuth: true,
    roles: ['Administrador'],
    children: [
      {
        id: 'auditoria-nueva',
        title: 'Nueva Auditoría',
        href: '/auditoria/nueva',
        icon: '➕',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'auditoria-pendientes',
        title: 'Auditorías Pendientes',
        href: '/auditoria/pendientes',
        icon: '⏳',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'auditoria-hallazgos',
        title: 'Hallazgos Recientes',
        href: '/auditoria/hallazgos',
        icon: '🔍',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'auditoria-reportes',
        title: 'Reportes de Auditoría',
        href: '/auditoria/reportes',
        icon: '📊',
        requiresAuth: true,
        roles: ['Administrador'],
      },
    ],
  },
  {
    id: 'laboratorio',
    title: 'Laboratorio',
    href: '/laboratorio',
    icon: '🧪',
    description: 'Exámenes y resultados de laboratorio clínico',
    requiresAuth: true,
    roles: ['Administrador', 'Médico', 'Enfermero'],
    children: [
      {
        id: 'laboratorio-parametrizar',
        title: 'Parametrizar laboratorio clínico',
        href: '/laboratorio/parametrizacion',
        icon: '⚙️',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'laboratorio-resultados-paciente',
        title: 'Resultados laboratorio clínico por paciente',
        href: '/laboratorio/resultados-paciente',
        icon: '👤',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'laboratorio-resultados-procedimiento',
        title: 'Resultados laboratorio clínico por procedimiento',
        href: '/laboratorio/resultados-procedimiento',
        icon: '🔬',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'laboratorio-informe',
        title: 'Informe',
        href: '#', // Sin página propia, solo despliega submódulos
        icon: '📊',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
        children: [
          {
            id: 'laboratorio-informe-listado-examenes',
            title: 'Listado Exámenes Laboratorio',
            href: '/laboratorio/informe/listado_examenes_laboratorio',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador', 'Médico', 'Enfermero'],
          },
        ],
      },
    ],
  },
  {
    id: 'calidad',
    title: 'Calidad',
    href: '/calidad',
    icon: '⭐',
    description: 'Gestión de calidad y satisfacción del paciente',
    requiresAuth: true,
    roles: ['Administrador'],
    children: [
      {
        id: 'calidad-encuesta-satisfaccion',
        title: 'Encuesta satisfacción',
        href: '/calidad/encuesta-satisfaccion',
        icon: '📝',
        requiresAuth: true,
        roles: ['Administrador'],
        children: [
          {
            id: 'calidad-encuesta-satisfaccion-listado',
            title: 'Listado Encuestas',
            href: '/calidad/encuesta-satisfaccion/listado',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador'],
          },
        ],
      },
      {
        id: 'calidad-eventos-adversos',
        title: 'Eventos adversos',
        href: '/calidad/eventos-adversos',
        icon: '⚠️',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'calidad-parametrizacion-produccion',
        title: 'Parametrización producción (2193)',
        href: '/calidad/parametrizacion-produccion',
        icon: '⚙️',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'calidad-mensaje-difusion',
        title: 'Mensaje difusión (demanda inducida)',
        href: '/calidad/mensaje-difusion',
        icon: '📢',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'calidad-informes',
        title: 'Informes',
        href: '#', // Sin página propia, solo despliega submódulos
        icon: '📊',
        requiresAuth: true,
        roles: ['Administrador'],
        children: [
          {
            id: 'calidad-informes-oportunidad',
            title: 'Informe Oportunidad',
            href: '/calidad/informes/informe-oportunidad',
            icon: '📈',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'calidad-informes-1552',
            title: 'Informe 1552',
            href: '/calidad/informes/informe-1552',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'calidad-informes-0256',
            title: 'Informe 0256',
            href: '/calidad/informes/informe-0256',
            icon: '📄',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'calidad-informes-resolucion-1604',
            title: 'Resolución 1604',
            href: '/calidad/informes/resolucion-1604',
            icon: '📑',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'calidad-informes-totales-inventario',
            title: 'Totales Inventario',
            href: '/calidad/informes/totales-inventario',
            icon: '📦',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'calidad-informes-sismed',
            title: 'Informe Sismed',
            href: '/calidad/informes/informe-sismed',
            icon: '💊',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'calidad-informes-satisfaccion-global',
            title: 'Informe Satisfacción Global',
            href: '/calidad/informes/informe-satisfaccion-global',
            icon: '⭐',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'calidad-informes-listado-reingresos',
            title: 'Listado Reingresos',
            href: '/calidad/informes/listado-reingresos',
            icon: '🔄',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'calidad-informes-produccion-2193',
            title: 'Informe Producción 2193',
            href: '/calidad/informes/informe-produccion-2193',
            icon: '📊',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'calidad-informes-resolucion-2175',
            title: 'Resolución 2175',
            href: '/calidad/informes/resolucion-2175',
            icon: '📜',
            requiresAuth: true,
            roles: ['Administrador'],
          },
        ],
      },
    ],
  },
  {
    id: 'imagenes-diagnosticas',
    title: 'Imágenes Diagnósticas',
    href: '/imagenes-diagnosticas',
    icon: '🖼️',
    description: 'Gestión de imágenes médicas',
    requiresAuth: true,
    roles: ['Médico', 'Enfermero'],
    children: [
      {
        id: 'imagenes-nueva',
        title: 'Nueva Imagen',
        href: '/imagenes-diagnosticas/nueva',
        icon: '➕',
        requiresAuth: true,
        roles: ['Médico', 'Enfermero'],
      },
      {
        id: 'imagenes-pendientes',
        title: 'Imágenes Pendientes',
        href: '/imagenes-diagnosticas/pendientes',
        icon: '⏳',
        requiresAuth: true,
        roles: ['Médico', 'Enfermero'],
      },
      {
        id: 'imagenes-tipos',
        title: 'Tipos de Estudios',
        href: '/imagenes-diagnosticas/tipos',
        icon: '📋',
        requiresAuth: true,
        roles: ['Médico', 'Enfermero'],
      },
      {
        id: 'imagenes-interpretacion',
        title: 'Interpretación',
        href: '/imagenes-diagnosticas/interpretacion',
        icon: '🔬',
        requiresAuth: true,
        roles: ['Médico'],
      },
    ],
  },
  {
    id: 'farmacia',
    title: 'Farmacia',
    href: '/farmacia',
    icon: '💊',
    description: 'Gestión de medicamentos',
    requiresAuth: true,
    roles: ['Administrador', 'Médico', 'Enfermero'],
    children: [
      {
        id: 'farmacia-medicamentos',
        title: 'Medicamentos',
        href: '/farmacia/medicamentos',
        icon: '💊',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'farmacia-recetas',
        title: 'Recetas',
        href: '/farmacia/recetas',
        icon: '📝',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'farmacia-dispensacion',
        title: 'Dispensación',
        href: '/farmacia/dispensacion',
        icon: '📦',
        requiresAuth: true,
        roles: ['Administrador', 'Médico', 'Enfermero'],
      },
      {
        id: 'farmacia-stock',
        title: 'Control de Stock',
        href: '/farmacia/stock',
        icon: '📊',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'farmacia-proveedores',
        title: 'Proveedores',
        href: '/farmacia/proveedores',
        icon: '🏢',
        requiresAuth: true,
        roles: ['Administrador'],
      },
    ],
  },
  {
    id: 'contabilidad',
    title: 'Contabilidad',
    href: '/contabilidad',
    icon: '📈',
    description: 'Gestión contable, financiera y tesorería',
    requiresAuth: true,
    roles: ['Administrador'],
    children: [
      {
        id: 'contabilidad-cargue-saldos-iniciales',
        title: 'Cargue de Saldos Iniciales',
        href: '/contabilidad/cargue-saldos-iniciales',
        icon: '💰',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-plan-cuentas',
        title: 'Plan de Cuentas',
        href: '/contabilidad/plan-cuentas',
        icon: '📊',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-documentos',
        title: 'Documentos de Contabilidad',
        href: '/contabilidad/documentos',
        icon: '📄',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-terceros',
        title: 'Terceros',
        href: '/contabilidad/terceros',
        icon: '👥',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-retenciones',
        title: 'Retenciones',
        href: '/contabilidad/retenciones',
        icon: '📋',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-comprobantes',
        title: 'Comprobantes de Contabilidad',
        href: '/contabilidad/comprobantes',
        icon: '📝',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-factura-venta',
        title: 'Factura de Venta',
        href: '/contabilidad/factura-venta',
        icon: '📈',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-factura-compra',
        title: 'Factura de Compra',
        href: '/contabilidad/factura-compra',
        icon: '📉',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-bancos',
        title: 'Bancos',
        href: '/contabilidad/bancos',
        icon: '🏦',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-cuentas-bancarias',
        title: 'Cuentas Bancarias',
        href: '/contabilidad/cuentas-bancarias',
        icon: '💳',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-tesorería',
        title: 'Tesorería',
        href: '/contabilidad/tesoreria',
        icon: '💰',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-viaticos',
        title: 'Viáticos',
        href: '/contabilidad/viaticos',
        icon: '✈️',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-asiento-cierre',
        title: 'Asiento de cierre',
        href: '/contabilidad/asiento-cierre',
        icon: '🔒',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-deterioro-cartera',
        title: 'Deterioro de Cartera',
        href: '/contabilidad/deterioro-cartera',
        icon: '📉',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-reasignacion',
        title: 'Reasignación',
        href: '/contabilidad/reasignacion',
        icon: '🔄',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-documento-soporte',
        title: 'Documento Soporte',
        href: '/contabilidad/documento-soporte',
        icon: '📎',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'contabilidad-informe',
        title: 'Informe',
        href: '/contabilidad/informe',
        icon: '📊',
        requiresAuth: true,
        roles: ['Administrador'],
        children: [
          {
            id: 'contabilidad-informe-listado-retenciones',
            title: 'Listado Retenciones',
            href: '/contabilidad/informe/listado-retenciones',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'contabilidad-informe-listado-documentos-descargados',
            title: 'Listado Documentos Descargados',
            href: '/contabilidad/informe/listado-documentos-descargados',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'contabilidad-informe-seguimiento-cartera',
            title: 'Seguimiento de Cartera',
            href: '/contabilidad/informe/seguimiento-cartera',
            icon: '📊',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'contabilidad-informe-listado-comprobantes',
            title: 'Listado Comprobantes de Contabilidad',
            href: '/contabilidad/informe/listado-comprobantes',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'contabilidad-informe-listado-auxiliares',
            title: 'Listado auxiliares de contabilidad',
            href: '/contabilidad/informe/listado-auxiliares',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'contabilidad-informe-circular-030',
            title: 'Informe circular 030',
            href: '/contabilidad/informe/circular-030',
            icon: '📄',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'contabilidad-informe-balance-general',
            title: 'Balance general',
            href: '/contabilidad/informe/balance-general',
            icon: '⚖️',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'contabilidad-informe-estado-resultados',
            title: 'Estado de resultados',
            href: '/contabilidad/informe/estado-resultados',
            icon: '📊',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'contabilidad-informe-libro-mayor',
            title: 'Libro mayor',
            href: '/contabilidad/informe/libro-mayor',
            icon: '📖',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'contabilidad-informe-hoja-trabajo-balance',
            title: 'Hoja de trabajo y balance',
            href: '/contabilidad/informe/hoja-trabajo-balance',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'contabilidad-informe-listado-terceros',
            title: 'Listado Terceros',
            href: '/contabilidad/informe/listado-terceros',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador'],
          },
        ],
      },
    ],
  },
  {
    id: 'presupuesto',
    title: 'Presupuesto',
    href: '/presupuesto',
    icon: '📋',
    description: 'Gestión presupuestaria y ejecución financiera',
    requiresAuth: true,
    roles: ['Administrador'],
    children: [
      {
        id: 'presupuesto-terceros',
        title: 'Terceros',
        href: '/presupuesto/terceros',
        icon: '👥',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'presupuesto-vigencias',
        title: 'Vigencias',
        href: '/presupuesto/vigencias',
        icon: '📅',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'presupuesto-rubros-presupuestales',
        title: 'Rubros presupuestales',
        href: '/presupuesto/rubros-presupuestales',
        icon: '📊',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'presupuesto-movimiento-presupuestal',
        title: 'Movimiento presupuestal',
        href: '/presupuesto/movimiento-presupuestal',
        icon: '🔄',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'presupuesto-certificado-disponibilidad',
        title: 'Certificado Disponibilidad',
        href: '/presupuesto/certificado-disponibilidad',
        icon: '✅',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'presupuesto-certificado-registro-presupuestal',
        title: 'Certificado de registro presupuestal',
        href: '/presupuesto/certificado-registro-presupuestal',
        icon: '📋',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'presupuesto-orden-pago',
        title: 'Orden de pago',
        href: '/presupuesto/orden-pago',
        icon: '💳',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'presupuesto-ingresos-pagos',
        title: 'Ingresos/pagos',
        href: '/presupuesto/ingresos-pagos',
        icon: '💰',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'presupuesto-liberacion-presupuestal',
        title: 'Liberación Presupuestal',
        href: '/presupuesto/liberacion-presupuestal',
        icon: '🔓',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'presupuesto-informe',
        title: 'Informe',
        href: '/presupuesto/informe',
        icon: '📊',
        requiresAuth: true,
        roles: ['Administrador'],
        children: [
          {
            id: 'presupuesto-informe-listado-auxiliares',
            title: 'Listado de auxiliares de presupuesto',
            href: '/presupuesto/informe/listado-auxiliares',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'presupuesto-informe-ejecucion-presupuestal',
            title: 'Ejecución Presupuestal',
            href: '/presupuesto/informe/ejecucion-presupuestal',
            icon: '📊',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'presupuesto-informe-listado-auxiliar-tipo-documento',
            title: 'Listado Auxiliar Por Tipo Documento',
            href: '/presupuesto/informe/listado-auxiliar-tipo-documento',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'presupuesto-informe-seguimiento-presupuesto',
            title: 'Seguimiento de presupuesto',
            href: '/presupuesto/informe/seguimiento-presupuesto',
            icon: '📈',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'presupuesto-informe-listado-cdp',
            title: 'Listado CDP',
            href: '/presupuesto/informe/listado-cdp',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'presupuesto-informe-crp',
            title: 'CRP',
            href: '/presupuesto/informe/crp',
            icon: '📋',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'presupuesto-informe-libro-pagos',
            title: 'Libro Pagos',
            href: '/presupuesto/informe/libro-pagos',
            icon: '📖',
            requiresAuth: true,
            roles: ['Administrador'],
          },
        ],
      },
    ],
  },
  {
    id: 'nomina',
    title: 'Nómina',
    href: '/nomina',
    icon: '👥',
    description: 'Gestión de recursos humanos y liquidación de nómina',
    requiresAuth: true,
    roles: ['Administrador'],
    children: [
      {
        id: 'nomina-empleados',
        title: 'Empleados',
        href: '/nomina/empleados',
        icon: '👥',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'nomina-cargos',
        title: 'Cargos',
        href: '/nomina/cargos',
        icon: '🎯',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'nomina-departamentos',
        title: 'Departamentos',
        href: '/nomina/departamentos',
        icon: '🏢',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'nomina-subdepartamentos',
        title: 'Subdepartamentos',
        href: '/nomina/subdepartamentos',
        icon: '🏛️',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'nomina-contratos',
        title: 'Contratos',
        href: '/nomina/contratos',
        icon: '📄',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'nomina-proceso',
        title: 'Proceso',
        href: '/nomina/proceso',
        icon: '⚙️',
        requiresAuth: true,
        roles: ['Administrador'],
        children: [
          {
            id: 'nomina-proceso-liquidacion',
            title: 'Liquidación',
            href: '/nomina/proceso/liquidacion',
            icon: '💰',
            requiresAuth: true,
            roles: ['Administrador'],
          },
          {
            id: 'nomina-proceso-configuracion-conceptos',
            title: 'Configuración Conceptos',
            href: '/nomina/proceso/configuracion-conceptos',
            icon: '⚙️',
            requiresAuth: true,
            roles: ['Administrador'],
          },
        ],
      },
    ],
  },
  {
    id: 'cartera',
    title: 'Cartera',
    href: '/cartera',
    icon: '💳',
    description: 'Gestión de cartera',
    requiresAuth: true,
    roles: ['Administrador'],
    children: [
      {
        id: 'cartera-nueva-cobranza',
        title: 'Nueva Cobranza',
        href: '/cartera/nueva-cobranza',
        icon: '➕',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'cartera-facturas-vencidas',
        title: 'Facturas Vencidas',
        href: '/cartera/facturas-vencidas',
        icon: '⚠️',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'cartera-cobranzas',
        title: 'Cobranzas Recientes',
        href: '/cartera/cobranzas',
        icon: '📋',
        requiresAuth: true,
        roles: ['Administrador'],
      },
      {
        id: 'cartera-proyecciones',
        title: 'Proyecciones de Cobranza',
        href: '/cartera/proyecciones',
        icon: '📊',
        requiresAuth: true,
        roles: ['Administrador'],
      },
    ],
  },
  {
    id: 'admision',
    title: 'Admisiones',
    href: '/admision',
    icon: '🏥',
    description: 'Gestión de admisiones e ingresos',
    requiresAuth: true,
    roles: ['Administrador', 'Médico', 'Enfermero'],
  },

];

// Utilidades de navegación
export const getModulesByRole = (userRole: string): ModuleConfig[] => {
  const normalized = normalizeRole(userRole);
  return Object.values(MODULES_CONFIG).filter(
    (module) => module.roles.includes(normalized) && module.isActive
  );
};

export const getNavigationByRole = (userRole: string): NavigationItem[] => {
  const normalized = normalizeRole(userRole);

  const filterByRole = (items: NavigationItem[]): NavigationItem[] =>
    items
      .filter((item) => !item.roles || item.roles.includes(normalized))
      .map((item) => {
        const hadChildren = !!(item.children && item.children.length);
        const children = item.children ? filterByRole(item.children) : undefined;
        return { item, hadChildren, children };
      })
      .filter(({ hadChildren, children }) => {
        // Contenedor sin hijos visibles para este rol → ocultar
        if (hadChildren && (!children || children.length === 0)) return false;
        return true;
      })
      .map(({ item, children }) => ({
        ...item,
        children: children && children.length > 0 ? children : undefined,
      }));

  return filterByRole(MAIN_NAVIGATION);
};

export const isModuleAccessible = (moduleId: ModuleType, userRole: string): boolean => {
  const module = MODULES_CONFIG[moduleId];
  const normalized = normalizeRole(userRole);
  return module.isActive && module.roles.includes(normalized);
};

// 🎯 Nuevas utilidades para submódulos
export const getSubmodulesByRole = (userRole: string): NavigationItem[] => {
  const modules = getNavigationByRole(userRole);
  const submodules: NavigationItem[] = [];
  
  modules.forEach(module => {
    if (module.children) {
      submodules.push(...module.children);
    }
  });
  
  return submodules;
};

export const getModuleWithSubmodules = (moduleId: string, userRole: string): NavigationItem | null => {
  const module = MAIN_NAVIGATION.find(
    (item) => item.id === moduleId && item.roles?.includes(userRole)
  );
  
  return module || null;
};

export const getAllAccessibleItems = (userRole: string): NavigationItem[] => {
  const modules = getNavigationByRole(userRole);
  const allItems: NavigationItem[] = [];
  
  modules.forEach(module => {
    allItems.push(module);
    if (module.children) {
      allItems.push(...module.children);
    }
  });
  
  return allItems;
};

// Mapeo de módulos de navegación a módulos de permisos en roles
// Este mapeo conecta los IDs de navegación con los módulos de permisos configurados en roles
const MODULE_PERMISSION_MAP: Record<string, string> = {
  'dashboard': 'dashboard',
  'configuracion': 'configuracion',
  'plataforma': 'plataforma',
  'admin': 'administracion',
  'admin-pacientes': 'pacientes',
  'facturacion': 'facturacion',
  'citas': 'citas',
  'historias': 'historias',
  'triage': 'triage',
  'asistencial': 'asistencial',
  'inventario': 'inventario',
  'auditoria': 'auditoria',
  'laboratorio': 'laboratorio',
  'imagenes-diagnosticas': 'imagenes',
  'calidad': 'calidad',
  'farmacia': 'farmacia',
  'contabilidad': 'contabilidad',
  'presupuesto': 'presupuesto',
  'nomina': 'nomina',
  'cartera': 'cartera',
  'admision': 'pacientes', // Admisiones está relacionado con pacientes
};

/**
 * Filtra los items de navegación según los permisos del usuario
 */
export function filterNavigationByPermissions(
  navItems: NavigationItem[],
  permissions: Record<string, { read: boolean; create: boolean; update: boolean; delete: boolean }> | null
): NavigationItem[] {
  // Si no hay permisos, retornar todos los items (sistema por defecto)
  if (!permissions) {
    return navItems;
  }

  return navItems
    .map(item => {
      const moduleKey = MODULE_PERMISSION_MAP[item.id];
      
      // Si el módulo no está en el mapa, permitirlo (módulos que no requieren permisos específicos)
      if (!moduleKey) {
        return item;
      }

      // Verificar si el usuario tiene permiso de lectura para este módulo
      const modulePermissions = permissions[moduleKey];
      if (!modulePermissions || !modulePermissions.read) {
        return null; // No tiene permiso, filtrar este módulo
      }

      // Filtrar también los hijos según permisos
      let filteredChildren: NavigationItem[] | undefined;
      if (item.children) {
        filteredChildren = item.children
          .map(child => {
            const childModuleKey = MODULE_PERMISSION_MAP[child.id];
            if (!childModuleKey) {
              return child; // Permitir si no está en el mapa
            }
            
            const childPermissions = permissions[childModuleKey];
            if (!childPermissions || !childPermissions.read) {
              return null;
            }

            // Filtrar también los nietos si existen
            let filteredGrandchildren: NavigationItem[] | undefined;
            if (child.children) {
              filteredGrandchildren = child.children
                .map(grandchild => {
                  const grandchildModuleKey = MODULE_PERMISSION_MAP[grandchild.id];
                  if (!grandchildModuleKey) {
                    return grandchild;
                  }
                  
                  const grandchildPermissions = permissions[grandchildModuleKey];
                  if (!grandchildPermissions || !grandchildPermissions.read) {
                    return null;
                  }
                  return grandchild;
                })
                .filter((item): item is NavigationItem => item !== null);
              
              if (filteredGrandchildren.length === 0) {
                return null; // Si no hay nietos válidos, filtrar el hijo también
              }
            }

            return {
              ...child,
              children: filteredGrandchildren,
            };
          })
          .filter((item): item is NavigationItem => item !== null);
        
        // Si no hay hijos válidos, filtrar el módulo padre también
        if (filteredChildren.length === 0) {
          return null;
        }
      }

      return {
        ...item,
        children: filteredChildren,
      };
    })
    .filter((item): item is NavigationItem => item !== null);
} 