'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ensureEntityIncrementalTables } from '@/lib/database-manager';
import { getTenantPrisma } from '@/lib/tenant-prisma';
import {
  generateClinicalHistoryNumber,
  toPlainSequenceNumber,
} from '@/lib/admission-numbers';
import { normalizeGenderToEs } from '@/lib/gender';

export interface MedicalRecordFormData {
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

  admissionNumber?: string | number;
  admissionId?: string;

  consultationReason: string;
  medicalHistory: string;
  surgicalHistory: string;
  familyHistory: string;
  habits: string;
  currentIllnessHistory: string;

  bloodPressure: string;
  heartRate: string;
  temperature: string;
  oxygenSaturation: string;
  physicalExam: string;

  diagnosis: string;
  medications: string;
  complementaryStudies: string;
  recommendations: string;
  evolution: string;

  professionalName: string;
  professionalLicense: string;
}

function optText(value?: string | null) {
  if (value == null) return null;
  const t = String(value).trim();
  return t.length ? t : null;
}

function serializeMedicalRecord(row: any) {
  return {
    id: row.id,
    patientId: row.patientId,
    admissionId: row.admissionId || null,
    admissionNumber: toPlainSequenceNumber(row.admissionNumber),
    clinicalHistoryNumber: toPlainSequenceNumber(row.clinicalHistoryNumber),
    consultationReason: row.consultationReason || '',
    medicalHistory: row.medicalHistory || '',
    surgicalHistory: row.surgicalHistory || '',
    familyHistory: row.familyHistory || '',
    habits: row.habits || '',
    currentIllnessHistory: row.currentIllnessHistory || '',
    bloodPressure: row.bloodPressure || '',
    heartRate: row.heartRate || '',
    temperature: row.temperature || '',
    oxygenSaturation: row.oxygenSaturation || '',
    physicalExam: row.physicalExam || '',
    diagnosis: row.diagnosis || '',
    medications: row.medications || '',
    complementaryStudies: row.complementaryStudies || '',
    recommendations: row.recommendations || '',
    evolution: row.evolution || '',
    currentStatus: row.currentStatus || '',
    professionalName: row.professionalName || '',
    professionalLicense: row.professionalLicense || '',
    patientName: row.patientName || '',
    patientAge: row.patientAge ?? 0,
    patientGender: normalizeGenderToEs(row.patientGender) || row.patientGender || '',
    patientIdentification: row.patientIdentification || '',
    patientAddress: row.patientAddress || '',
    patientPhone: row.patientPhone || '',
    patientEmail: row.patientEmail || '',
    patientOccupation: row.patientOccupation || '',
    patientInsurance: row.patientInsurance || '',
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : row.createdAt
          ? String(row.createdAt)
          : null,
  };
}

