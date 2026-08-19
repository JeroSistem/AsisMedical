'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, Info, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TabEnableToggle, TabContentWrapper } from '@/components/modules/configuracion/tab-enable-toggle';

interface SecurityTabProps {
  onChange?: () => void;
  entityId?: string | null;
}

export function SecurityTab({ onChange, entityId }: SecurityTabProps) {
  const [enabled, setEnabled] = useState(true);
  const [formData, setFormData] = useState({
    passwordMinLength: 12,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
    sessionTimeout: 30,
    loginFailuresBlock: 5,
    mfaMode: 'optional',
    mfaMethods: ['authenticator'],
    passwordExpiration: 90,
    autoLogoutInactivity: true,
    ipWhitelist: '',
    ipBlacklist: '',
    ssoEnabled: false,
    ssoProvider: '',
    samlEndpoint: '',
    clientId: '',
    clientSecret: '',
    autoProvisioning: false,
  });

  // Cargar estado de activación al cambiar la entidad
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
      const response = await fetch(`/api/configuracion/general?category=security&entityId=${entityId}`);
      const result = await response.json();
      if (result.success && result.data) {
        const enabledConfig = result.data.find((config: any) => 
          config.key === 'security.enabled' || config.key === 'enabled'
        );
        if (enabledConfig) {
          setEnabled(enabledConfig.value === true);
        }
      }
    } catch (error) {
      console.error('Error cargando estado de seguridad:', error);
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
            configs: { 'security.enabled': newEnabled },
            category: 'security',
            entityId: entityId,
          }),
        });
      } catch (error) {
        console.error('Error guardando estado de seguridad:', error);
      }
    }
  };

  const handleChange = (field: string, value: any) => {
    if (!enabled) return;
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Seguridad & Acceso</h3>
          <p className="text-sm text-muted-foreground">
            Configura las políticas de seguridad y autenticación
          </p>
        </div>
      </div>

      {/* Toggle para activar/desactivar configuración */}
      {entityId && (
        <TabEnableToggle
          entityId={entityId}
          category="security"
          label="Configuración de Seguridad"
          description={enabled 
            ? 'La configuración de seguridad está habilitada para esta institución. Puedes modificar los campos a continuación.'
            : 'La configuración de seguridad está deshabilitada para esta institución. Todos los campos están bloqueados.'}
          enabled={enabled}
          onToggle={handleToggle}
        />
      )}

      <TabContentWrapper
        entityId={entityId}
        category="security"
        label="Configuración de Seguridad"
        description=""
        enabled={enabled}
      >

      {/* Política de Contraseñas */}
      <Card>
        <CardHeader>
          <CardTitle>Política de Contraseñas</CardTitle>
          <CardDescription>
            Define los requisitos de seguridad para las contraseñas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Longitud mínima */}
          <div className="space-y-2">
            <Label htmlFor="passwordMinLength" className="flex items-center gap-2">
              Longitud Mínima <span className="text-red-500">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Mínimo 8 caracteres. Recomendado: 12 o más</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="passwordMinLength"
              type="number"
              min={8}
              max={32}
              value={formData.passwordMinLength}
              onChange={(e) => handleChange('passwordMinLength', parseInt(e.target.value))}
              required
            />
          </div>

          {/* Requisitos de complejidad */}
          <div className="space-y-3">
            <Label>Requisitos de Complejidad</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireUppercase"
                  checked={formData.requireUppercase}
                  onCheckedChange={(checked) => handleChange('requireUppercase', checked)}
                />
                <Label htmlFor="requireUppercase" className="font-normal cursor-pointer">
                  Requerir mayúsculas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireNumbers"
                  checked={formData.requireNumbers}
                  onCheckedChange={(checked) => handleChange('requireNumbers', checked)}
                />
                <Label htmlFor="requireNumbers" className="font-normal cursor-pointer">
                  Requerir números
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requireSymbols"
                  checked={formData.requireSymbols}
                  onCheckedChange={(checked) => handleChange('requireSymbols', checked)}
                />
                <Label htmlFor="requireSymbols" className="font-normal cursor-pointer">
                  Requerir símbolos especiales (!@#$%^&*)
                </Label>
              </div>
            </div>
          </div>

          {/* Expiración de contraseña */}
          <div className="space-y-2">
            <Label htmlFor="passwordExpiration">
              Expiración de Contraseñas (días)
            </Label>
            <Input
              id="passwordExpiration"
              type="number"
              min={0}
              placeholder="90 (0 = nunca expira)"
              value={formData.passwordExpiration}
              onChange={(e) => handleChange('passwordExpiration', parseInt(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Dejar en 0 para que las contraseñas nunca expiren
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gestión de Sesiones */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Sesiones</CardTitle>
          <CardDescription>
            Configura el comportamiento de las sesiones de usuario
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Duración máxima de sesión */}
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout" className="flex items-center gap-2">
              Duración Máxima de Sesión (minutos) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sessionTimeout"
              type="number"
              min={5}
              max={1440}
              value={formData.sessionTimeout}
              onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 5 minutos, máximo 1440 (24 horas)
            </p>
          </div>

          {/* Auto-logout por inactividad */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-logout por Inactividad</Label>
              <p className="text-sm text-muted-foreground">
                Cerrar sesión automáticamente cuando el usuario esté inactivo
              </p>
            </div>
            <Switch
              checked={formData.autoLogoutInactivity}
              onCheckedChange={(checked) => handleChange('autoLogoutInactivity', checked)}
            />
          </div>

          {/* Bloqueo por intentos fallidos */}
          <div className="space-y-2">
            <Label htmlFor="loginFailuresBlock" className="flex items-center gap-2">
              Bloqueo por Intentos Fallidos
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Número de intentos fallidos antes de bloquear la cuenta. Recomendado: 3-10</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="loginFailuresBlock"
              type="number"
              min={3}
              max={20}
              value={formData.loginFailuresBlock}
              onChange={(e) => handleChange('loginFailuresBlock', parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Autenticación Multifactor (MFA) */}
      <Card>
        <CardHeader>
          <CardTitle>Autenticación Multifactor (MFA)</CardTitle>
          <CardDescription>
            Configura la autenticación de dos factores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Modo MFA */}
          <div className="space-y-3">
            <Label>Modo de MFA <span className="text-red-500">*</span></Label>
            <RadioGroup value={formData.mfaMode} onValueChange={(value) => handleChange('mfaMode', value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="off" id="mfa-off" />
                <Label htmlFor="mfa-off" className="font-normal cursor-pointer">
                  Desactivado - Sin MFA
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="optional" id="mfa-optional" />
                <Label htmlFor="mfa-optional" className="font-normal cursor-pointer">
                  Opcional - Los usuarios pueden activarlo
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mandatory" id="mfa-mandatory" />
                <Label htmlFor="mfa-mandatory" className="font-normal cursor-pointer">
                  Obligatorio - Todos los usuarios deben usar MFA
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Métodos MFA permitidos */}
          {formData.mfaMode !== 'off' && (
            <div className="space-y-3">
              <Label>Métodos MFA Permitidos</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mfa-sms"
                    checked={formData.mfaMethods.includes('sms')}
                    onCheckedChange={(checked) => {
                      const methods = checked
                        ? [...formData.mfaMethods, 'sms']
                        : formData.mfaMethods.filter(m => m !== 'sms');
                      handleChange('mfaMethods', methods);
                    }}
                  />
                  <Label htmlFor="mfa-sms" className="font-normal cursor-pointer">
                    SMS - Código por mensaje de texto
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mfa-authenticator"
                    checked={formData.mfaMethods.includes('authenticator')}
                    onCheckedChange={(checked) => {
                      const methods = checked
                        ? [...formData.mfaMethods, 'authenticator']
                        : formData.mfaMethods.filter(m => m !== 'authenticator');
                      handleChange('mfaMethods', methods);
                    }}
                  />
                  <Label htmlFor="mfa-authenticator" className="font-normal cursor-pointer">
                    Authenticator App - Google Authenticator, Authy, etc.
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mfa-u2f"
                    checked={formData.mfaMethods.includes('u2f')}
                    onCheckedChange={(checked) => {
                      const methods = checked
                        ? [...formData.mfaMethods, 'u2f']
                        : formData.mfaMethods.filter(m => m !== 'u2f');
                      handleChange('mfaMethods', methods);
                    }}
                  />
                  <Label htmlFor="mfa-u2f" className="font-normal cursor-pointer">
                    U2F / FIDO2 - Llave de seguridad física
                  </Label>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SSO / SAML / OAuth2 */}
      <Card>
        <CardHeader>
          <CardTitle>Single Sign-On (SSO)</CardTitle>
          <CardDescription>
            Configura la autenticación mediante proveedores externos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Habilitar SSO */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Habilitar SSO</Label>
              <p className="text-sm text-muted-foreground">
                Permite autenticación con proveedores externos (Google, Microsoft, SAML)
              </p>
            </div>
            <Switch
              checked={formData.ssoEnabled}
              onCheckedChange={(checked) => handleChange('ssoEnabled', checked)}
            />
          </div>

          {formData.ssoEnabled && (
            <>
              {/* Proveedor SSO */}
              <div className="space-y-2">
                <Label htmlFor="ssoProvider">Proveedor SSO</Label>
                <Select value={formData.ssoProvider} onValueChange={(value) => handleChange('ssoProvider', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Workspace</SelectItem>
                    <SelectItem value="microsoft">Microsoft Azure AD</SelectItem>
                    <SelectItem value="okta">Okta</SelectItem>
                    <SelectItem value="saml">SAML 2.0 (Genérico)</SelectItem>
                    <SelectItem value="oauth2">OAuth 2.0 (Genérico)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* SAML Endpoint / Client ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="samlEndpoint">
                    {formData.ssoProvider === 'saml' ? 'SAML Endpoint' : 'Client ID'}
                  </Label>
                  <Input
                    id="samlEndpoint"
                    placeholder={formData.ssoProvider === 'saml' ? 'https://idp.example.com/saml' : 'client-id-123456'}
                    value={formData.ssoProvider === 'saml' ? formData.samlEndpoint : formData.clientId}
                    onChange={(e) => handleChange(formData.ssoProvider === 'saml' ? 'samlEndpoint' : 'clientId', e.target.value)}
                  />
                </div>

                {/* Client Secret */}
                <div className="space-y-2">
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input
                    id="clientSecret"
                    type="password"
                    placeholder="••••••••••••••••"
                    value={formData.clientSecret}
                    onChange={(e) => handleChange('clientSecret', e.target.value)}
                  />
                </div>
              </div>

              {/* Auto-provisionamiento */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-provisionamiento de Usuarios</Label>
                  <p className="text-sm text-muted-foreground">
                    Crear automáticamente usuarios nuevos al autenticarse por primera vez
                  </p>
                </div>
                <Switch
                  checked={formData.autoProvisioning}
                  onCheckedChange={(checked) => handleChange('autoProvisioning', checked)}
                />
              </div>

              {formData.autoProvisioning && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Los nuevos usuarios serán creados con rol "Usuario" por defecto. Un administrador deberá asignar permisos adicionales.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Control de Acceso por IP */}
      <Card>
        <CardHeader>
          <CardTitle>Control de Acceso por IP</CardTitle>
          <CardDescription>
            Lista blanca y negra de direcciones IP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Whitelist */}
          <div className="space-y-2">
            <Label htmlFor="ipWhitelist" className="flex items-center gap-2">
              IP Whitelist (Lista Blanca)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Solo estas IPs podrán acceder. Usar notación CIDR. Una IP por línea. Dejar vacío para permitir todas.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Textarea
              id="ipWhitelist"
              placeholder="192.168.1.0/24&#10;10.0.0.0/8"
              value={formData.ipWhitelist}
              onChange={(e) => handleChange('ipWhitelist', e.target.value)}
              rows={4}
            />
          </div>

          {/* Blacklist */}
          <div className="space-y-2">
            <Label htmlFor="ipBlacklist" className="flex items-center gap-2">
              IP Blacklist (Lista Negra)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Bloquear estas IPs específicas. Una IP por línea.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Textarea
              id="ipBlacklist"
              placeholder="192.168.1.100&#10;10.0.0.50"
              value={formData.ipBlacklist}
              onChange={(e) => handleChange('ipBlacklist', e.target.value)}
              rows={4}
            />
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Las reglas de whitelist tienen prioridad sobre blacklist. Si hay whitelist configurada, solo esas IPs tendrán acceso.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      </TabContentWrapper>
    </div>
  );
}

