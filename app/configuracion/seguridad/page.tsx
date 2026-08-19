'use client';

import { useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock, Eye, EyeOff, Save, RefreshCw, Key, Users, Clock, AlertTriangle } from 'lucide-react';

export default function SeguridadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [securitySettings, setSecuritySettings] = useState({
    // Autenticación
    requireTwoFactor: true,
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    passwordMinLength: '8',
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    
    // Políticas de contraseña
    passwordExpirationDays: '90',
    preventPasswordReuse: true,
    passwordHistoryCount: '5',
    
    // Auditoría
    enableAuditLog: true,
    logLoginAttempts: true,
    logDataAccess: true,
    logConfigurationChanges: true,
    auditLogRetentionDays: '365',
    
    // Acceso
    ipWhitelist: '',
    allowedDomains: '',
    restrictAccessHours: false,
    accessStartHour: '08:00',
    accessEndHour: '18:00',
    
    // Encriptación
    enableDataEncryption: true,
    encryptionAlgorithm: 'AES-256',
    keyRotationDays: '30',
    
    // Certificados SSL
    enableSSL: true,
    sslCertificatePath: '',
    sslKeyPath: '',
    forceHTTPS: true,
    
    // Firewall
    enableFirewall: true,
    blockSuspiciousIPs: true,
    maxConnectionsPerIP: '100',
    
    // Backup de seguridad
    enableSecurityBackup: true,
    backupEncryption: true,
    backupFrequency: 'daily'
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Configuración guardada",
        description: "La configuración de seguridad se ha actualizado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de restablecer la configuración de seguridad a los valores por defecto?')) {
      // Restablecer valores por defecto
      setSecuritySettings({
        requireTwoFactor: true,
        sessionTimeout: '30',
        maxLoginAttempts: '5',
        passwordMinLength: '8',
        requireSpecialChars: true,
        requireNumbers: true,
        requireUppercase: true,
        passwordExpirationDays: '90',
        preventPasswordReuse: true,
        passwordHistoryCount: '5',
        enableAuditLog: true,
        logLoginAttempts: true,
        logDataAccess: true,
        logConfigurationChanges: true,
        auditLogRetentionDays: '365',
        ipWhitelist: '',
        allowedDomains: '',
        restrictAccessHours: false,
        accessStartHour: '08:00',
        accessEndHour: '18:00',
        enableDataEncryption: true,
        encryptionAlgorithm: 'AES-256',
        keyRotationDays: '30',
        enableSSL: true,
        sslCertificatePath: '',
        sslKeyPath: '',
        forceHTTPS: true,
        enableFirewall: true,
        blockSuspiciousIPs: true,
        maxConnectionsPerIP: '100',
        enableSecurityBackup: true,
        backupEncryption: true,
        backupFrequency: 'daily'
      });
      
      toast({
        title: "Configuración restablecida",
        description: "La configuración de seguridad se ha restablecido a los valores por defecto.",
      });
    }
  };

  const actions = (
    <>
      <Button variant="outline" size="sm" onClick={handleReset} disabled={isLoading}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Restablecer
      </Button>
      <Button size="sm" onClick={handleSubmit} disabled={isLoading}>
        <Save className="mr-2 h-4 w-4" />
        {isLoading ? 'Guardando...' : 'Guardar'}
      </Button>
    </>
  );

  return (
    <ModulePageLayout
      title="Configuración de Seguridad"
      description="Configuración de políticas de seguridad, autenticación y auditoría del sistema"
      actions={actions}
      maxWidth="7xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Configuración de Autenticación */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Configuración de Autenticación
            </CardTitle>
            <CardDescription>
              Configuración de autenticación y políticas de contraseñas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="requireTwoFactor"
                checked={securitySettings.requireTwoFactor}
                onCheckedChange={(checked) => handleInputChange('requireTwoFactor', checked)}
              />
              <Label htmlFor="requireTwoFactor">Requerir Autenticación de Dos Factores</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout de Sesión (minutos)</Label>
                <Input
                  id="sessionTimeout"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                  placeholder="30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Intentos Máximos de Login</Label>
                <Input
                  id="maxLoginAttempts"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => handleInputChange('maxLoginAttempts', e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passwordMinLength">Longitud Mínima de Contraseña</Label>
              <Input
                id="passwordMinLength"
                value={securitySettings.passwordMinLength}
                onChange={(e) => handleInputChange('passwordMinLength', e.target.value)}
                placeholder="8"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="requireSpecialChars"
                  checked={securitySettings.requireSpecialChars}
                  onCheckedChange={(checked) => handleInputChange('requireSpecialChars', checked)}
                />
                <Label htmlFor="requireSpecialChars">Caracteres Especiales</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="requireNumbers"
                  checked={securitySettings.requireNumbers}
                  onCheckedChange={(checked) => handleInputChange('requireNumbers', checked)}
                />
                <Label htmlFor="requireNumbers">Números</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="requireUppercase"
                  checked={securitySettings.requireUppercase}
                  onCheckedChange={(checked) => handleInputChange('requireUppercase', checked)}
                />
                <Label htmlFor="requireUppercase">Mayúsculas</Label>
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Políticas de Contraseña */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="mr-2 h-5 w-5" />
              Políticas de Contraseña
            </CardTitle>
            <CardDescription>
              Configuración de políticas de expiración y reutilización de contraseñas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passwordExpirationDays">Días de Expiración</Label>
                <Input
                  id="passwordExpirationDays"
                  value={securitySettings.passwordExpirationDays}
                  onChange={(e) => handleInputChange('passwordExpirationDays', e.target.value)}
                  placeholder="90"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordHistoryCount">Historial de Contraseñas</Label>
                <Input
                  id="passwordHistoryCount"
                  value={securitySettings.passwordHistoryCount}
                  onChange={(e) => handleInputChange('passwordHistoryCount', e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="preventPasswordReuse"
                checked={securitySettings.preventPasswordReuse}
                onCheckedChange={(checked) => handleInputChange('preventPasswordReuse', checked)}
              />
              <Label htmlFor="preventPasswordReuse">Prevenir Reutilización de Contraseñas</Label>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Configuración de Auditoría */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              Configuración de Auditoría
            </CardTitle>
            <CardDescription>
              Configuración de logs de auditoría y monitoreo de actividades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableAuditLog"
                checked={securitySettings.enableAuditLog}
                onCheckedChange={(checked) => handleInputChange('enableAuditLog', checked)}
              />
              <Label htmlFor="enableAuditLog">Habilitar Log de Auditoría</Label>
            </div>
            
            {securitySettings.enableAuditLog && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="logLoginAttempts"
                      checked={securitySettings.logLoginAttempts}
                      onCheckedChange={(checked) => handleInputChange('logLoginAttempts', checked)}
                    />
                    <Label htmlFor="logLoginAttempts">Intentos de Login</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="logDataAccess"
                      checked={securitySettings.logDataAccess}
                      onCheckedChange={(checked) => handleInputChange('logDataAccess', checked)}
                    />
                    <Label htmlFor="logDataAccess">Acceso a Datos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="logConfigurationChanges"
                      checked={securitySettings.logConfigurationChanges}
                      onCheckedChange={(checked) => handleInputChange('logConfigurationChanges', checked)}
                    />
                    <Label htmlFor="logConfigurationChanges">Cambios de Configuración</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="auditLogRetentionDays">Retención de Logs (días)</Label>
                  <Input
                    id="auditLogRetentionDays"
                    value={securitySettings.auditLogRetentionDays}
                    onChange={(e) => handleInputChange('auditLogRetentionDays', e.target.value)}
                    placeholder="365"
                  />
                </div>
              </>
            )}
          </CardContent>
        </ModuleCard>

        {/* Control de Acceso */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Control de Acceso
            </CardTitle>
            <CardDescription>
              Configuración de restricciones de acceso por IP y horarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ipWhitelist">Lista Blanca de IPs (una por línea)</Label>
              <Input
                id="ipWhitelist"
                value={securitySettings.ipWhitelist}
                onChange={(e) => handleInputChange('ipWhitelist', e.target.value)}
                placeholder="192.168.1.0/24&#10;10.0.0.0/8"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="allowedDomains">Dominios Permitidos (separados por coma)</Label>
              <Input
                id="allowedDomains"
                value={securitySettings.allowedDomains}
                onChange={(e) => handleInputChange('allowedDomains', e.target.value)}
                placeholder="hospital.com, clinica.com"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="restrictAccessHours"
                checked={securitySettings.restrictAccessHours}
                onCheckedChange={(checked) => handleInputChange('restrictAccessHours', checked)}
              />
              <Label htmlFor="restrictAccessHours">Restringir Horarios de Acceso</Label>
            </div>
            
            {securitySettings.restrictAccessHours && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accessStartHour">Hora de Inicio</Label>
                  <Input
                    id="accessStartHour"
                    type="time"
                    value={securitySettings.accessStartHour}
                    onChange={(e) => handleInputChange('accessStartHour', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessEndHour">Hora de Fin</Label>
                  <Input
                    id="accessEndHour"
                    type="time"
                    value={securitySettings.accessEndHour}
                    onChange={(e) => handleInputChange('accessEndHour', e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </ModuleCard>

        {/* Configuración de Encriptación */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Configuración de Encriptación
            </CardTitle>
            <CardDescription>
              Configuración de encriptación de datos y rotación de claves
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableDataEncryption"
                checked={securitySettings.enableDataEncryption}
                onCheckedChange={(checked) => handleInputChange('enableDataEncryption', checked)}
              />
              <Label htmlFor="enableDataEncryption">Habilitar Encriptación de Datos</Label>
            </div>
            
            {securitySettings.enableDataEncryption && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="encryptionAlgorithm">Algoritmo de Encriptación</Label>
                    <Select value={securitySettings.encryptionAlgorithm} onValueChange={(value) => handleInputChange('encryptionAlgorithm', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AES-256">AES-256</SelectItem>
                        <SelectItem value="AES-128">AES-128</SelectItem>
                        <SelectItem value="ChaCha20">ChaCha20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keyRotationDays">Rotación de Claves (días)</Label>
                    <Input
                      id="keyRotationDays"
                      value={securitySettings.keyRotationDays}
                      onChange={(e) => handleInputChange('keyRotationDays', e.target.value)}
                      placeholder="30"
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </ModuleCard>

        {/* Certificados SSL */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Certificados SSL
            </CardTitle>
            <CardDescription>
              Configuración de certificados SSL y HTTPS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableSSL"
                checked={securitySettings.enableSSL}
                onCheckedChange={(checked) => handleInputChange('enableSSL', checked)}
              />
              <Label htmlFor="enableSSL">Habilitar SSL</Label>
            </div>
            
            {securitySettings.enableSSL && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sslCertificatePath">Ruta del Certificado SSL</Label>
                    <Input
                      id="sslCertificatePath"
                      value={securitySettings.sslCertificatePath}
                      onChange={(e) => handleInputChange('sslCertificatePath', e.target.value)}
                      placeholder="/path/to/certificate.crt"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sslKeyPath">Ruta de la Clave SSL</Label>
                    <Input
                      id="sslKeyPath"
                      value={securitySettings.sslKeyPath}
                      onChange={(e) => handleInputChange('sslKeyPath', e.target.value)}
                      placeholder="/path/to/private.key"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="forceHTTPS"
                    checked={securitySettings.forceHTTPS}
                    onCheckedChange={(checked) => handleInputChange('forceHTTPS', checked)}
                  />
                  <Label htmlFor="forceHTTPS">Forzar HTTPS</Label>
                </div>
              </>
            )}
          </CardContent>
        </ModuleCard>

        {/* Configuración de Firewall */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Configuración de Firewall
            </CardTitle>
            <CardDescription>
              Configuración de firewall y protección contra ataques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableFirewall"
                checked={securitySettings.enableFirewall}
                onCheckedChange={(checked) => handleInputChange('enableFirewall', checked)}
              />
              <Label htmlFor="enableFirewall">Habilitar Firewall</Label>
            </div>
            
            {securitySettings.enableFirewall && (
              <>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="blockSuspiciousIPs"
                    checked={securitySettings.blockSuspiciousIPs}
                    onCheckedChange={(checked) => handleInputChange('blockSuspiciousIPs', checked)}
                  />
                  <Label htmlFor="blockSuspiciousIPs">Bloquear IPs Sospechosas</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxConnectionsPerIP">Conexiones Máximas por IP</Label>
                  <Input
                    id="maxConnectionsPerIP"
                    value={securitySettings.maxConnectionsPerIP}
                    onChange={(e) => handleInputChange('maxConnectionsPerIP', e.target.value)}
                    placeholder="100"
                  />
                </div>
              </>
            )}
          </CardContent>
        </ModuleCard>

        {/* Backup de Seguridad */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Backup de Seguridad
            </CardTitle>
            <CardDescription>
              Configuración de backup de configuraciones de seguridad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableSecurityBackup"
                checked={securitySettings.enableSecurityBackup}
                onCheckedChange={(checked) => handleInputChange('enableSecurityBackup', checked)}
              />
              <Label htmlFor="enableSecurityBackup">Habilitar Backup de Seguridad</Label>
            </div>
            
            {securitySettings.enableSecurityBackup && (
              <>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="backupEncryption"
                    checked={securitySettings.backupEncryption}
                    onCheckedChange={(checked) => handleInputChange('backupEncryption', checked)}
                  />
                  <Label htmlFor="backupEncryption">Encriptar Backups</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Frecuencia de Backup</Label>
                  <Select value={securitySettings.backupFrequency} onValueChange={(value) => handleInputChange('backupFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Cada hora</SelectItem>
                      <SelectItem value="daily">Diario</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </CardContent>
        </ModuleCard>
      </form>
    </ModulePageLayout>
  );
}