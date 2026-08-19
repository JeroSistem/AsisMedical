'use client';

import React, { useState, useEffect } from 'react';
import { TabEnableToggle, TabContentWrapper } from '@/components/modules/configuracion/tab-enable-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plug, Info, Send, Database, Mail, MessageSquare, HardDrive } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface IntegrationsTabProps {
  onChange?: () => void;
  entityId?: string | null;
}

export function IntegrationsTab({ onChange, entityId }: IntegrationsTabProps) {
  const [enabled, setEnabled] = useState(true);
  const [formData, setFormData] = useState({
    // FHIR
    fhirEnabled: false,
    fhirBaseUrl: '',
    fhirVersion: 'R4',
    
    // HL7
    hl7Enabled: false,
    hl7Host: '0.0.0.0',
    hl7Port: '2575',
    
    // LIS (Laboratory Information System)
    lisEnabled: false,
    lisUrl: '',
    lisToken: '',
    
    // PACS
    pacsEnabled: false,
    pacsAeTitle: '',
    pacsHost: '',
    pacsPort: '11112',
    
    // SMTP
    smtpEnabled: false,
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    smtpFrom: '',
    smtpSecure: true,
    
    // SMS
    smsEnabled: false,
    smsProvider: '',
    smsApiKey: '',
    smsApiSecret: '',
    
    // Backup Storage
    backupStorage: 'local',
    s3Bucket: '',
    s3Region: '',
    s3AccessKey: '',
    s3SecretKey: '',
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
      const response = await fetch(`/api/configuracion/general?category=integrations&entityId=${entityId}`);
      const result = await response.json();
      if (result.success && result.data) {
        const enabledConfig = result.data.find((config: any) => 
          config.key === 'integrations.enabled' || config.key === 'enabled'
        );
        if (enabledConfig) {
          setEnabled(enabledConfig.value === true);
        }
      }
    } catch (error) {
      console.error('Error cargando estado de integraciones:', error);
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
            configs: { 'integrations.enabled': newEnabled },
            category: 'integrations',
            entityId: entityId,
          }),
        });
      } catch (error) {
        console.error('Error guardando estado de integraciones:', error);
      }
    }
  };

  const handleChange = (field: string, value: any) => {
    if (!enabled) return;
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange?.();
  };

  const handleTestEmail = async () => {
    // TODO: Implementar test de email
    alert('Enviando email de prueba...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Plug className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Integraciones</h3>
          <p className="text-sm text-muted-foreground">
            Configura las integraciones con sistemas externos
          </p>
        </div>
      </div>

      {/* Toggle para activar/desactivar configuración */}
      {entityId && (
        <TabEnableToggle
          entityId={entityId}
          category="integrations"
          label="Configuración de Integraciones"
          description={enabled 
            ? 'Las integraciones están habilitadas para esta institución. Puedes modificar los campos a continuación.'
            : 'Las integraciones están deshabilitadas para esta institución. Todos los campos están bloqueados.'}
          enabled={enabled}
          onToggle={handleToggle}
        />
      )}

      <TabContentWrapper
        entityId={entityId}
        category="integrations"
        label="Configuración de Integraciones"
        description=""
        enabled={enabled}
      >

      <Accordion type="single" collapsible className="w-full">
        {/* Interoperabilidad (FHIR/HL7) */}
        <AccordionItem value="interop">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Interoperabilidad (FHIR / HL7)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">FHIR API</CardTitle>
                <CardDescription>
                  Fast Healthcare Interoperability Resources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Habilitar FHIR */}
                <div className="flex items-center justify-between">
                  <Label>Habilitar FHIR API</Label>
                  <Switch
                    checked={formData.fhirEnabled}
                    onCheckedChange={(checked) => handleChange('fhirEnabled', checked)}
                  />
                </div>

                {formData.fhirEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fhirBaseUrl" className="flex items-center gap-2">
                        FHIR Base URL <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fhirBaseUrl"
                        type="url"
                        placeholder="https://fhir.hospital.local"
                        value={formData.fhirBaseUrl}
                        onChange={(e) => handleChange('fhirBaseUrl', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fhirVersion">Versión FHIR</Label>
                      <Select value={formData.fhirVersion} onValueChange={(value) => handleChange('fhirVersion', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DSTU2">DSTU2</SelectItem>
                          <SelectItem value="STU3">STU3</SelectItem>
                          <SelectItem value="R4">R4 (Recomendado)</SelectItem>
                          <SelectItem value="R5">R5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">HL7 v2 Listener</CardTitle>
                <CardDescription>
                  Health Level 7 versión 2.x
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Habilitar HL7 Listener</Label>
                  <Switch
                    checked={formData.hl7Enabled}
                    onCheckedChange={(checked) => handleChange('hl7Enabled', checked)}
                  />
                </div>

                {formData.hl7Enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hl7Host">Host</Label>
                      <Input
                        id="hl7Host"
                        placeholder="0.0.0.0"
                        value={formData.hl7Host}
                        onChange={(e) => handleChange('hl7Host', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hl7Port">Puerto</Label>
                      <Input
                        id="hl7Port"
                        type="number"
                        placeholder="2575"
                        value={formData.hl7Port}
                        onChange={(e) => handleChange('hl7Port', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Laboratorio (LIS) */}
        <AccordionItem value="lis">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Sistema de Información de Laboratorio (LIS)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Habilitar Integración LIS</Label>
                  <Switch
                    checked={formData.lisEnabled}
                    onCheckedChange={(checked) => handleChange('lisEnabled', checked)}
                  />
                </div>

                {formData.lisEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="lisUrl">URL del LIS</Label>
                      <Input
                        id="lisUrl"
                        type="url"
                        placeholder="https://lis.hospital.local/api"
                        value={formData.lisUrl}
                        onChange={(e) => handleChange('lisUrl', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lisToken">Token de Autenticación</Label>
                      <Input
                        id="lisToken"
                        type="password"
                        placeholder="••••••••••••••••"
                        value={formData.lisToken}
                        onChange={(e) => handleChange('lisToken', e.target.value)}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* PACS */}
        <AccordionItem value="pacs">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>PACS (Picture Archiving and Communication System)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Habilitar Integración PACS</Label>
                  <Switch
                    checked={formData.pacsEnabled}
                    onCheckedChange={(checked) => handleChange('pacsEnabled', checked)}
                  />
                </div>

                {formData.pacsEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="pacsAeTitle" className="flex items-center gap-2">
                        DICOM AE Title
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Application Entity Title para DICOM</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="pacsAeTitle"
                        placeholder="HOSP_PACS"
                        value={formData.pacsAeTitle}
                        onChange={(e) => handleChange('pacsAeTitle', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pacsHost">Host PACS</Label>
                        <Input
                          id="pacsHost"
                          placeholder="pacs.hospital.local"
                          value={formData.pacsHost}
                          onChange={(e) => handleChange('pacsHost', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pacsPort">Puerto</Label>
                        <Input
                          id="pacsPort"
                          type="number"
                          placeholder="11112"
                          value={formData.pacsPort}
                          onChange={(e) => handleChange('pacsPort', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Email (SMTP) */}
        <AccordionItem value="smtp">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email / SMTP</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Habilitar Notificaciones por Email</Label>
                  <Switch
                    checked={formData.smtpEnabled}
                    onCheckedChange={(checked) => handleChange('smtpEnabled', checked)}
                  />
                </div>

                {formData.smtpEnabled && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtpHost">SMTP Host <span className="text-red-500">*</span></Label>
                        <Input
                          id="smtpHost"
                          placeholder="smtp.gmail.com"
                          value={formData.smtpHost}
                          onChange={(e) => handleChange('smtpHost', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort">Puerto</Label>
                        <Input
                          id="smtpPort"
                          type="number"
                          placeholder="587"
                          value={formData.smtpPort}
                          onChange={(e) => handleChange('smtpPort', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtpUser">Usuario SMTP</Label>
                        <Input
                          id="smtpUser"
                          placeholder="usuario@dominio.com"
                          value={formData.smtpUser}
                          onChange={(e) => handleChange('smtpUser', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPass">Contraseña SMTP</Label>
                        <Input
                          id="smtpPass"
                          type="password"
                          placeholder="••••••••••••••••"
                          value={formData.smtpPass}
                          onChange={(e) => handleChange('smtpPass', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpFrom">Email Remitente <span className="text-red-500">*</span></Label>
                      <Input
                        id="smtpFrom"
                        type="email"
                        placeholder="no-reply@hospital.com"
                        value={formData.smtpFrom}
                        onChange={(e) => handleChange('smtpFrom', e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="smtpSecure"
                        checked={formData.smtpSecure}
                        onCheckedChange={(checked) => handleChange('smtpSecure', checked)}
                      />
                      <Label htmlFor="smtpSecure" className="font-normal cursor-pointer">
                        Usar TLS/SSL (recomendado)
                      </Label>
                    </div>

                    <Button variant="outline" onClick={handleTestEmail} className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Email de Prueba
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* SMS */}
        <AccordionItem value="sms">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Mensajería SMS</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Habilitar Notificaciones por SMS</Label>
                  <Switch
                    checked={formData.smsEnabled}
                    onCheckedChange={(checked) => handleChange('smsEnabled', checked)}
                  />
                </div>

                {formData.smsEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="smsProvider">Proveedor SMS</Label>
                      <Select value={formData.smsProvider} onValueChange={(value) => handleChange('smsProvider', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un proveedor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twilio">Twilio</SelectItem>
                          <SelectItem value="nexmo">Vonage (Nexmo)</SelectItem>
                          <SelectItem value="aws-sns">AWS SNS</SelectItem>
                          <SelectItem value="local">Proveedor Local</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.smsProvider && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smsApiKey">API Key</Label>
                          <Input
                            id="smsApiKey"
                            type="password"
                            placeholder="••••••••••••••••"
                            value={formData.smsApiKey}
                            onChange={(e) => handleChange('smsApiKey', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smsApiSecret">API Secret</Label>
                          <Input
                            id="smsApiSecret"
                            type="password"
                            placeholder="••••••••••••••••"
                            value={formData.smsApiSecret}
                            onChange={(e) => handleChange('smsApiSecret', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Backup Storage */}
        <AccordionItem value="backup-storage">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              <span>Almacenamiento de Backups</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backupStorage">Tipo de Almacenamiento</Label>
                  <Select value={formData.backupStorage} onValueChange={(value) => handleChange('backupStorage', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local (Servidor)</SelectItem>
                      <SelectItem value="s3">Amazon S3</SelectItem>
                      <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                      <SelectItem value="azure">Azure Blob Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.backupStorage === 's3' && (
                  <>
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Los backups se almacenarán en Amazon S3. Asegúrate de configurar las credenciales IAM correctas.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="s3Bucket">Bucket S3 <span className="text-red-500">*</span></Label>
                        <Input
                          id="s3Bucket"
                          placeholder="hospital-backups"
                          value={formData.s3Bucket}
                          onChange={(e) => handleChange('s3Bucket', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="s3Region">Región</Label>
                        <Select value={formData.s3Region} onValueChange={(value) => handleChange('s3Region', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona región" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                            <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                            <SelectItem value="sa-east-1">South America (São Paulo)</SelectItem>
                            <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="s3AccessKey">Access Key ID</Label>
                        <Input
                          id="s3AccessKey"
                          type="password"
                          placeholder="••••••••••••••••"
                          value={formData.s3AccessKey}
                          onChange={(e) => handleChange('s3AccessKey', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="s3SecretKey">Secret Access Key</Label>
                        <Input
                          id="s3SecretKey"
                          type="password"
                          placeholder="••••••••••••••••"
                          value={formData.s3SecretKey}
                          onChange={(e) => handleChange('s3SecretKey', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      </TabContentWrapper>
    </div>
  );
}

