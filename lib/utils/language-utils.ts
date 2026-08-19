// Utilidades para el manejo del idioma español en la aplicación

/**
 * Configuración global del idioma
 */
export const LANGUAGE_CONFIG = {
  defaultLocale: 'es',
  availableLocales: ['es'],
  forceSpanish: true,
  dateFormat: 'es-CO',
  numberFormat: 'es-CO',
  currency: 'COP',
} as const;

/**
 * Formatea una fecha en español colombiano
 */
export function formatDateSpanish(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

/**
 * Formatea una fecha y hora en español colombiano
 */
export function formatDateTimeSpanish(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}

/**
 * Formatea solo la hora en español colombiano
 */
export function formatTimeSpanish(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  });
}

/**
 * Formatea un número en español colombiano
 */
export function formatNumberSpanish(
  number: number,
  options?: Intl.NumberFormatOptions
): string {
  return number.toLocaleString('es-CO', options);
}

/**
 * Formatea una cantidad monetaria en pesos colombianos
 */
export function formatCurrencySpanish(
  amount: number,
  currency: string = 'COP'
): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formatea un porcentaje en español colombiano
 */
export function formatPercentSpanish(
  value: number,
  decimals: number = 2
): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Obtiene el nombre del mes en español
 */
export function getMonthNameSpanish(month: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[month];
}

/**
 * Obtiene el nombre del día de la semana en español
 */
export function getDayNameSpanish(day: number): string {
  const days = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 
    'Jueves', 'Viernes', 'Sábado'
  ];
  return days[day];
}

/**
 * Formatea una fecha relativa en español (ej: "hace 2 días")
 */
export function formatRelativeDateSpanish(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - dateObj.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Hoy';
  } else if (diffDays === 1) {
    return 'Ayer';
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `Hace ${years} ${years === 1 ? 'año' : 'años'}`;
  }
}

/**
 * Valida que el idioma sea español
 */
export function validateSpanishLocale(locale: string): boolean {
  return locale === 'es' || locale.startsWith('es-');
}

/**
 * Fuerza el uso del idioma español
 */
export function forceSpanishLocale(): string {
  return 'es';
}

/**
 * Configura el idioma del navegador para español
 */
export function setBrowserLanguage(): void {
  if (typeof window !== 'undefined') {
    // Intentar establecer el idioma del navegador
    try {
      if (navigator.language && !navigator.language.startsWith('es')) {
        console.info('Configurando idioma del navegador para español');
      }
    } catch (error) {
      console.warn('No se pudo configurar el idioma del navegador:', error);
    }
  }
}
