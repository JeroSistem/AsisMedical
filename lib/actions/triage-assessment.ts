'use server';

const DB_DISABLED_MESSAGE =
  'La base de datos ha sido deshabilitada. Esta funcionalidad estará disponible cuando se configure una nueva capa de persistencia.';

export interface TriageAssessmentFormData {
  // Paciente
  patientId: string;
  
  // Datos básicos
  arrivalTime: string;
  assessmentDate: string;
  assessmentTime: string;
  
  // Signos vitales
  bloodPressure: string;
  heartRate: string;
  respiratoryRate: string;
  temperature: string;
  oxygenSaturation: string;
  painLevel: number;
  
  // Nivel de consciencia (Glasgow)
  eyeOpening: number;
  verbalResponse: number;
  motorResponse: number;
  glasgowTotal: number;
  
  // Evaluación del dolor
  painLocation: string;
  painCharacter: string;
  painIntensity: number;
  painDuration: string;
  
  // Síntomas principales
  mainSymptom: string;
  symptomDuration: string;
  associatedSymptoms: string;
  
  // Factores de riesgo
  riskFactors: string[];
  
  // Clasificación de urgencia
  urgencyLevel: string;
  triageCategory: string;
  estimatedWaitTime: string;
  
  // Observaciones
  observations: string;
  recommendations: string;
  
  // Profesional
  professionalName: string;
  professionalLicense: string;
}

export async function createTriageAssessment(formData: TriageAssessmentFormData) {
  console.warn('createTriageAssessment llamado sin proveedor de base de datos', { formData });
  return { success: false, error: DB_DISABLED_MESSAGE };
}

export async function getTriageAssessments() {
  console.warn('getTriageAssessments llamado sin proveedor de base de datos');
  return [];
}

export async function getTriageAssessmentById(id: string) {
  console.warn('getTriageAssessmentById llamado sin proveedor de base de datos', { id });
  return null;
}

export async function updateTriageAssessment(id: string, formData: Partial<TriageAssessmentFormData>) {
  console.warn('updateTriageAssessment llamado sin proveedor de base de datos', { id, formData });
  return { success: false, error: DB_DISABLED_MESSAGE };
}

export async function deleteTriageAssessment(id: string) {
  console.warn('deleteTriageAssessment llamado sin proveedor de base de datos', { id });
  return { success: false, error: DB_DISABLED_MESSAGE };
}
