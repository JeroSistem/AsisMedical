'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ensureEntityIncrementalTables } from '@/lib/database-manager';
import { getTenantPrisma } from '@/lib/tenant-prisma';
import { getNextAdmissionNumber } from '@/lib/admission-numbers';
import { normalizeGenderToEs } from '@/lib/gender';

export interface PatientAdmissionFormData {
  patientId: string;
  admissionDate: string;
  admissionTime: string;
  priorityAttention: string;
  observation: string;
  entity: string;
  contract: string;
  absent: boolean;
  responsibleName: string;
  responsibleRelationship: string;
  responsiblePhone: string;
  companionName: string;
  companionAddress: string;
  companionPhone: string;
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

function toNumberOrNull(value?: string) {
  if (!value?.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function createPatientAdmission(formData: PatientAdmissionFormData) {
  const session = await getServerSession(authOptions);
  const entityId =
    (session?.user as { entityId?: string | null } | undefined)?.entityId || null;
  if (entityId) {
    await ensureEntityIncrementalTables(entityId);
  }

  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.patientAdmission === 'undefined') {
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

    const admissionNumber = await getNextAdmissionNumber();

    const created = await prisma.patientAdmission.create({
      data: {
        admissionNumber,
        patientId: formData.patientId,
        admissionDate: new Date(formData.admissionDate || new Date().toISOString()),
        admissionTime: formData.admissionTime || '00:00',
        priorityAttention: formData.priorityAttention || 'normal',
        observation: formData.observation || null,
        entity: formData.entity || null,
        contract: formData.contract || null,
        absent: formData.absent ?? false,
        responsibleName: formData.responsibleName || null,
        responsibleRelationship: formData.responsibleRelationship || null,
        responsiblePhone: formData.responsiblePhone || null,
        companionName: formData.companionName || null,
        companionAddress: formData.companionAddress || null,
        companionPhone: formData.companionPhone || null,
        bloodPressure: formData.bloodPressure || null,
        respiratoryRate: formData.respiratoryRate || null,
        temperature: formData.temperature || null,
        heartRate: formData.heartRate || null,
        height: toNumberOrNull(formData.height),
        weight: toNumberOrNull(formData.weight),
        bmi: toNumberOrNull(formData.bmi),
        bsa: toNumberOrNull(formData.bsa),
        oxygenSaturation: formData.oxygenSaturation || null,
        status: 'ACTIVE',
      },
      include: {
        patient: true,
      },
    });

    if (typeof prisma.triage !== 'undefined') {
      try {
        const urgencyMap: Record<string, string> = {
          normal: 'POCO_URGENTE',
          urgent: 'URGENTE',
          emergency: 'MUY_URGENTE',
          critical: 'RESUCITACION',
        };
        await prisma.triage.create({
          data: {
            patientId: formData.patientId,
            arrivalTime: new Date(
              `${formData.admissionDate}T${(formData.admissionTime || '00:00').slice(0, 5)}:00`
            ),
            urgencyLevel: urgencyMap[formData.priorityAttention] || 'URGENTE',
            notes: formData.observation || null,
            vitalSigns: {
              bloodPressure: formData.bloodPressure || '',
              respiratoryRate: formData.respiratoryRate || '',
              temperature: formData.temperature || '',
              heartRate: formData.heartRate || '',
              oxygenSaturation: formData.oxygenSaturation || '',
              height: formData.height || '',
              weight: formData.weight || '',
              bmi: formData.bmi || '',
              admissionId: created.id,
              admissionNumber: created.admissionNumber,
            },
          },
        });
      } catch (triageErr) {
        // La admisión ya quedó guardada; triage es complementario
        console.warn('createPatientAdmission triage:', triageErr);
      }
    }

    return { success: true, admission: created, admissionNumber: created.admissionNumber };
  } catch (error: any) {
    console.error('createPatientAdmission:', error);
    const msg = error?.message || 'Error al registrar el ingreso';
    if (msg.includes('does not exist') || msg.includes('no existe')) {
      return {
        success: false,
        error:
          'La tabla de admisiones no está disponible en la BD de la institución. Contacte al administrador.',
      };
    }
    return { success: false, error: msg };
  }
}

export async function getPatientAdmissions() {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.patientAdmission === 'undefined') return [];

  try {
    return await prisma.patientAdmission.findMany({
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            secondLastName: true,
            documentNumber: true,
            documentType: true,
            age: true,
            gender: true,
            mobilePhone: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  } catch (error) {
    console.error('getPatientAdmissions:', error);
    return [];
  }
}

function serializeAdmissionRow(a: any) {
  const p = a?.patient;
  return {
    id: a.id,
    admissionNumber: a.admissionNumber,
    admissionDate:
      a.admissionDate instanceof Date
        ? a.admissionDate.toISOString()
        : a.admissionDate
          ? String(a.admissionDate)
          : null,
    admissionTime: a.admissionTime || null,
    status: a.status || 'ACTIVE',
    priorityAttention: a.priorityAttention || null,
    observation: a.observation || null,
    bloodPressure: a.bloodPressure || null,
    heartRate: a.heartRate || null,
    temperature: a.temperature || null,
    oxygenSaturation: a.oxygenSaturation || null,
    patient: p
      ? {
          id: p.id,
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          secondLastName: p.secondLastName || '',
          documentType: p.documentType || '',
          documentNumber: p.documentNumber || '',
          age: p.age ?? 0,
          gender: normalizeGenderToEs(p.gender) || p.gender || '',
          address: p.address || '',
          mobilePhone: p.mobilePhone || '',
          email: p.email || '',
          occupation: p.occupation || '',
          insuranceProvider: p.insuranceProvider || '',
        }
      : null,
  };
}

/**
 * Busca ingresos por:
 * - número de admisión (ej. 1 o #1)
 * - número de documento del paciente
 * - nombre / apellido
 */
export async function searchAdmissionsByQuery(query: string) {
  const cleaned = query?.trim().replace(/^#+\s*/, '');
  if (!cleaned) {
    return {
      found: false as const,
      admissions: [] as ReturnType<typeof serializeAdmissionRow>[],
      error: 'Escriba número de admisión o documento',
    };
  }

  try {
    const prisma = await getTenantPrisma();
    if (!prisma || typeof prisma.patientAdmission === 'undefined') {
      return {
        found: false as const,
        admissions: [],
        error: 'Base de datos no disponible',
      };
    }

    const asNumber = Number(cleaned);
    const isAdmissionNumber =
      /^\d+$/.test(cleaned) && Number.isFinite(asNumber) && asNumber > 0;

    // 1) Coincidencia exacta por número de admisión
    if (isAdmissionNumber) {
      const byNumber = await prisma.patientAdmission.findFirst({
        where: { admissionNumber: asNumber },
        include: { patient: true },
      });
      if (byNumber) {
        const row = serializeAdmissionRow(byNumber);
        return {
          found: true as const,
          admissions: [row],
          admission: row,
        };
      }
    }

    // 2) Por documento (también si es numérico corto) y/o nombre
    const orPatient: Array<Record<string, unknown>> = [
      { documentNumber: { contains: cleaned } },
      { documentNumber: { equals: cleaned } },
    ];
    if (!/^\d+$/.test(cleaned) || cleaned.length >= 3) {
      orPatient.push(
        { firstName: { contains: cleaned } },
        { lastName: { contains: cleaned } },
        { secondLastName: { contains: cleaned } }
      );
    }

    const admissions = await prisma.patientAdmission.findMany({
      where: { patient: { OR: orPatient } },
      include: { patient: true },
      orderBy: [{ admissionNumber: 'desc' }],
      take: 20,
    });

    if (!admissions.length) {
      return { found: false as const, admissions: [] };
    }

    const rows = admissions.map(serializeAdmissionRow);
    return { found: true as const, admissions: rows, admission: rows[0] };
  } catch (error: any) {
    console.error('searchAdmissionsByQuery:', error);
    return {
      found: false as const,
      admissions: [],
      error: error?.message || 'Error al buscar ingresos',
    };
  }
}

export async function getPatientAdmissionById(id: string) {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.patientAdmission === 'undefined') return null;

  try {
    const row = await prisma.patientAdmission.findUnique({
      where: { id },
      include: { patient: true },
    });
    return row ? serializeAdmissionRow(row) : null;
  } catch (error) {
    console.error('getPatientAdmissionById:', error);
    return null;
  }
}

export async function updatePatientAdmission(
  id: string,
  formData: Partial<PatientAdmissionFormData>
) {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.patientAdmission === 'undefined') {
    return { success: false, error: 'Base de datos no disponible' };
  }

  try {
    const updated = await prisma.patientAdmission.update({
      where: { id },
      data: {
        ...(formData.admissionDate
          ? { admissionDate: new Date(formData.admissionDate) }
          : {}),
        ...(formData.admissionTime !== undefined
          ? { admissionTime: formData.admissionTime }
          : {}),
        ...(formData.priorityAttention !== undefined
          ? { priorityAttention: formData.priorityAttention }
          : {}),
        ...(formData.observation !== undefined
          ? { observation: formData.observation || null }
          : {}),
        ...(formData.entity !== undefined ? { entity: formData.entity || null } : {}),
        ...(formData.contract !== undefined ? { contract: formData.contract || null } : {}),
        ...(formData.absent !== undefined ? { absent: formData.absent } : {}),
      },
    });
    return { success: true, admission: updated };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Error al actualizar ingreso' };
  }
}

export async function deletePatientAdmission(id: string) {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.patientAdmission === 'undefined') {
    return { success: false, error: 'Base de datos no disponible' };
  }

  try {
    await prisma.patientAdmission.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Error al eliminar ingreso' };
  }
}
