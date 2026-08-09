'use server';

const DB_DISABLED_MESSAGE =
  'La base de datos ha sido deshabilitada. Esta funcionalidad estará disponible cuando se configure una nueva capa de persistencia.';

export interface PatientAdmissionFormData {
  // Paciente
  patientId: string;
  
  // Ingreso
  admissionDate: string;
  admissionTime: string;
  priorityAttention: string;
  observation: string;
  
  // Entidad
  entity: string;
  contract: string;
  absent: boolean;
  
  // Responsable
  responsibleName: string;
  responsibleRelationship: string;
  responsiblePhone: string;
  
  // Acompañante
  companionName: string;
  companionAddress: string;
  companionPhone: string;
  
  // Hallazgos Físicos
  bloodPressure: string;
  respiratoryRate: string;
  temperature: string;
  heartRate: string;
  height: string;
  weight: string;
  bmi: string;
  bsa: string;
  oxygenSaturation: string;
}

export async function createPatientAdmission(formData: PatientAdmissionFormData) {
  console.warn('createPatientAdmission llamado sin proveedor de base de datos', { formData });
  return { success: false, error: DB_DISABLED_MESSAGE };
}

export async function getPatientAdmissions() {
  console.warn('getPatientAdmissions llamado sin proveedor de base de datos');
  return [];
}

export async function getPatientAdmissionById(id: string) {
  console.warn('getPatientAdmissionById llamado sin proveedor de base de datos', { id });
  return null;
}

export async function updatePatientAdmission(id: string, formData: Partial<PatientAdmissionFormData>) {
  console.warn('updatePatientAdmission llamado sin proveedor de base de datos', { id, formData });
  return { success: false, error: DB_DISABLED_MESSAGE };
}

export async function deletePatientAdmission(id: string) {
  console.warn('deletePatientAdmission llamado sin proveedor de base de datos', { id });
  return { success: false, error: DB_DISABLED_MESSAGE };
}
