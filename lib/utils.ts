import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera un número de admisión único con formato: ADM-YYYYMMDD-XXXX
 * Donde XXXX es un número secuencial de 4 dígitos
 */
export async function generateAdmissionNumber(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

  // Generar una secuencia pseudoaleatoria para mantener el formato.
  const sequence = Math.floor(Math.random() * 10000);
  const timestamp = Date.now().toString().slice(-3);

  return `ADM-${dateStr}-${sequence.toString().padStart(4, '0')}-${timestamp}`;
}

/**
 * Genera un número de historia clínica único con formato: HC-YYYYMMDD-XXXX
 * Donde XXXX es un número secuencial de 4 dígitos
 */
export async function generateClinicalHistoryNumber(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

  const sequence = Math.floor(Math.random() * 10000);
  const timestamp = Date.now().toString().slice(-3);

  return `HC-${dateStr}-${sequence.toString().padStart(4, '0')}-${timestamp}`;
}