export async function createMedicalRecord(formData: MedicalRecordFormData) {
  const session = await getServerSession(authOptions);
  const entityId =
    (session?.user as { entityId?: string | null } | undefined)?.entityId || null;
  if (entityId) {
    await ensureEntityIncrementalTables(entityId);
  }

  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.medicalRecord === 'undefined') {
    return { success: false, error: 'Base de datos no disponible' };
  }

  if (!formData.patientId) {
    return { success: false, error: 'Debe indicar un paciente' };
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: formData.patientId },
      select: { id: true },
    });
    if (!patient) {
      return { success: false, error: 'El paciente no existe en la base de datos' };
    }

    let admissionNumber = toPlainSequenceNumber(formData.admissionNumber);

    if (
      !admissionNumber &&
      formData.admissionId &&
      typeof prisma.patientAdmission !== 'undefined'
    ) {
      const admission = await prisma.patientAdmission.findUnique({
        where: { id: formData.admissionId },
        select: { admissionNumber: true },
      });
      if (admission?.admissionNumber != null) {
        admissionNumber = toPlainSequenceNumber(admission.admissionNumber);
      }
    }

    if (!admissionNumber && typeof prisma.patientAdmission !== 'undefined') {
      const latest = await prisma.patientAdmission.findFirst({
        where: { patientId: formData.patientId },
        orderBy: { createdAt: 'desc' },
        select: { admissionNumber: true },
      });
      if (latest?.admissionNumber != null) {
        admissionNumber = toPlainSequenceNumber(latest.admissionNumber);
      }
    }

    if (!admissionNumber) {
      return {
        success: false,
        error: 'No hay número de admisión. Registre primero el ingreso / admisión.',
      };
    }

    const existing = await prisma.medicalRecord.findUnique({
      where: { admissionNumber },
      select: { id: true, clinicalHistoryNumber: true },
    });
    if (existing) {
      return {
        success: false,
        error: `La admisión ${admissionNumber} ya fue usada en la historia clínica ${toPlainSequenceNumber(existing.clinicalHistoryNumber)}. No se puede crear otra HC con la misma admisión.`,
        admissionNumber,
        clinicalHistoryNumber: toPlainSequenceNumber(existing.clinicalHistoryNumber),
        medicalRecordId: existing.id,
        alreadyUsed: true as const,
      };
    }

    const clinicalHistoryNumber =
      toPlainSequenceNumber(await generateClinicalHistoryNumber()) || '1';

    const created = await prisma.medicalRecord.create({
      data: {
        patientId: formData.patientId,
        admissionId: formData.admissionId || null,
        admissionNumber,
        clinicalHistoryNumber,
        consultationReason: optText(formData.consultationReason),
        medicalHistory: optText(formData.medicalHistory),
        surgicalHistory: optText(formData.surgicalHistory),
        familyHistory: optText(formData.familyHistory),
        habits: optText(formData.habits),
        currentIllnessHistory: optText(formData.currentIllnessHistory),
        bloodPressure: optText(formData.bloodPressure),
        heartRate: optText(formData.heartRate),
        temperature: optText(formData.temperature),
        oxygenSaturation: optText(formData.oxygenSaturation),
        physicalExam: optText(formData.physicalExam),
        diagnosis: optText(formData.diagnosis),
        medications: optText(formData.medications),
        complementaryStudies: optText(formData.complementaryStudies),
        recommendations: optText(formData.recommendations),
        evolution: optText(formData.evolution),
        currentStatus: optText(formData.diagnosis) || 'En atención',
        professionalName: optText(formData.professionalName),
        professionalLicense: optText(formData.professionalLicense),
        patientName: optText(formData.patientName),
        patientAge: formData.patientAge || null,
        patientGender: normalizeGenderToEs(formData.patientGender) || null,
        patientIdentification: optText(formData.patientIdentification),
        patientAddress: optText(formData.patientAddress),
        patientPhone: optText(formData.patientPhone),
        patientEmail: optText(formData.patientEmail),
        patientOccupation: optText(formData.patientOccupation),
        patientInsurance: optText(formData.patientInsurance),
      },
    });

    // Diagnóstico estructurado (si hay texto)
    if (formData.diagnosis?.trim() && typeof prisma.diagnosis !== 'undefined') {
      try {
        await prisma.diagnosis.create({
          data: {
            medicalRecordId: created.id,
            code: 'SIN-CODIGO',
            description: formData.diagnosis.trim(),
            physician: formData.professionalName?.trim() || 'Sin profesional',
          },
        });
      } catch (diagErr) {
        console.warn('createMedicalRecord diagnosis:', diagErr);
      }
    }

    // Tratamiento / medicamentos
    if (formData.medications?.trim() && typeof prisma.treatment !== 'undefined') {
      try {
        await prisma.treatment.create({
          data: {
            medicalRecordId: created.id,
            procedure: 'Plan farmacológico',
            medication: formData.medications.trim(),
            dosage: null,
            physician: formData.professionalName?.trim() || 'Sin profesional',
          },
        });
      } catch (txErr) {
        console.warn('createMedicalRecord treatment:', txErr);
      }
    }

    const plain = serializeMedicalRecord(created);
    return {
      success: true,
      medicalRecord: plain,
      admissionNumber: plain.admissionNumber,
      clinicalHistoryNumber: plain.clinicalHistoryNumber,
    };
  } catch (error: any) {
    console.error('createMedicalRecord:', error);
    if (error?.code === 'P2002') {
      return {
        success: false,
        error:
          'Ya existe una historia con ese número de admisión o de historia clínica.',
        admissionNumber: toPlainSequenceNumber(formData.admissionNumber),
      };
    }
    const msg = error?.message || 'Error al guardar la historia clínica';
    if (msg.includes('does not exist') || msg.includes('no existe')) {
      return {
        success: false,
        error:
          'La tabla de historias clínicas no está lista en la BD de la institución. Intente de nuevo.',
      };
    }
    return { success: false, error: msg };
  }
}

/** Busca HC por número de admisión (1 admisión = 1 HC). */
export async function getMedicalRecordByAdmissionNumber(
  admissionNumber: string | number
) {
  const plain = toPlainSequenceNumber(admissionNumber);
  if (!plain) return null;

  const session = await getServerSession(authOptions);
  const entityId =
    (session?.user as { entityId?: string | null } | undefined)?.entityId || null;
  if (entityId) {
    await ensureEntityIncrementalTables(entityId);
  }

  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.medicalRecord === 'undefined') return null;
  try {
    const row = await prisma.medicalRecord.findUnique({
      where: { admissionNumber: plain },
    });
    return row ? serializeMedicalRecord(row) : null;
  } catch (error) {
    console.error('getMedicalRecordByAdmissionNumber:', error);
    return null;
  }
}

