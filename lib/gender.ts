/** Valores de género en español (persistidos y mostrados). */
export const GENDER_VALUES = {
  masculino: 'masculino',
  femenino: 'femenino',
  noDefinido: 'no definido',
} as const;

export type GenderEs =
  (typeof GENDER_VALUES)[keyof typeof GENDER_VALUES];

export const GENDER_OPTIONS: Array<{ value: GenderEs; label: string }> = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'no definido', label: 'No definido' },
];

/** Normaliza cualquier valor histórico (male/M/etc.) a español. */
export function normalizeGenderToEs(
  value?: string | null
): GenderEs | '' {
  if (value == null) return '';
  const v = String(value).trim().toLowerCase();
  if (!v) return '';

  if (
    v === 'masculino' ||
    v === 'male' ||
    v === 'm' ||
    v === 'hombre' ||
    v === 'h'
  ) {
    return 'masculino';
  }
  if (
    v === 'femenino' ||
    v === 'female' ||
    v === 'f' ||
    v === 'mujer'
  ) {
    return 'femenino';
  }
  if (
    v === 'no definido' ||
    v === 'nodefinido' ||
    v === 'no_definido' ||
    v === 'other' ||
    v === 'otro' ||
    v === 'i' ||
    v === 'n' ||
    v === 'x' ||
    v === 'intersexual' ||
    v === 'no especifica'
  ) {
    return 'no definido';
  }

  return 'no definido';
}

export function genderLabelEs(value?: string | null): string {
  const g = normalizeGenderToEs(value);
  if (g === 'masculino') return 'Masculino';
  if (g === 'femenino') return 'Femenino';
  if (g === 'no definido') return 'No definido';
  return '—';
}
