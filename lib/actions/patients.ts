'use server';

const DB_DISABLED_MESSAGE =
  'La base de datos ha sido deshabilitada. Esta funcionalidad estará disponible cuando se configure una nueva capa de persistencia.';

export interface PatientFormData {
  // Información de identificación
  documentType: string;
  documentNumber: string;
  countryOfIssue?: string;
  
  // Información personal
  firstName: string;
  lastName: string;
  secondLastName?: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  maritalStatus?: string;
  bloodType?: string;
  occupation?: string;
  
  // Información clínica inicial
  allergies?: string;
  activeProblems?: string;
  initialObservations?: string;
  
  // Información de contacto
  mobilePhone?: string;
  landlinePhone?: string;
  email?: string;
  contactPreference?: string;
  notificationsConsent: boolean;
  
  // Dirección
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  
  // Contacto de emergencia
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  
  // Representante legal (para menores)
  legalRepresentativeName?: string;
  legalRepresentativeDocument?: string;
  legalRepresentativePhone?: string;
  legalRepresentativeRelationship?: string;
  
  // Información de seguro
  insuranceProvider?: string;
  insuranceNumber?: string;
  
  // Información de admisión
  createAdmission: boolean;
  admissionType?: string;
  admissionDate?: string;
  
  // Consentimientos
  dataProcessingConsent: boolean;
  medicalConsent: boolean;
  privacyConsent: boolean;
  communicationConsent: boolean;
}

export async function createPatient(_: PatientFormData) {
  console.warn('createPatient llamado sin proveedor de base de datos');
  return { success: false, error: DB_DISABLED_MESSAGE };
}

export async function getPatients() {
  console.warn('getPatients llamado sin proveedor de base de datos');
  return [];
}

export async function getPatientById(id: string) {
  console.warn('getPatientById llamado sin proveedor de base de datos', { id });
  return null;
}

export async function checkDocumentExists(documentNumber: string) {
  console.warn('checkDocumentExists llamado sin proveedor de base de datos', { documentNumber });
  return { exists: false, error: DB_DISABLED_MESSAGE };
}

export async function updatePatient(patientId: string, formData: PatientFormData) {
  console.warn('updatePatient llamado sin proveedor de base de datos', { patientId, formData });
  return { success: false, error: DB_DISABLED_MESSAGE };
}

export interface AdvancedSearchFilters {
  name?: string;
  documentNumber?: string;
  documentType?: string;
  gender?: string;
  ageRange?: {
    min?: number;
    max?: number;
  };
  bloodType?: string;
  maritalStatus?: string;
  phone?: string;
  email?: string;
  city?: string;
  department?: string;
  hasAllergies?: boolean;
  hasActiveProblems?: boolean;
  insuranceProvider?: string;
  status?: string;
  registrationDateRange?: {
    from?: string;
    to?: string;
  };
}

export async function searchPatientsAdvanced(filters: AdvancedSearchFilters) {
  console.warn('searchPatientsAdvanced llamado sin proveedor de base de datos', { filters });
  return [];
}
