// 📦 Exportaciones principales de módulos

// Dashboard
export { default as DashboardStats } from './dashboard/dashboard-stats';
export { default as PatientsChart } from './dashboard/patients-chart';
export { default as PatientsTrend } from './dashboard/patients-trend';
export { default as RecentPatients } from './dashboard/recent-patients';

// Pacientes
export { default as PatientList } from './patients/patient-list';
export { default as PatientDetailClient } from './patients/patient-detail-client';

// Historias Clínicas
export { default as AISummary } from './historias/ai-summary';
export { PatientSelection } from './historias';

// Administración
export { default as UserList } from './admin/user-list';

// Triage (placeholder para futuras implementaciones)
// export { default as TriageForm } from './triage/triage-form';
// export { default as TriageList } from './triage/triage-list';

// Re-exportar tipos desde lib/types
export { MODULE_TYPES, type ModuleType } from '@/lib/types'; 