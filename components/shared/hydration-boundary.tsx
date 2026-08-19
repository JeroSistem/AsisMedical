'use client';

import React, { Component, ReactNode } from 'react';

interface HydrationBoundaryState {
  hasError: boolean;
  isClient: boolean;
}

interface HydrationBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class HydrationBoundary extends Component<HydrationBoundaryProps, HydrationBoundaryState> {
  constructor(props: HydrationBoundaryProps) {
    super(props);
    this.state = { hasError: false, isClient: false };
  }

  static getDerivedStateFromError(error: Error): HydrationBoundaryState {
    // Verificar si es un error de hidratación
    if (error.message && (
      error.message.includes('hydrat') ||
      error.message.includes('hydration') ||
      error.message.includes('server rendered HTML') ||
      error.message.includes('client properties')
    )) {
      console.warn('Error de hidratación detectado y manejado:', error.message);
      return { hasError: true, isClient: true };
    }
    
    // Para otros errores, no manejarlos aquí
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Solo manejar errores de hidratación
    if (error.message && (
      error.message.includes('hydrat') ||
      error.message.includes('hydration') ||
      error.message.includes('server rendered HTML') ||
      error.message.includes('client properties')
    )) {
      console.warn('Error de hidratación capturado:', error, errorInfo);
      // No re-lanzar el error para errores de hidratación
    } else {
      // Re-lanzar otros errores
      throw error;
    }
  }

  componentDidMount() {
    this.setState({ isClient: true });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }

    if (!this.state.isClient) {
      return this.props.fallback || null;
    }

    return (
      <div suppressHydrationWarning>
        {this.props.children}
      </div>
    );
  }
}

// Hook para detectar si estamos en el cliente
export function useIsClient() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

// Componente funcional que usa el hook
export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const isClient = useIsClient();

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <div suppressHydrationWarning>{children}</div>;
}
