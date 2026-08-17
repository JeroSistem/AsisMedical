'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ensurePatientDifferentialColumns } from '@/lib/database-manager';
import { normalizeGenderToEs } from '@/lib/gender';
import { getTenantPrisma } from '@/lib/tenant-prisma';

/** Campos de enfoque diferencial (opcionales / pueden ir vacíos). */
export type PatientDifferentialData = {
  orientacionSexual?: string;
  religion?: string;
  consumoSpa?: string;
  gestacion?: string;
  habitanteCalle?: string;
  resguardoIndigena?: string;
  victimaConflicto?: string;
  minasAntipersona?: string;
  minasMunicionSinExplotar?: string;
  desplazado?: string;
  ruv?: string;
  victimaMaltrato?: string;
  abandonoSocial?: string;
  carcelario?: string;
  poblacionLgbti?: string;
  desempleado?: string;
  mujerConNinoMenorUnAnio?: string;
  adultoMayor?: string;
  migrante?: string;
  desescolarizado?: string;
  trabajadoraSexual?: string;
};

export interface PatientFormData extends PatientDifferentialData {
  documentType: string;
  documentNumber: string;
  countryOfIssue?: string;
  firstName: string;
  lastName: string;
  secondLastName?: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  maritalStatus?: string;
  bloodType?: string;
  occupation?: string;
  allergies?: string;
  activeProblems?: string;
  initialObservations?: string;
  mobilePhone?: string;
  landlinePhone?: string;
  email?: string;
  contactPreference?: string;
  notificationsConsent: boolean;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  legalRepresentativeName?: string;
  legalRepresentativeDocument?: string;
  legalRepresentativePhone?: string;
  legalRepresentativeRelationship?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  createAdmission: boolean;
  admissionType?: string;
  admissionDate?: string;
  dataProcessingConsent: boolean;
  medicalConsent: boolean;
  privacyConsent: boolean;
  communicationConsent: boolean;
}

function optText(value?: string | null): string | null {
  if (value == null) return null;
  const t = String(value).trim();
  return t.length ? t : null;
}

function mapDifferentialFromDb(patient: any): PatientDifferentialData {
  return {
    orientacionSexual: patient.orientacionSexual || '',
    religion: patient.religion || '',
    consumoSpa: patient.consumoSpa || '',
    gestacion: patient.gestacion || '',
    habitanteCalle: patient.habitanteCalle || '',
    resguardoIndigena: patient.resguardoIndigena || '',
    victimaConflicto: patient.victimaConflicto || '',
    minasAntipersona: patient.minasAntipersona || '',
    minasMunicionSinExplotar: patient.minasMunicionSinExplotar || '',
    desplazado: patient.desplazado || '',
    ruv: patient.ruv || '',
    victimaMaltrato: patient.victimaMaltrato || '',
    abandonoSocial: patient.abandonoSocial || '',
    carcelario: patient.carcelario || '',
    poblacionLgbti: patient.poblacionLgbti || '',
    desempleado: patient.desempleado || '',
    mujerConNinoMenorUnAnio: patient.mujerConNinoMenorUnAnio || '',
    adultoMayor: patient.adultoMayor || '',
    migrante: patient.migrante || '',
    desescolarizado: patient.desescolarizado || '',
    trabajadoraSexual: patient.trabajadoraSexual || '',
  };
}

function mapDifferentialToPrisma(formData: PatientFormData) {
  return {
    orientacionSexual: optText(formData.orientacionSexual),
    religion: optText(formData.religion),
    consumoSpa: optText(formData.consumoSpa),
    gestacion: optText(formData.gestacion),
    habitanteCalle: optText(formData.habitanteCalle),
    resguardoIndigena: optText(formData.resguardoIndigena),
    victimaConflicto: optText(formData.victimaConflicto),
    minasAntipersona: optText(formData.minasAntipersona),
    minasMunicionSinExplotar: optText(formData.minasMunicionSinExplotar),
    desplazado: optText(formData.desplazado),
    ruv: optText(formData.ruv),
    victimaMaltrato: optText(formData.victimaMaltrato),
    abandonoSocial: optText(formData.abandonoSocial),
    carcelario: optText(formData.carcelario),
    poblacionLgbti: optText(formData.poblacionLgbti),
    desempleado: optText(formData.desempleado),
    mujerConNinoMenorUnAnio: optText(formData.mujerConNinoMenorUnAnio),
    adultoMayor: optText(formData.adultoMayor),
    migrante: optText(formData.migrante),
    desescolarizado: optText(formData.desescolarizado),
    trabajadoraSexual: optText(formData.trabajadoraSexual),
  };
}