export async function getMedicalRecordById(id: string) {
  const cleaned = id?.trim();
  if (!cleaned) return null;

  const session = await getServerSession(authOptions);
  const entityId =
    (session?.user as { entityId?: string | null } | undefined)?.entityId || null;
  if (entityId) {
    await ensureEntityIncrementalTables(entityId);
  }

  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.medicalRecord === 'undefined') return null;
  try {
    // Sin diagnoses/treatments: esas tablas pueden no existir aún en el tenant
    const row = await prisma.medicalRecord.findUnique({
      where: { id: cleaned },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            documentNumber: true,
            age: true,
            gender: true,
            address: true,
            mobilePhone: true,
            email: true,
            occupation: true,
            insuranceProvider: true,
          },
        },
      },
    });
    if (!row) return null;

    const plain = serializeMedicalRecord(row);
    // Completar snapshot vacío con datos del paciente vinculado
    if (row.patient) {
      const p = row.patient;
      if (!plain.patientName) {
        plain.patientName = `${p.firstName || ''} ${p.lastName || ''}`.trim();
      }
      if (!plain.patientIdentification) {
        plain.patientIdentification = p.documentNumber || '';
      }
      if (!plain.patientAge && p.age != null) plain.patientAge = p.age;
      if (!plain.patientGender && p.gender) {
        plain.patientGender = normalizeGenderToEs(p.gender) || p.gender;
      }
      if (!plain.patientAddress) plain.patientAddress = p.address || '';
      if (!plain.patientPhone) plain.patientPhone = p.mobilePhone || '';
      if (!plain.patientEmail) plain.patientEmail = p.email || '';
      if (!plain.patientOccupation) plain.patientOccupation = p.occupation || '';
      if (!plain.patientInsurance) {
        plain.patientInsurance = p.insuranceProvider || '';
      }
    }
    return plain;
  } catch (error) {
    console.error('getMedicalRecordById:', error);
    // Reintento mínimo sin include (por si falla la relación)
    try {
      const row = await prisma.medicalRecord.findUnique({
        where: { id: cleaned },
      });
      return row ? serializeMedicalRecord(row) : null;
    } catch (fallbackErr) {
      console.error('getMedicalRecordById fallback:', fallbackErr);
      return null;
    }
  }
}

export async function updateMedicalRecord(
  id: string,
  formData: Partial<MedicalRecordFormData>
) {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.medicalRecord === 'undefined') {
    return { success: false, error: 'Base de datos no disponible' };
  }

  try {
    const updated = await prisma.medicalRecord.update({
      where: { id },
      data: {
        ...(formData.consultationReason !== undefined
          ? { consultationReason: optText(formData.consultationReason) }
          : {}),
        ...(formData.medicalHistory !== undefined
          ? { medicalHistory: optText(formData.medicalHistory) }
          : {}),
        ...(formData.surgicalHistory !== undefined
          ? { surgicalHistory: optText(formData.surgicalHistory) }
          : {}),
        ...(formData.familyHistory !== undefined
          ? { familyHistory: optText(formData.familyHistory) }
          : {}),
        ...(formData.habits !== undefined ? { habits: optText(formData.habits) } : {}),
        ...(formData.currentIllnessHistory !== undefined
          ? { currentIllnessHistory: optText(formData.currentIllnessHistory) }
          : {}),
        ...(formData.bloodPressure !== undefined
          ? { bloodPressure: optText(formData.bloodPressure) }
          : {}),
        ...(formData.heartRate !== undefined
          ? { heartRate: optText(formData.heartRate) }
          : {}),
        ...(formData.temperature !== undefined
          ? { temperature: optText(formData.temperature) }
          : {}),
        ...(formData.oxygenSaturation !== undefined
          ? { oxygenSaturation: optText(formData.oxygenSaturation) }
          : {}),
        ...(formData.physicalExam !== undefined
          ? { physicalExam: optText(formData.physicalExam) }
          : {}),
        ...(formData.diagnosis !== undefined
          ? {
              diagnosis: optText(formData.diagnosis),
              currentStatus: optText(formData.diagnosis) || 'En atención',
            }
          : {}),
        ...(formData.medications !== undefined
          ? { medications: optText(formData.medications) }
          : {}),
        ...(formData.complementaryStudies !== undefined
          ? { complementaryStudies: optText(formData.complementaryStudies) }
          : {}),
        ...(formData.recommendations !== undefined
          ? { recommendations: optText(formData.recommendations) }
          : {}),
        ...(formData.evolution !== undefined
          ? { evolution: optText(formData.evolution) }
          : {}),
        ...(formData.professionalName !== undefined
          ? { professionalName: optText(formData.professionalName) }
          : {}),
        ...(formData.professionalLicense !== undefined
          ? { professionalLicense: optText(formData.professionalLicense) }
          : {}),
      },
    });
    return { success: true, medicalRecord: serializeMedicalRecord(updated) };
  } catch (error: any) {
    console.error('updateMedicalRecord:', error);
    return { success: false, error: error?.message || 'Error al actualizar' };
  }
}

