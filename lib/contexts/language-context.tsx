'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Forzar español como único idioma
  const [locale, setLocale] = React.useState('es');

  // Función de traducción simple (puede expandirse con un sistema de traducciones)
  const t = (key: string, params?: Record<string, any>): string => {
    // Por ahora retorna la clave, pero aquí se puede implementar un sistema de traducciones
    let translation = key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, String(value));
      });
    }
    
    return translation;
  };

  // Forzar que siempre sea español
  const handleSetLocale = (newLocale: string) => {
    // Solo permitir español
    if (newLocale !== 'es') {
      console.warn('Solo se permite el idioma español en esta aplicación');
      return;
    }
    setLocale(newLocale);
  };

  const value: LanguageContextType = {
    locale,
    setLocale: handleSetLocale,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage debe ser usado dentro de un LanguageProvider');
  }
  return context;
}

// Hook para formatear fechas en español
export function useDateFormat() {
  const { locale } = useLanguage();
  
  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    });
  };

  const formatDateTime = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    });
  };

  const formatTime = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    });
  };

  return { formatDate, formatDateTime, formatTime };
}

// Hook para formatear números en español
export function useNumberFormat() {
  const { locale } = useLanguage();
  
  const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
    return number.toLocaleString('es-CO', options);
  };

  const formatCurrency = (amount: number, currency: string = 'COP'): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatPercent = (value: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  };

  return { formatNumber, formatCurrency, formatPercent };
}