export type PatientRecord = PatientFormData & {
  id: string;
  status: string;
};

function toDateInput(value: Date | string | null | undefined): string {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function mapPatientToForm(patient: any): PatientRecord {
  return {
    id: patient.id,
    status: patient.status || 'ACTIVE',
    documentType: patient.documentType || '',
    documentNumber: patient.documentNumber || '',
    countryOfIssue: patient.countryOfIssue || 'CO',
    firstName: patient.firstName || '',
    lastName: patient.lastName || '',
    secondLastName: patient.secondLastName || '',
    dateOfBirth: toDateInput(patient.dateOfBirth),
    age: patient.age ?? 0,
    gender: normalizeGenderToEs(patient.gender) || patient.gender || '',
    maritalStatus: patient.maritalStatus || '',
    bloodType: patient.bloodType || '',
    occupation: patient.occupation || '',
    allergies: patient.allergies || '',
    activeProblems: patient.activeProblems || '',
    initialObservations: patient.initialObservations || '',
    mobilePhone: patient.mobilePhone || '',
    landlinePhone: patient.landlinePhone || '',
    email: patient.email || '',
    contactPreference: patient.contactPreference || '',
    notificationsConsent: patient.notificationsConsent ?? true,
    address: patient.address || '',
    city: patient.city || '',
    department: patient.department || '',
    country: patient.country || 'Colombia',
    emergencyContactName: patient.emergencyContactName || '',
    emergencyContactPhone: patient.emergencyContactPhone || '',
    emergencyContactRelationship: patient.emergencyContactRelationship || '',
    legalRepresentativeName: patient.legalRepresentativeName || '',
    legalRepresentativeDocument: patient.legalRepresentativeDocument || '',
    legalRepresentativePhone: patient.legalRepresentativePhone || '',
    legalRepresentativeRelationship: patient.legalRepresentativeRelationship || '',
    insuranceProvider: patient.insuranceProvider || '',
    insuranceNumber: patient.insuranceNumber || '',
    createAdmission: patient.createAdmission ?? false,
    admissionType: patient.admissionType || '',
    admissionDate: toDateInput(patient.admissionDate),
    dataProcessingConsent: patient.dataProcessingConsent ?? false,
    medicalConsent: patient.medicalConsent ?? false,
    privacyConsent: patient.privacyConsent ?? false,
    communicationConsent: patient.communicationConsent ?? false,
    ...mapDifferentialFromDb(patient),
  };
}

function toPrismaData(formData: PatientFormData) {
  return {
    documentType: formData.documentType,
    documentNumber: formData.documentNumber.trim(),
    countryOfIssue: formData.countryOfIssue || null,
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    secondLastName: formData.secondLastName || null,
    dateOfBirth: new Date(formData.dateOfBirth),
    age: formData.age || 0,
    gender: normalizeGenderToEs(formData.gender) || formData.gender || 'no definido',
    maritalStatus: formData.maritalStatus || null,
    bloodType: formData.bloodType || null,
    occupation: formData.occupation || null,
    allergies: formData.allergies || null,
    activeProblems: formData.activeProblems || null,
    initialObservations: formData.initialObservations || null,
    mobilePhone: formData.mobilePhone || null,
    landlinePhone: formData.landlinePhone || null,
    email: formData.email || null,
    contactPreference: formData.contactPreference || null,
    notificationsConsent: formData.notificationsConsent ?? true,
    address: formData.address || null,
    city: formData.city || null,
    department: formData.department || null,
    country: formData.country || 'Colombia',
    emergencyContactName: formData.emergencyContactName || null,
    emergencyContactPhone: formData.emergencyContactPhone || null,
    emergencyContactRelationship: formData.emergencyContactRelationship || null,
    legalRepresentativeName: formData.legalRepresentativeName || null,
    legalRepresentativeDocument: formData.legalRepresentativeDocument || null,
    legalRepresentativePhone: formData.legalRepresentativePhone || null,
    legalRepresentativeRelationship: formData.legalRepresentativeRelationship || null,
    insuranceProvider: formData.insuranceProvider || null,
    insuranceNumber: formData.insuranceNumber || null,
    createAdmission: formData.createAdmission ?? false,
    admissionType: formData.admissionType || null,
    admissionDate: formData.admissionDate ? new Date(formData.admissionDate) : null,
    dataProcessingConsent: formData.dataProcessingConsent ?? false,
    medicalConsent: formData.medicalConsent ?? false,
    privacyConsent: formData.privacyConsent ?? false,
    communicationConsent: formData.communicationConsent ?? false,
    ...mapDifferentialToPrisma(formData),
  };
}

export async function searchPatientByDocument(documentNumber: string, documentType?: string) {
  const prisma = await getTenantPrisma();
  const cleaned = documentNumber?.trim();
  if (!cleaned) {
    return { found: false as const, error: 'Ingrese un número de documento' };
  }

  if (!prisma || typeof prisma.patient === 'undefined') {
    return { found: false as const, error: 'Base de datos no disponible' };
  }

  try {
    const patient = await prisma.patient.findFirst({
      where: {
        documentNumber: cleaned,
        ...(documentType ? { documentType } : {}),
      },
    });

    if (!patient) {
      return { found: false as const };
    }

    return { found: true as const, patient: mapPatientToForm(patient) };
  } catch (error: any) {
    console.error('searchPatientByDocument:', error);
    return { found: false as const, error: error?.message || 'Error al buscar paciente' };
  }
}

/** Busca por número de documento o por nombre/apellido. */
export async function searchPatientByQuery(query: string) {
  const prisma = await getTenantPrisma();
  const cleaned = query?.trim();
  if (!cleaned) {
    return { found: false as const, error: 'Escriba un documento o nombre para buscar' };
  }

  if (!prisma || typeof prisma.patient === 'undefined') {
    return { found: false as const, error: 'Base de datos no disponible' };
  }

  try {
    const looksLikeDocument = /^[0-9A-Za-z.-]{4,}$/.test(cleaned) && !/\s/.test(cleaned);

    let patient = null;

    if (looksLikeDocument) {
      patient = await prisma.patient.findFirst({
        where: {
          documentNumber: { contains: cleaned },
        },
        orderBy: { updatedAt: 'desc' },
      });
    } else {
      const parts = cleaned.split(/\s+/).filter(Boolean);
      patient = await prisma.patient.findFirst({
        where: {
          OR: [
            { firstName: { contains: cleaned } },
            { lastName: { contains: cleaned } },
            { secondLastName: { contains: cleaned } },
            ...(parts.length > 1
              ? [
                  {
                    AND: [
                      { firstName: { contains: parts[0] } },
                      { lastName: { contains: parts[parts.length - 1] } },
                    ],
                  },
                ]
              : []),
          ],
        },
        orderBy: { updatedAt: 'desc' },
      });
    }

    if (!patient) {
      return { found: false as const };
    }

    return { found: true as const, patient: mapPatientToForm(patient) };
  } catch (error: any) {
    console.error('searchPatientByQuery:', error);
    return { found: false as const, error: error?.message || 'Error al buscar paciente' };
  }
}

export async function createPatient(formData: PatientFormData) {
  const session = await getServerSession(authOptions);
  const entityId =
    (session?.user as { entityId?: string | null } | undefined)?.entityId ||
    null;

  if (entityId) {
    const cols = await ensurePatientDifferentialColumns(entityId);
    if (!cols.success) {
      console.warn('[createPatient] columnas enfoque diferencial:', cols.error);
    }
  }

  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.patient === 'undefined') {
    return { success: false, error: 'Base de datos no disponible' };
  }

  try {
    const exists = await prisma.patient.findUnique({
      where: { documentNumber: formData.documentNumber.trim() },
    });
    if (exists) {
      return { success: false, error: 'Ya existe un paciente con ese documento' };
    }

    const created = await prisma.patient.create({
      data: {
        ...toPrismaData(formData),
        ...(entityId ? { entityId } : {}),
        status: 'ACTIVE',
      },
    });

    return { success: true, patient: mapPatientToForm(created) };
  } catch (error: any) {
    console.error('createPatient:', error);
    const msg = error?.message || 'Error al crear paciente';
    if (msg.includes('does not exist') || msg.includes('no existe')) {
      return {
        success: false,
        error:
          'La tabla de pacientes no está disponible en la BD de la institución. Contacte al administrador de plataforma.',
      };
    }
    return { success: false, error: msg };
  }
}

