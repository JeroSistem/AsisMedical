'use server';

import { generateAdmissionNumber, generateClinicalHistoryNumber } from '@/lib/utils';

export interface MedicalRecordFormData {
  // Datos del paciente
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientIdentification: string;
  patientAddress: string;
  patientPhone: string;
  patientEmail: string;
  patientOccupation: string;
  patientInsurance: string;
  
  // Motivo de consulta
  consultationReason: string;
  
  // Antecedentes
  medicalHistory: string;
  surgicalHistory: string;
  familyHistory: string;
  habits: string;
  
  // Historia de la enfermedad actual
  currentIllnessHistory: string;
  
  // Examen físico
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  oxygenSaturation: string;
  physicalExam: string;
  
  // Diagnóstico
  diagnosis: string;
  
  // Plan de tratamiento
  medications: string;
  complementaryStudies: string;
  recommendations: string;
  
  // Evolución
  evolution: string;
  
  // Profesional
  professionalName: string;
  professionalLicense: string;
}

const DB_DISABLED_MESSAGE =
  'La base de datos ha sido deshabilitada. Esta funcionalidad estará disponible cuando se configure una nueva capa de persistencia.';

export async function createMedicalRecord(formData: MedicalRecordFormData) {
  console.warn('createMedicalRecord llamado sin proveedor de base de datos', { formData });

  // Aun sin persistencia generamos números para mantener compatibilidad con la interfaz.
  const admissionNumber = await generateAdmissionNumber();
  const clinicalHistoryNumber = await generateClinicalHistoryNumber();

  return {
    success: false,
    error: DB_DISABLED_MESSAGE,
    admissionNumber,
    clinicalHistoryNumber
  };
}

export async function getMedicalRecordById(id: string) {
  console.warn('getMedicalRecordById llamado sin proveedor de base de datos', { id });
  return null;
}

export async function updateMedicalRecord(id: string, formData: Partial<MedicalRecordFormData>) {
  console.warn('updateMedicalRecord llamado sin proveedor de base de datos', { id, formData });
  return { success: false, error: DB_DISABLED_MESSAGE };
}

export async function getMedicalRecordsByPatientId(patientId: string) {
  console.warn('getMedicalRecordsByPatientId llamado sin proveedor de base de datos', { patientId });
  return [];
}

export async function getAllMedicalRecords() {
  console.warn('getAllMedicalRecords llamado sin proveedor de base de datos');
  return [];
}
