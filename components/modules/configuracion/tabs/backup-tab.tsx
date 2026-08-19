'use client';

import React, { useState, useEffect } from 'react';
import { TabEnableToggle, TabContentWrapper } from '@/components/modules/configuracion/tab-enable-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HardDrive, Info, Download, Shield, Database } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface BackupTabProps {
  onChange?: () => void;
  entityId?: string | null;
}

export function BackupTab({ onChange, entityId }: BackupTabProps) {
  const [enabled, setEnabled] = useState(true);
  const [formData, setFormData] = useState({
    backupFrequency: 'daily',
    backupRetentionDays: 365,
    encryptBackups: true,
    medicalRecordsRetentionYears: 10,
    auditLevel: ['login', 'patient-crud', 'exports', 'config-changes'],
    logRetentionDays: 365,
    siemEnabled: false,
    siemEndpoint: '',
  });

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
      const response = await fetch(`/api/configuracion/general?category=backup&entityId=${entityId}`);
      const result = await response.json();
      if (result.success && result.data) {
        const enabledConfig = result.data.find((config: any) => 
          config.key === 'backup.enabled' || config.key === 'enabled'
        );
        if (enabledConfig) {
          setEnabled(enabledConfig.value === true);
        }
      }
    } catch (error) {
      console.error('Error cargando estado de backup:', error);
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
            configs: { 'backup.enabled': newEnabled },
            category: 'backup',
            entityId: entityId,
          }),
        });
      } catch (error) {
        console.error('Error guardando estado de backup:', error);
      }
    }
  };

  const handleChange = (field: string, value: any) => {
    if (!enabled) return;
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange?.();
  };

  const toggleAuditEvent = (event: string) => {
    const newEvents = formData.auditLevel.includes(event)
      ? formData.auditLevel.filter(e => e !== event)
      : [...formData.auditLevel, event];
    handleChange('auditLevel', newEvents);
  };

  const handleBackupNow = () => {
    // TODO: Implementar backup manual
    alert('Iniciando backup manual...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HardDrive className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Backup / Retención / Auditoría</h3>
          <p className="text-sm text-muted-foreground">
            Configura las políticas de respaldo y auditoría
          </p>
        </div>
      </div>

      {/* Toggle para activar/desactivar configuración */}
      {entityId && (
        <TabEnableToggle
          entityId={entityId}
          category="backup"
          label="Configuración de Backup"
          description={enabled 
            ? 'La configuración de backup está habilitada para esta institución. Puedes modificar los campos a continuación.'
            : 'La configuración de backup está deshabilitada para esta institución. Todos los campos están bloqueados.'}
          enabled={enabled}
          onToggle={handleToggle}
        />
      )}

      <TabContentWrapper
        entityId={entityId}
        category="backup"
        label="Configuración de Backup"
        description=""
        enabled={enabled}
      >

      {/* Configuración de Backups */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Backups</CardTitle>
          <CardDescription>
            Define la frecuencia y retención de respaldos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Frecuencia */}
          <div className="space-y-2">
            <Label htmlFor="backupFrequency" className="flex items-center gap-2">
              Frecuencia de Backup <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.backupFrequency} onValueChange={(value) => handleChange('backupFrequency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Cada Hora</SelectItem>
                <SelectItem value="daily">Diario (Recomendado)</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Retención de backups */}
          <div className="space-y-2">
            <Label htmlFor="backupRetentionDays" className="flex items-center gap-2">
              Retención de Backups (días)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Tiempo que se conservarán los backups antes de ser eliminados automáticamente</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="backupRetentionDays"
              type="number"
              min={7}
              max={3650}
              value={formData.backupRetentionDays}
              onChange={(e) => handleChange('backupRetentionDays', parseInt(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Recomendado: 365 días (1 año)
            </p>
          </div>

          {/* Encriptar backups */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Encriptar Backups</Label>
              <p className="text-sm text-muted-foreground">
                Usar encriptación AES-256 para los archivos de backup
              </p>
            </div>
            <Switch
              checked={formData.encryptBackups}
              onCheckedChange={(checked) => handleChange('encryptBackups', checked)}
            />
          </div>

          {/* Botón de backup manual */}
          <Button variant="outline" onClick={handleBackupNow} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Ejecutar Backup Ahora
          </Button>
        </CardContent>
      </Card>

      {/* Retención de Registros Clínicos */}
      <Card>
        <CardHeader>
          <CardTitle>Retención de Registros Clínicos</CardTitle>
          <CardDescription>
            Política de retención según normativa legal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante Legal:</strong> En Colombia, la normativa requiere conservar las historias clínicas por un mínimo de 20 años. Verifica la regulación aplicable en tu jurisdicción.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="medicalRecordsRetentionYears" className="flex items-center gap-2">
              Retención de Historias Clínicas (años) <span className="text-red-500">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Tiempo de conservación obligatorio de historias clínicas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="medicalRecordsRetentionYears"
              type="number"
              min={1}
              max={100}
              value={formData.medicalRecordsRetentionYears}
              onChange={(e) => handleChange('medicalRecordsRetentionYears', parseInt(e.target.value))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Mínimo legal en Colombia: 20 años. Configurado: {formData.medicalRecordsRetentionYears} años
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Auditoría */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Auditoría</CardTitle>
          <CardDescription>
            Eventos a registrar en el log de auditoría
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label className="text-sm font-medium">Eventos a Registrar:</Label>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="audit-login"
                checked={formData.auditLevel.includes('login')}
                onCheckedChange={() => toggleAuditEvent('login')}
              />
              <Label htmlFor="audit-login" className="font-normal cursor-pointer">
                Login / Logout de usuarios
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="audit-patient-crud"
                checked={formData.auditLevel.includes('patient-crud')}
                onCheckedChange={() => toggleAuditEvent('patient-crud')}
              />
              <Label htmlFor="audit-patient-crud" className="font-normal cursor-pointer">
                CRUD de pacientes (Crear, Leer, Actualizar, Eliminar)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="audit-exports"
                checked={formData.auditLevel.includes('exports')}
                onCheckedChange={() => toggleAuditEvent('exports')}
              />
              <Label htmlFor="audit-exports" className="font-normal cursor-pointer">
                Exportación de datos
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="audit-config-changes"
                checked={formData.auditLevel.includes('config-changes')}
                onCheckedChange={() => toggleAuditEvent('config-changes')}
              />
              <Label htmlFor="audit-config-changes" className="font-normal cursor-pointer">
                Cambios en configuración del sistema
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="audit-image-access"
                checked={formData.auditLevel.includes('image-access')}
                onCheckedChange={() => toggleAuditEvent('image-access')}
              />
              <Label htmlFor="audit-image-access" className="font-normal cursor-pointer">
                Acceso a imágenes diagnósticas
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="audit-prescription"
                checked={formData.auditLevel.includes('prescription')}
                onCheckedChange={() => toggleAuditEvent('prescription')}
              />
              <Label htmlFor="audit-prescription" className="font-normal cursor-pointer">
                Prescripción de medicamentos
              </Label>
            </div>
          </div>

          {/* Retención de logs */}
          <div className="space-y-2 mt-4">
            <Label htmlFor="logRetentionDays">Retención de Logs de Auditoría (días)</Label>
            <Input
              id="logRetentionDays"
              type="number"
              min={30}
              max={3650}
              value={formData.logRetentionDays}
              onChange={(e) => handleChange('logRetentionDays', parseInt(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Recomendado: 365 días mínimo
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SIEM Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Integración con SIEM</CardTitle>
          <CardDescription>
            Envío de logs a sistema de gestión de eventos de seguridad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Habilitar Envío a SIEM</Label>
              <p className="text-sm text-muted-foreground">
                Enviar logs de auditoría a un sistema externo de análisis
              </p>
            </div>
            <Switch
              checked={formData.siemEnabled}
              onCheckedChange={(checked) => handleChange('siemEnabled', checked)}
            />
          </div>

          {formData.siemEnabled && (
            <div className="space-y-2">
              <Label htmlFor="siemEndpoint">Endpoint SIEM <span className="text-red-500">*</span></Label>
              <Input
                id="siemEndpoint"
                type="url"
                placeholder="https://siem.hospital.local/api/events"
                value={formData.siemEndpoint}
                onChange={(e) => handleChange('siemEndpoint', e.target.value)}
                required
              />
            </div>
          )}
        </CardContent>
      </Card>
      </TabContentWrapper>
    </div>
  );
}

