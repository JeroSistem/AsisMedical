
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  contact: string;
  address: string;
  avatarUrl: string;
}

export interface Diagnosis {
  id: string;
  date: string;
  code: string;
  description: string;
  physician: string;
}

export interface Treatment {
  id: string;
  date: string;
  procedure: string;
  medication?: string;
  dosage?: string;
  physician: string;
}

export interface MedicalDocument {
  id: string;
  date: string;
  type: 'Lab Result' | 'Imaging Report' | 'Consultation Note';
  title: string;
  url: string;
}

export interface MedicalRecord {
  patientId: string;
  medicalHistory: string;
  currentStatus: string;
  diagnoses: Diagnosis[];
  treatments: Treatment[];
  documents: MedicalDocument[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Médico' | 'Enfermero' | 'Paciente';
  creationDate: string;
  status: 'Active' | 'Inactive';
  // Allow other string properties
  [key: string]: any;
}
