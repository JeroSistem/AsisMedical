// 📦 Exportaciones principales de módulos

// Dashboard
export { DashboardStats } from './dashboard/dashboard-stats';
export { PatientsByGenderChart as PatientsChart } from './dashboard/patients-chart';
export { PatientsByMonthChart as PatientsTrend } from './dashboard/patients-trend';
export { RecentPatients } from './dashboard/recent-patients';

// Pacientes
export { PatientList } from './patients/patient-list';
export { PatientDetailClient } from './patients/patient-detail-client';

// Historias Clínicas
export { AiSummary as AISummary } from './historias/ai-summary';
export { PatientSelection } from './historias';

// Administración
export { UserList } from './admin/user-list';

// Re-exportar tipos desde lib/types
export { MODULE_TYPES, type ModuleType } from '@/lib/types';
