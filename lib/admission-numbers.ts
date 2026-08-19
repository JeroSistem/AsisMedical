import 'server-only';

import { getTenantPrisma } from '@/lib/tenant-prisma';

/** Solo dígitos: "#1", "HC-1", " 01 " → "1" */
export function toPlainSequenceNumber(
  value: string | number | null | undefined
): string {
  if (value == null || value === '') return '';
  const digits = String(value).replace(/\D/g, '');
  if (!digits) return '';
  // Quita ceros a la izquierda, pero conserva "0" si fuera el caso
  const n = Number(digits);
  return Number.isFinite(n) ? String(n) : digits;
}

/**
 * Número de admisión secuencial por institución: 1, 2, 3, ...
 */
export async function generateAdmissionNumber(): Promise<string> {
  try {
    const prisma = await getTenantPrisma();
    if (prisma && typeof prisma.patientAdmission !== 'undefined') {
      const last = await prisma.patientAdmission.aggregate({
        _max: { admissionNumber: true },
      });
      const next = (last._max.admissionNumber || 0) + 1;
      return String(next);
    }
  } catch {
    // fallback abajo
  }
  return '1';
}

/**
 * Número de historia clínica secuencial por institución: 1, 2, 3, ...
 * Sin prefijos ni símbolos.
 */
export async function generateClinicalHistoryNumber(): Promise<string> {
  try {
    const prisma = await getTenantPrisma();
    if (prisma && typeof prisma.medicalRecord !== 'undefined') {
      const records = await prisma.medicalRecord.findMany({
        select: { clinicalHistoryNumber: true },
        take: 5000,
      });
      let max = 0;
      for (const r of records) {
        const plain = toPlainSequenceNumber(r.clinicalHistoryNumber);
        const n = Number(plain);
        if (Number.isFinite(n) && n > max) max = n;
      }
      return String(max + 1);
    }
  } catch {
    // fallback abajo
  }
  return '1';
}

/** Próximo número de admisión como entero (para PatientAdmission). */
export async function getNextAdmissionNumber(): Promise<number> {
  const prisma = await getTenantPrisma();
  if (!prisma || typeof prisma.patientAdmission === 'undefined') return 1;
  const last = await prisma.patientAdmission.aggregate({
    _max: { admissionNumber: true },
  });
  return (last._max.admissionNumber || 0) + 1;
}
