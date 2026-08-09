'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TabEnableToggleProps {
  entityId: string | null;
  category: string;
  label: string;
  description: string;
  enabled?: boolean; // Valor controlado desde el padre
  onToggle?: (enabled: boolean) => void;
}

export function TabEnableToggle({
  entityId,
  category,
  label,
  description,
  enabled: controlledEnabled,
  onToggle,
}: TabEnableToggleProps) {
  const [internalEnabled, setInternalEnabled] = useState(true);
  const enabled = controlledEnabled !== undefined ? controlledEnabled : internalEnabled;

  // Cargar estado de activación al cambiar la entidad o categoría (solo si no es controlado)
  useEffect(() => {
    if (controlledEnabled === undefined && entityId) {
      loadEnabledState();
    } else if (entityId) {
      setInternalEnabled(true); // Por defecto activado si no hay entidad
    }
  }, [entityId, category, controlledEnabled]);

  const loadEnabledState = async () => {
    if (!entityId) return;

    try {
      const response = await fetch(
        `/api/configuracion/general?category=${category}&entityId=${entityId}`
      );
      const result = await response.json();

      if (result.success && result.data) {
        const enabledConfig = result.data.find(
          (config: any) => config.key === `${category}.enabled` || config.key === 'enabled'
        );
        if (enabledConfig !== undefined) {
          const newEnabled = enabledConfig.value === true;
          setInternalEnabled(newEnabled);
          onToggle?.(newEnabled); // Sincronizar con el padre
        }
      }
    } catch (error) {
      console.error(`Error cargando estado de ${category}:`, error);
    }
  };

  const handleToggle = async (newEnabled: boolean) => {
    if (controlledEnabled === undefined) {
      setInternalEnabled(newEnabled);
    }
    onToggle?.(newEnabled);

    // Guardar el estado inmediatamente
    if (entityId) {
      try {
        await fetch('/api/configuracion/general', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            configs: {
              [`${category}.enabled`]: newEnabled,
            },
            category: category,
            entityId: entityId,
          }),
        });
      } catch (error) {
        console.error(`Error guardando estado de ${category}:`, error);
      }
    }
  };

  if (!entityId) {
    return null;
  }

  return (
    <Card className="border-2">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base font-semibold">
              {enabled ? `${label} Activado` : `${label} Desactivado`}
            </Label>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={enabled ? 'default' : 'secondary'} className="text-sm">
              {enabled ? 'Activo' : 'Inactivo'}
            </Badge>
            <Switch checked={enabled} onCheckedChange={handleToggle} className="scale-125" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TabContentWrapperProps {
  entityId: string | null;
  category: string;
  label: string;
  description: string;
  enabled: boolean;
  children: React.ReactNode;
}

export function TabContentWrapper({
  entityId,
  category,
  label,
  description,
  enabled,
  children,
}: TabContentWrapperProps) {
  if (!entityId) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>Selecciona una institución para comenzar a configurar sus datos.</p>
        </CardContent>
      </Card>
    );
  }

  if (!enabled) {
    return (
      <>
        <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            <strong>Configuración bloqueada:</strong> {label} está desactivado para esta institución.
            Activa la configuración en la parte superior para poder modificar los datos.
          </AlertDescription>
        </Alert>
        <div className="opacity-60 pointer-events-none">{children}</div>
      </>
    );
  }

  return <>{children}</>;
}
