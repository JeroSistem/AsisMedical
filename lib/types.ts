// 🏷️ Tipos del Sistema - AsisMediCare

// Tipos de módulos disponibles - MÓDULOS PRINCIPALES ACTUALIZADOS
export const MODULE_TYPES = {
  ADMIN: 'admin',
  CONFIGURACION: 'configuracion',
  PLATAFORMA: 'plataforma',
  FACTURACION: 'facturacion',
  HISTORIAS: 'historias',
  TRIAGE: 'triage',
  ASISTENCIAL: 'asistencial',
  INVENTARIO: 'inventario',
  AUDITORIA: 'auditoria',
  LABORATORIO: 'laboratorio',
  IMAGENES_DIAGNOSTICAS: 'imagenes-diagnosticas',
  CONTABILIDAD: 'contabilidad',
  PRESUPUESTO: 'presupuesto',
  NOMINA: 'nomina',
  CARTERA: 'cartera',
  CITAS: 'citas',
  ADMISION: 'admision',
  FARMACIA: 'farmacia',
  CALIDAD: 'calidad',
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
  creationDate?: string;
  createdAt?: Date;
}

// Tipos de paciente
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: Date | string;
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
  diagnoses?: Diagnosis[];
  treatments?: Treatment[];
  documents?: Document[];
}

// Tipos adicionales para historias clínicas
export interface Diagnosis {
  id: string;
  name: string;
  description: string;
  date: Date;
}

export interface Treatment {
  id: string;
  type: string;
  description: string;
  date: Date;
  medication?: string;
  dosage?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  date: Date;
}

// Tipos para formularios
export interface Inputs {
  name: string;
  apellidos?: string;
  email: string;
  role: string;
  status: string;
}

// Tipos para resultados de acciones
export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Tipos para sesión extendida
export interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  status?: string;
}

export interface ExtendedSession {
  user?: ExtendedUser;
  expires: string;
}

// Tipos para el sistema de configuración
export interface Entity {
  id: string;
  name: string;
  type: 'hospital' | 'clinica' | 'centro_medico' | 'laboratorio';
  status: 'active' | 'inactive' | 'pending';
  adminUser: string;
  adminEmail: string;
  adminPassword: string;
  createdAt: string;
  modules: string[];
}

export interface ConfigUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'entity_admin' | 'user';
  entity: string;
  status: 'active' | 'inactive';
  permissions: string[];
  lastLogin?: string;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  status: 'enabled' | 'disabled';
  permissions: string[];
  config?: any;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}
