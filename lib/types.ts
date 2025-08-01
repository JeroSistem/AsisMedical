// 🏷️ Tipos del Sistema - Asis Medical

// Tipos de módulos disponibles
export const MODULE_TYPES = {
  DASHBOARD: 'dashboard',
  PATIENTS: 'patients',
  TRIAGE: 'triage',
  HISTORIAS: 'historias',
  FARMACIA: 'farmacia',
  CITAS: 'citas',
  LABORATORIO: 'laboratorio',
  ADMISION: 'admision',
  FACTURACION: 'facturacion',
  REPORTES: 'reportes',
  ADMIN: 'admin',
  CONFIGURACION: 'configuracion',
  // Nuevos módulos
  ASISTENCIAL: 'asistencial',
  INVENTARIO: 'inventario',
  AUDITORIA: 'auditoria',
  IMAGENES_DIAGNOSTICAS: 'imagenes-diagnosticas',
  CALIDAD: 'calidad',
  CONTABILIDAD: 'contabilidad',
  PRESUPUESTO: 'presupuesto',
  NOMINA: 'nomina',
  CARTERA: 'cartera',
  // Módulos adicionales
  RECIBOS_CAJA: 'recibos-caja',
  TRASLADOS: 'traslados',
  HOMOLOGACIONES_PROC: 'homologaciones-proc',
  ANEXO_TECNICO_INCONSISTENCIA: 'anexo-tecnico-inconsistencia',
  ANEXO_TECNICO_INFORME_URGENCIA: 'anexo-tecnico-informe-urgencia',
  ANEXO_TECNICO_AUTORIZACIONES: 'anexo-tecnico-autorizaciones',
  RESOLUCION_202: 'resolucion-202',
  GRUPOS_ETAREOS: 'grupos-etareos',
  FURIPS: 'furips',
  FURTRAN: 'furtran',
  ANEXO_TECNICO_UNO: 'anexo-tecnico-uno',
  INFORME: 'informe',
  PROCESO: 'proceso'
} as const;

export type ModuleType = typeof MODULE_TYPES[keyof typeof MODULE_TYPES];

// Tipos de navegación
export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon: string;
  description?: string;
  badge?: string;
  children?: NavigationItem[];
  requiresAuth: boolean;
  roles?: string[];
}

export interface ModuleConfig {
  id: ModuleType;
  title: string;
  description: string;
  icon: string;
  color: string;
  href: string;
  requiresAuth: boolean;
  roles: string[];
  isActive: boolean;
}

// Tipos de usuario
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

// Tipos de paciente
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: Date;
  gender: string;
  contact: string;
  address: string;
  avatarUrl?: string;
}

// Tipos de historia clínica
export interface MedicalRecord {
  id: string;
  patientId: string;
  medicalHistory: string;
  currentStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