export async function getMedicalRecordsByPatientId(patientId: string) {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.medicalRecord === 'undefined') return [];
  try {
    const rows = await prisma.medicalRecord.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(serializeMedicalRecord);
  } catch (error) {
    console.error('getMedicalRecordsByPatientId:', error);
    return [];
  }
}

export async function getAllMedicalRecords() {
  const session = await getServerSession(authOptions);
  const entityId =
    (session?.user as { entityId?: string | null } | undefined)?.entityId || null;
  if (entityId) {
    await ensureEntityIncrementalTables(entityId);
  }

  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.medicalRecord === 'undefined') return [];
  try {
    const rows = await prisma.medicalRecord.findMany({
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            documentNumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return rows.map((row) => ({
      ...serializeMedicalRecord(row),
      patient: row.patient
        ? {
            id: row.patient.id,
            firstName: row.patient.firstName,
            lastName: row.patient.lastName,
            documentNumber: row.patient.documentNumber,
          }
        : null,
    }));
  } catch (error) {
    console.error('getAllMedicalRecords:', error);
    return [];
  }
}

/**
 * Busca historias por número de admisión o número de documento.
 * También acepta número de HC (solo dígitos).
 */
export async function searchMedicalRecordsByAdmissionOrDocument(query: string) {
  const cleaned = query?.trim().replace(/^#+\s*/, '') || '';
  if (!cleaned) {
    return { success: false as const, data: [], error: 'Escriba número de admisión o documento' };
  }

  const session = await getServerSession(authOptions);
  const entityId =
    (session?.user as { entityId?: string | null } | undefined)?.entityId || null;
  if (entityId) {
    await ensureEntityIncrementalTables(entityId);
  }

  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.medicalRecord === 'undefined') {
    return { success: false as const, data: [], error: 'Base de datos no disponible' };
  }

  try {
    const plain = toPlainSequenceNumber(cleaned) || cleaned;
    const digitsOnly = /^\d+$/.test(cleaned.replace(/\s+/g, ''));
    const docQuery = cleaned.replace(/\s+/g, '');

    // Admisión / HC exactos + documento (snapshot o paciente vinculado)
    const orFilters: any[] = [
      { admissionNumber: plain },
      { clinicalHistoryNumber: plain },
      {
        patientIdentification: {
          contains: docQuery,
        },
      },
      {
        patient: {
          is: {
            documentNumber: {
              contains: docQuery,
            },
          },
        },
      },
    ];

    if (digitsOnly && plain !== cleaned) {
      orFilters.push(
        { admissionNumber: cleaned },
        { clinicalHistoryNumber: cleaned }
      );
    }

    const rows = await prisma.medicalRecord.findMany({
      where: { OR: orFilters },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            documentNumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return {
      success: true as const,
      data: rows.map((row) => ({
        ...serializeMedicalRecord(row),
        patient: row.patient
          ? {
              id: row.patient.id,
              firstName: row.patient.firstName,
              lastName: row.patient.lastName,
              documentNumber: row.patient.documentNumber,
            }
          : null,
      })),
    };
  } catch (error: any) {
    console.error('searchMedicalRecordsByAdmissionOrDocument:', error);
    // Fallback sin filtros de snapshot (clientes Prisma desactualizados)
    try {
      const plain = toPlainSequenceNumber(cleaned) || cleaned;
      const docQuery = cleaned.replace(/\s+/g, '');
      const rows = await prisma.medicalRecord.findMany({
        where: {
          OR: [
            { admissionNumber: plain },
            { clinicalHistoryNumber: plain },
            {
              patient: {
                is: {
                  documentNumber: {
                    contains: docQuery,
                  },
                },
              },
            },
          ],
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              documentNumber: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      return {
        success: true as const,
        data: rows.map((row) => ({
          ...serializeMedicalRecord(row),
          patient: row.patient
            ? {
                id: row.patient.id,
                firstName: row.patient.firstName,
                lastName: row.patient.lastName,
                documentNumber: row.patient.documentNumber,
              }
            : null,
        })),
      };
    } catch (fallbackErr: any) {
      console.error('searchMedicalRecords fallback:', fallbackErr);
      return {
        success: false as const,
        data: [],
        error:
          fallbackErr?.message ||
          error?.message ||
          'Error al buscar historias. Reinicie el servidor (prisma generate).',
      };
    }
  }
}
