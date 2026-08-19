'use client';

import React, { useEffect, useState, useRef } from 'react';

interface SafeHydrationProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SafeHydration({ children, fallback = null }: SafeHydrationProps) {
  const [mounted, setMounted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const errorBoundaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Limpiar atributos de extensiones del navegador
    const cleanupExtensionAttributes = () => {
      const extensionAttrs = [
        'bis_skin_checked',
        'bis_register', 
        '__processed_',
        'data-bis_skin_checked',
        'data-bis_register'
      ];
      
      extensionAttrs.forEach(attr => {
        const elements = document.querySelectorAll(`[${attr}]`);
        elements.forEach(el => {
          if (el.hasAttribute(attr)) {
            el.removeAttribute(attr);
          }
        });
      });
    };

    // Ejecutar limpieza inmediatamente
    cleanupExtensionAttributes();

    // Configurar observador para limpiar atributos futuros
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const target = mutation.target as Element;
          if (target && target.nodeType === 1) {
            const extensionAttrs = [
              'bis_skin_checked',
              'bis_register',
              '__processed_',
              'data-bis_skin_checked',
              'data-bis_register'
            ];
            
            extensionAttrs.forEach(attr => {
              if (target.hasAttribute(attr)) {
                target.removeAttribute(attr);
              }
            });
          }
        }
      });
    });

    // Observar cambios en el DOM
    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: [
          'bis_skin_checked',
          'bis_register',
          '__processed_',
          'data-bis_skin_checked',
          'data-bis_register'
        ]
      });
    }

    // Manejar errores de hidratación globalmente
    const handleHydrationError = (event: ErrorEvent) => {
      if (event.error && event.error.message && 
          event.error.message.includes('hydrat')) {
        console.warn('Error de hidratación detectado y manejado:', event.error.message);
        setHasError(true);
        event.preventDefault();
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && event.reason.message && 
          event.reason.message.includes('hydrat')) {
        console.warn('Error de hidratación en Promise detectado y manejado:', event.reason.message);
        setHasError(true);
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleHydrationError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      observer.disconnect();
      window.removeEventListener('error', handleHydrationError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Si hay error de hidratación, mostrar fallback
  if (hasError) {
    return <>{fallback}</>;
  }

  // Si no está montado, mostrar fallback
  if (!mounted) {
    return <>{fallback}</>;
  }

  return (
    <div ref={errorBoundaryRef} suppressHydrationWarning>
      {children}
    </div>
  );
}

// Componente para elementos que pueden causar problemas de hidratación
export function HydrationSafeElement({ 
  children, 
  as: Component = 'div',
  ...props 
}: {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  [key: string]: any;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Component {...props} suppressHydrationWarning />;
  }

  return <Component {...props}>{children}</Component>;
}