export async function getPatients() {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.patient === 'undefined') return [];

  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return patients.map((patient) => ({
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`.trim(),
      documentNumber: patient.documentNumber,
      documentType: patient.documentType || '',
      dateOfBirth: toDateInput(patient.dateOfBirth),
      age: patient.age,
      gender: patient.gender,
      contact: patient.mobilePhone || patient.email || '',
      status: patient.status,
      creationDate: toDateInput(patient.createdAt),
    }));
  } catch (error) {
    console.error('getPatients:', error);
    return [];
  }
}

export async function getPatientById(id: string) {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.patient === 'undefined') return null;

  try {
    const patient = await prisma.patient.findUnique({ where: { id } });
    return patient ? mapPatientToForm(patient) : null;
  } catch (error) {
    console.error('getPatientById:', error);
    return null;
  }
}

export async function checkDocumentExists(documentNumber: string) {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.patient === 'undefined') {
    return { exists: false, error: 'Base de datos no disponible' };
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { documentNumber: documentNumber.trim() },
      select: { id: true },
    });
    return { exists: Boolean(patient) };
  } catch (error: any) {
    return { exists: false, error: error?.message || 'Error al verificar documento' };
  }
}

export async function updatePatient(patientId: string, formData: PatientFormData) {
  const session = await getServerSession(authOptions);
  const entityId =
    (session?.user as { entityId?: string | null } | undefined)?.entityId ||
    null;
  if (entityId) {
    await ensurePatientDifferentialColumns(entityId);
  }

  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.patient === 'undefined') {
    return { success: false, error: 'Base de datos no disponible' };
  }

  try {
    const updated = await prisma.patient.update({
      where: { id: patientId },
      data: toPrismaData(formData),
    });
    return { success: true, patient: mapPatientToForm(updated) };
  } catch (error: any) {
    console.error('updatePatient:', error);
    return { success: false, error: error?.message || 'Error al actualizar paciente' };
  }
}

export interface AdvancedSearchFilters {
  name?: string;
  documentNumber?: string;
  documentType?: string;
  gender?: string;
  ageRange?: { min?: number; max?: number };
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
  registrationDateRange?: { from?: string; to?: string };
}

export async function searchPatientsAdvanced(filters: AdvancedSearchFilters) {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.patient === 'undefined') return [];

  try {
    const patients = await prisma.patient.findMany({
      where: {
        ...(filters.documentNumber
          ? { documentNumber: { contains: filters.documentNumber } }
          : {}),
        ...(filters.documentType ? { documentType: filters.documentType } : {}),
        ...(filters.gender ? { gender: filters.gender } : {}),
        ...(filters.city ? { city: { contains: filters.city } } : {}),
        ...(filters.department
          ? { department: { contains: filters.department } }
          : {}),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.name
          ? {
              OR: [
                { firstName: { contains: filters.name } },
                { lastName: { contains: filters.name } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return patients.map((patient) => ({
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`.trim(),
      documentNumber: patient.documentNumber,
      documentType: patient.documentType || '',
      dateOfBirth: toDateInput(patient.dateOfBirth),
      age: patient.age,
      gender: patient.gender,
      contact: patient.mobilePhone || patient.email || '',
      status: patient.status,
      creationDate: toDateInput(patient.createdAt),
    }));
  } catch (error) {
    console.error('searchPatientsAdvanced:', error);
    return [];
  }
}
