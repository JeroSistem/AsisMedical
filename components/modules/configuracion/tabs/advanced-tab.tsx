'use client';

import React, { useState, useEffect } from 'react';
import { TabEnableToggle, TabContentWrapper } from '@/components/modules/configuracion/tab-enable-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Info, Plus, Copy, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AdvancedTabProps {
  onChange?: () => void;
  entityId?: string | null;
}

const EXISTING_API_KEYS = [
  {
    id: '1',
    name: 'Integración FHIR',
    key: 'sk_live_51abc*********************xyz',
    scope: 'fhir:read,fhir:write',
    created: '2024-01-15',
    expires: '2025-01-15',
    lastUsed: '2024-10-20',
  },
  {
    id: '2',
    name: 'API Externa Dashboard',
    key: 'sk_live_52def*********************uvw',
    scope: 'patients:read,stats:read',
    created: '2024-02-10',
    expires: '2025-02-10',
    lastUsed: '2024-10-21',
  },
];

export function AdvancedTab({ onChange, entityId }: AdvancedTabProps) {
  const [enabled, setEnabled] = useState(true);
  const [apiKeys, setApiKeys] = useState(EXISTING_API_KEYS);
  const [corsOrigins, setCorsOrigins] = useState('https://app.hospital.com\nhttps://dashboard.hospital.com');
  const [rateLimit, setRateLimit] = useState(100);
  const [newKeyDialogOpen, setNewKeyDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  // Cargar estado de activación
  useEffect(() => {
    if (entityId) {
      loadEnabledState();
    } else {
      setEnabled(true);
    }
  }, [entityId]);

  const loadEnabledState = async () => {
    if (!entityId) return;
    try {
      const response = await fetch(`/api/configuracion/general?category=advanced&entityId=${entityId}`);
      const result = await response.json();
      if (result.success && result.data) {
        const enabledConfig = result.data.find((config: any) => 
          config.key === 'advanced.enabled' || config.key === 'enabled'
        );
        if (enabledConfig) {
          setEnabled(enabledConfig.value === true);
        }
      }
    } catch (error) {
      console.error('Error cargando estado de avanzado:', error);
    }
  };

  const handleToggle = async (newEnabled: boolean) => {
    setEnabled(newEnabled);
    onChange?.();
    if (entityId) {
      try {
        await fetch('/api/configuracion/general', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            configs: { 'advanced.enabled': newEnabled },
            category: 'advanced',
            entityId: entityId,
          }),
        });
      } catch (error) {
        console.error('Error guardando estado de avanzado:', error);
      }
    }
  };

  const handleGenerateKey = () => {
    if (!enabled) return;
    // Generar clave aleatoria
    const key = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedKey(key);
    
    // Agregar a la lista
    const newKey = {
      id: String(apiKeys.length + 1),
      name: newKeyName,
      key: key.substring(0, 15) + '*********************' + key.slice(-3),
      scope: newKeyScope,
      created: new Date().toISOString().split('T')[0],
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastUsed: 'Nunca',
    };
    
    setApiKeys(prev => [...prev, newKey]);
    onChange?.();
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    alert('API Key copiada al portapapeles');
  };

  const handleRevokeKey = (keyId: string) => {
    if (confirm('¿Estás seguro de revocar esta API Key? Esta acción no se puede deshacer.')) {
      setApiKeys(prev => prev.filter(k => k.id !== keyId));
      onChange?.();
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Configuración Avanzada / API Keys</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona las claves API y configuración avanzada
          </p>
        </div>
      </div>

      {/* Toggle para activar/desactivar configuración */}
      {entityId && (
        <TabEnableToggle
          entityId={entityId}
          category="advanced"
          label="Configuración Avanzada"
          description={enabled 
            ? 'La configuración avanzada está habilitada para esta institución. Puedes modificar los campos a continuación.'
            : 'La configuración avanzada está deshabilitada para esta institución. Todos los campos están bloqueados.'}
          enabled={enabled}
          onToggle={handleToggle}
        />
      )}

      <TabContentWrapper
        entityId={entityId}
        category="advanced"
        label="Configuración Avanzada"
        description=""
        enabled={enabled}
      >

      {/* API Keys */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Claves de acceso para integraciones externas
              </CardDescription>
            </div>
            <Dialog open={newKeyDialogOpen} onOpenChange={setNewKeyDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Generar Nueva Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generar Nueva API Key</DialogTitle>
                  <DialogDescription>
                    La clave se mostrará solo una vez. Guárdala en un lugar seguro.
                  </DialogDescription>
                </DialogHeader>
                
                {!generatedKey ? (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyName">Nombre de la Key <span className="text-red-500">*</span></Label>
                      <Input
                        id="keyName"
                        placeholder="Integración FHIR"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keyScope">Scope / Permisos <span className="text-red-500">*</span></Label>
                      <Input
                        id="keyScope"
                        placeholder="patients:read,fhir:write"
                        value={newKeyScope}
                        onChange={(e) => setNewKeyScope(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Permisos separados por comas
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>¡Importante!</strong> Esta es la única vez que verás esta clave completa. Cópiala y guárdala en un lugar seguro.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      <Label>API Key Generada:</Label>
                      <div className="flex gap-2">
                        <Input
                          value={generatedKey}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyKey(generatedKey)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  {!generatedKey ? (
                    <>
                      <Button variant="outline" onClick={() => setNewKeyDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleGenerateKey} disabled={!newKeyName || !newKeyScope}>
                        Generar Key
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => {
                      setNewKeyDialogOpen(false);
                      setGeneratedKey(null);
                      setNewKeyName('');
                      setNewKeyScope('');
                    }}>
                      Cerrar
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Creada</TableHead>
                <TableHead>Expira</TableHead>
                <TableHead>Último Uso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : `${apiKey.key.substring(0, 15)}***`}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs">{apiKey.scope}</code>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{apiKey.created}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{apiKey.expires}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{apiKey.lastUsed}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyKey(apiKey.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeKey(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* CORS */}
      <Card>
        <CardHeader>
          <CardTitle>CORS (Cross-Origin Resource Sharing)</CardTitle>
          <CardDescription>
            Configura qué orígenes pueden acceder a la API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="corsOrigins" className="flex items-center gap-2">
              Orígenes Permitidos
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Lista de URLs permitidas. Una por línea. Usa * para permitir todos (no recomendado en producción)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Textarea
              id="corsOrigins"
              placeholder="https://app.hospital.com&#10;https://dashboard.hospital.com&#10;* (para permitir todos)"
              value={corsOrigins}
              onChange={(e) => {
                setCorsOrigins(e.target.value);
                onChange?.();
              }}
              rows={5}
              className="font-mono text-sm"
            />
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Advertencia de Seguridad:</strong> Usar * permite cualquier origen y puede ser un riesgo de seguridad. Solo usar en desarrollo.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Rate Limiting */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Limiting</CardTitle>
          <CardDescription>
            Límite de peticiones por API Key
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rateLimit" className="flex items-center gap-2">
              Peticiones por Minuto
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Número máximo de peticiones que puede hacer una API Key por minuto</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="rateLimit"
              type="number"
              min={10}
              max={10000}
              value={rateLimit}
              onChange={(e) => {
                setRateLimit(parseInt(e.target.value));
                onChange?.();
              }}
            />
            <p className="text-xs text-muted-foreground">
              Recomendado: 100 req/min para uso normal, 1000 req/min para integraciones intensivas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>
            Endpoints para recibir notificaciones de eventos del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Los webhooks permiten que sistemas externos reciban notificaciones en tiempo real cuando ocurren eventos en el sistema.
              </AlertDescription>
            </Alert>

            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Webhook
            </Button>

            <div className="border rounded-lg p-4 text-center text-sm text-muted-foreground">
              No hay webhooks configurados
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración Técnica */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración Técnica</CardTitle>
          <CardDescription>
            Parámetros avanzados del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Advertencia:</strong> Modificar estos parámetros puede afectar el funcionamiento del sistema. Solo para usuarios avanzados.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Versión de la API:</span>
              <Badge variant="secondary">v1.0.0</Badge>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Base de Datos:</span>
              <Badge variant="secondary">PostgreSQL 17</Badge>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Versión del Sistema:</span>
              <Badge variant="secondary">0.1.0</Badge>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Entorno:</span>
              <Badge>Desarrollo</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      </TabContentWrapper>
    </div>
  );
}

