'use server';

import { getTenantPrisma } from '@/lib/tenant-prisma';

export interface TriageAssessmentFormData {
  patientId: string;
  arrivalTime: string;
  assessmentDate: string;
  assessmentTime: string;
  bloodPressure: string;
  heartRate: string;
  respiratoryRate: string;
  temperature: string;
  oxygenSaturation: string;
  painLevel: number;
  eyeOpening: number;
  verbalResponse: number;
  motorResponse: number;
  glasgowTotal: number;
  painLocation: string;
  painCharacter: string;
  painIntensity: number;
  painDuration: string;
  mainSymptom: string;
  symptomDuration: string;
  associatedSymptoms: string;
  riskFactors: string[];
  urgencyLevel: string;
  triageCategory: string;
  estimatedWaitTime: string;
  observations: string;
  recommendations: string;
  professionalName: string;
  professionalLicense: string;
  admissionId?: string;
  admissionNumber?: number | string;
}

function toIntOrNull(value?: string | number | null) {
  if (value === '' || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : null;
}

function toFloatOrNull(value?: string | number | null) {
  if (value === '' || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function createTriageAssessment(formData: TriageAssessmentFormData) {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.triageAssessment === 'undefined') {
    return { success: false, error: 'Base de datos no disponible' };
  }

  if (!formData.patientId) {
    return { success: false, error: 'Debe indicar un paciente' };
  }

  if (!formData.urgencyLevel || !formData.triageCategory) {
    return { success: false, error: 'Debe indicar el nivel de urgencia' };
  }

  try {
    const assessmentDate = formData.assessmentDate
      ? new Date(`${formData.assessmentDate}T12:00:00`)
      : new Date();

    const created = await prisma.triageAssessment.create({
      data: {
        patientId: formData.patientId,
        arrivalTime: formData.arrivalTime || '',
        assessmentDate,
        assessmentTime: formData.assessmentTime || '',
        bloodPressure: formData.bloodPressure || null,
        heartRate: toIntOrNull(formData.heartRate),
        respiratoryRate: toIntOrNull(formData.respiratoryRate),
        temperature: toFloatOrNull(formData.temperature),
        oxygenSaturation: toIntOrNull(formData.oxygenSaturation),
        painLevel: formData.painLevel ?? 0,
        eyeOpening: formData.eyeOpening ?? 4,
        verbalResponse: formData.verbalResponse ?? 5,
        motorResponse: formData.motorResponse ?? 6,
        glasgowTotal: formData.glasgowTotal ?? 15,
        painLocation: formData.painLocation || null,
        painCharacter: formData.painCharacter || null,
        painIntensity: formData.painIntensity ?? 0,
        painDuration: formData.painDuration || null,
        mainSymptom: formData.mainSymptom || null,
        symptomDuration: formData.symptomDuration || null,
        associatedSymptoms: formData.associatedSymptoms || null,
        riskFactors: formData.riskFactors || [],
        urgencyLevel: formData.urgencyLevel,
        triageCategory: formData.triageCategory,
        estimatedWaitTime: formData.estimatedWaitTime || '',
        observations: formData.observations || null,
        recommendations: formData.recommendations || null,
        professionalName: formData.professionalName || null,
        professionalLicense: formData.professionalLicense || null,
        status: 'ACTIVE',
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
    });

    // Actualiza o crea registro en cola de triage
    if (typeof prisma.triage !== 'undefined') {
      const notes = [
        formData.observations,
        formData.mainSymptom ? `Síntoma: ${formData.mainSymptom}` : null,
        formData.admissionNumber != null
          ? `Admisión ${formData.admissionNumber}`
          : null,
        `Valoración: ${created.id}`,
      ]
        .filter(Boolean)
        .join(' · ');

      const vitalSigns = {
        bloodPressure: formData.bloodPressure || '',
        heartRate: formData.heartRate || '',
        respiratoryRate: formData.respiratoryRate || '',
        temperature: formData.temperature || '',
        oxygenSaturation: formData.oxygenSaturation || '',
        glasgowTotal: formData.glasgowTotal,
        painIntensity: formData.painIntensity,
        assessmentId: created.id,
        admissionId: formData.admissionId || null,
        admissionNumber:
          formData.admissionNumber != null
            ? Number(formData.admissionNumber)
            : null,
      };

      const existing = await prisma.triage.findFirst({
        where: { patientId: formData.patientId },
        orderBy: { createdAt: 'desc' },
      });

      if (existing) {
        await prisma.triage.update({
          where: { id: existing.id },
          data: {
            urgencyLevel: formData.urgencyLevel,
            painLevel: formData.painIntensity ?? formData.painLevel ?? null,
            consciousnessLevel: `Glasgow ${formData.glasgowTotal}`,
            vitalSigns,
            notes: notes || existing.notes,
          },
        });
      } else {
        await prisma.triage.create({
          data: {
            patientId: formData.patientId,
            arrivalTime: new Date(),
            urgencyLevel: formData.urgencyLevel,
            painLevel: formData.painIntensity ?? formData.painLevel ?? null,
            consciousnessLevel: `Glasgow ${formData.glasgowTotal}`,
            vitalSigns,
            notes: notes || null,
          },
        });
      }
    }

    return { success: true, assessment: created, id: created.id };
  } catch (error: any) {
    console.error('createTriageAssessment:', error);
    return {
      success: false,
      error: error?.message || 'Error al registrar la valoración de triage',
    };
  }
}

export async function getTriageAssessments() {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.triageAssessment === 'undefined') return [];

  try {
    return await prisma.triageAssessment.findMany({
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            documentNumber: true,
            documentType: true,
            age: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  } catch (error) {
    console.error('getTriageAssessments:', error);
    return [];
  }
}

export async function getTriageAssessmentById(id: string) {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.triageAssessment === 'undefined') return null;

  try {
    return await prisma.triageAssessment.findUnique({
      where: { id },
      include: { patient: true },
    });
  } catch (error) {
    console.error('getTriageAssessmentById:', error);
    return null;
  }
}

export async function updateTriageAssessment(
  id: string,
  formData: Partial<TriageAssessmentFormData>
) {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.triageAssessment === 'undefined') {
    return { success: false, error: 'Base de datos no disponible' };
  }

  try {
    const updated = await prisma.triageAssessment.update({
      where: { id },
      data: {
        ...(formData.bloodPressure !== undefined
          ? { bloodPressure: formData.bloodPressure || null }
          : {}),
        ...(formData.heartRate !== undefined
          ? { heartRate: toIntOrNull(formData.heartRate) }
          : {}),
        ...(formData.respiratoryRate !== undefined
          ? { respiratoryRate: toIntOrNull(formData.respiratoryRate) }
          : {}),
        ...(formData.temperature !== undefined
          ? { temperature: toFloatOrNull(formData.temperature) }
          : {}),
        ...(formData.oxygenSaturation !== undefined
          ? { oxygenSaturation: toIntOrNull(formData.oxygenSaturation) }
          : {}),
        ...(formData.urgencyLevel !== undefined
          ? { urgencyLevel: formData.urgencyLevel }
          : {}),
        ...(formData.triageCategory !== undefined
          ? { triageCategory: formData.triageCategory }
          : {}),
        ...(formData.observations !== undefined
          ? { observations: formData.observations || null }
          : {}),
        ...(formData.recommendations !== undefined
          ? { recommendations: formData.recommendations || null }
          : {}),
        ...(formData.mainSymptom !== undefined
          ? { mainSymptom: formData.mainSymptom || null }
          : {}),
        ...(formData.glasgowTotal !== undefined
          ? { glasgowTotal: formData.glasgowTotal }
          : {}),
        ...(formData.painIntensity !== undefined
          ? { painIntensity: formData.painIntensity }
          : {}),
        ...(formData.riskFactors !== undefined
          ? { riskFactors: formData.riskFactors }
          : {}),
      },
    });
    return { success: true, assessment: updated };
  } catch (error: any) {
    console.error('updateTriageAssessment:', error);
    return {
      success: false,
      error: error?.message || 'Error al actualizar la valoración',
    };
  }
}

export async function deleteTriageAssessment(id: string) {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.triageAssessment === 'undefined') {
    return { success: false, error: 'Base de datos no disponible' };
  }

  try {
    await prisma.triageAssessment.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    console.error('deleteTriageAssessment:', error);
    return {
      success: false,
      error: error?.message || 'Error al eliminar la valoración',
    };
  }
}
