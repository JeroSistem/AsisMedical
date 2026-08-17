'use client';

import { useState, useEffect } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Server, 
  Database, 
  Shield, 
  Monitor, 
  Save, 
  RefreshCw, 
  Wrench,
  Activity,
  HardDrive,
  Network,
  Cpu,
  HardDriveIcon
} from 'lucide-react';

export default function ConfiguracionSistemaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [systemSettings, setSystemSettings] = useState({
    // Configuración del servidor
    serverHost: 'localhost',
    serverPort: '9002',
    serverEnvironment: 'development',
    serverTimezone: 'America/Bogota',
    serverLanguage: 'es',
    serverDebug: false,
    
    // Configuración de base de datos
    dbHost: '127.0.0.1',
    dbPort: '3307',
    dbName: 'asis_medical',
    dbUser: 'asis',
    dbMaxConnections: '100',
    dbTimeout: '30',
    dbSSL: false,
    
    // Configuración de caché
    cacheEnabled: true,
    cacheType: 'redis',
    cacheHost: 'localhost',
    cachePort: '6379',
    cacheTTL: '3600',
    
    // Configuración de logs
    logLevel: 'info',
    logFile: '/var/log/asismedicare.log',
    logMaxSize: '100MB',
    logMaxFiles: '5',
    logCompress: true,
    
    // Configuración de monitoreo
    monitoringEnabled: true,
    metricsEnabled: true,
    healthCheckInterval: '30',
    alertThreshold: '80',
    
    // Configuración de almacenamiento
    storageType: 'local',
    storagePath: '/var/lib/asismedicare',
    storageMaxSize: '10GB',
    backupEnabled: true,
    backupInterval: 'daily',
    backupRetention: '30',
    
    // Configuración de red
    corsEnabled: true,
    corsOrigins: '*',
    rateLimitEnabled: true,
    rateLimitMax: '1000',
    rateLimitWindow: '15',
    
    // Configuración de seguridad
    encryptionEnabled: true,
    encryptionKey: '',
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    lockoutDuration: '15',
    
    // Configuración de notificaciones
    emailEnabled: false,
    smsEnabled: false,
    pushEnabled: false,
    notificationQueue: 'redis',
    
    // Configuración de integraciones
    apiEnabled: true,
    apiVersion: 'v1',
    apiRateLimit: '100',
    webhookEnabled: false,
    webhookUrl: '',
    
    // Configuración de mantenimiento
    maintenanceMode: false,
    maintenanceMessage: 'Sistema en mantenimiento',
    autoBackup: true,
    autoUpdate: false,
    updateChannel: 'stable'
  });

  // Cargar configuración desde la base de datos al montar el componente
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setIsLoadingData(true);
        const response = await fetch('/api/configuracion/sistema?category=sistema');
        const result = await response.json();

        if (result.success && result.data) {
          // Convertir el array de configuraciones a objeto plano
          const configObject: any = {};
          if (Array.isArray(result.data)) {
            result.data.forEach((config: any) => {
              // Remover el prefijo "sistema." si existe
              const key = config.key.replace(/^sistema\./, '');
              configObject[key] = config.value;
            });
          } else if (typeof result.data === 'object') {
            // Si es un objeto plano, remover prefijos
            Object.entries(result.data).forEach(([key, value]) => {
              const cleanKey = key.replace(/^sistema\./, '');
              configObject[cleanKey] = value;
            });
          }

          // Actualizar el formulario con los valores guardados
          if (Object.keys(configObject).length > 0) {
            setSystemSettings(prev => ({
              ...prev,
              ...configObject,
            }));
          }
        }
      } catch (error) {
        console.error('Error cargando configuración:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadConfiguration();
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setSystemSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/configuracion/sistema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          configs: systemSettings,
          category: 'sistema',
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Configuración guardada",
          description: "La configuración del sistema se ha guardado correctamente en la base de datos.",
        });
      } else {
        throw new Error(result.error || 'Error al guardar la configuración');
      }
    } catch (error: any) {
      console.error('Error guardando configuración:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la configuración. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <ModulePageLayout
        title="Configuración del Sistema"
        description="Cargando configuración..."
        maxWidth="7xl"
      >
        <div className="flex items-center justify-center p-8">
          <p>Cargando configuración desde la base de datos...</p>
        </div>
      </ModulePageLayout>
    );
  }

  const handleReset = () => {
    if (confirm('¿Estás seguro de restablecer la configuración a los valores por defecto?')) {
      // Restablecer valores por defecto
      setSystemSettings({
        serverHost: 'localhost',
        serverPort: '9002',
        serverEnvironment: 'development',
        serverTimezone: 'America/Bogota',
        serverLanguage: 'es',
        serverDebug: false,
        dbHost: '127.0.0.1',
        dbPort: '3307',
        dbName: 'asis_medical',
        dbUser: 'asis',
        dbMaxConnections: '100',
        dbTimeout: '30',
        dbSSL: false,
        cacheEnabled: true,
        cacheType: 'redis',
        cacheHost: 'localhost',
        cachePort: '6379',
        cacheTTL: '3600',
        logLevel: 'info',
        logFile: '/var/log/asismedicare.log',
        logMaxSize: '100MB',
        logMaxFiles: '5',
        logCompress: true,
        monitoringEnabled: true,
        metricsEnabled: true,
        healthCheckInterval: '30',
        alertThreshold: '80',
        storageType: 'local',
        storagePath: '/var/lib/asismedicare',
        storageMaxSize: '10GB',
        backupEnabled: true,
        backupInterval: 'daily',
        backupRetention: '30',
        corsEnabled: true,
        corsOrigins: '*',
        rateLimitEnabled: true,
        rateLimitMax: '1000',
        rateLimitWindow: '15',
        encryptionEnabled: true,
        encryptionKey: '',
        sessionTimeout: '30',
        maxLoginAttempts: '5',
        lockoutDuration: '15',
        emailEnabled: false,
        smsEnabled: false,
        pushEnabled: false,
        notificationQueue: 'redis',
        apiEnabled: true,
        apiVersion: 'v1',
        apiRateLimit: '100',
        webhookEnabled: false,
        webhookUrl: '',
        maintenanceMode: false,
        maintenanceMessage: 'Sistema en mantenimiento',
        autoBackup: true,
        autoUpdate: false,
        updateChannel: 'stable'
      });
      
      toast({
        title: "Configuración restablecida",
        description: "La configuración se ha restablecido a los valores por defecto.",
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
      title="Configuración del Sistema"
      description="Configuración avanzada del servidor, base de datos y servicios del sistema"
      actions={actions}
      maxWidth="7xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Configuración del Servidor */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="mr-2 h-5 w-5" />
              Configuración del Servidor
            </CardTitle>
            <CardDescription>
              Configuración básica del servidor y entorno de ejecución
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serverHost">Host del Servidor</Label>
                <Input
                  id="serverHost"
                  value={systemSettings.serverHost}
                  onChange={(e) => handleInputChange('serverHost', e.target.value)}
                  placeholder="localhost"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serverPort">Puerto del Servidor</Label>
                <Input
                  id="serverPort"
                  value={systemSettings.serverPort}
                  onChange={(e) => handleInputChange('serverPort', e.target.value)}
                  placeholder="9002"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serverEnvironment">Entorno</Label>
                <Select value={systemSettings.serverEnvironment} onValueChange={(value) => handleInputChange('serverEnvironment', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Desarrollo</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Producción</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serverTimezone">Zona Horaria</Label>
                <Select value={systemSettings.serverTimezone} onValueChange={(value) => handleInputChange('serverTimezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                    <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                    <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="serverDebug"
                checked={systemSettings.serverDebug}
                onCheckedChange={(checked) => handleInputChange('serverDebug', checked)}
              />
              <Label htmlFor="serverDebug">Modo Debug</Label>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Configuración de Base de Datos */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Configuración de Base de Datos
            </CardTitle>
            <CardDescription>
              Configuración de conexión y parámetros de la base de datos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dbHost">Host de la Base de Datos</Label>
                <Input
                  id="dbHost"
                  value={systemSettings.dbHost}
                  onChange={(e) => handleInputChange('dbHost', e.target.value)}
                  placeholder="localhost"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dbPort">Puerto</Label>
                <Input
                  id="dbPort"
                  value={systemSettings.dbPort}
                  onChange={(e) => handleInputChange('dbPort', e.target.value)}
                  placeholder="3307"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dbName">Nombre de la Base de Datos</Label>
                <Input
                  id="dbName"
                  value={systemSettings.dbName}
                  onChange={(e) => handleInputChange('dbName', e.target.value)}
                  placeholder="asis_medical"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dbUser">Usuario</Label>
                <Input
                  id="dbUser"
                  value={systemSettings.dbUser}
                  onChange={(e) => handleInputChange('dbUser', e.target.value)}
                  placeholder="asis"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dbMaxConnections">Conexiones Máximas</Label>
                <Input
                  id="dbMaxConnections"
                  value={systemSettings.dbMaxConnections}
                  onChange={(e) => handleInputChange('dbMaxConnections', e.target.value)}
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dbTimeout">Timeout (segundos)</Label>
                <Input
                  id="dbTimeout"
                  value={systemSettings.dbTimeout}
                  onChange={(e) => handleInputChange('dbTimeout', e.target.value)}
                  placeholder="30"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="dbSSL"
                checked={systemSettings.dbSSL}
                onCheckedChange={(checked) => handleInputChange('dbSSL', checked)}
              />
              <Label htmlFor="dbSSL">Habilitar SSL</Label>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Configuración de Caché */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Configuración de Caché
            </CardTitle>
            <CardDescription>
              Configuración del sistema de caché para mejorar el rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="cacheEnabled"
                checked={systemSettings.cacheEnabled}
                onCheckedChange={(checked) => handleInputChange('cacheEnabled', checked)}
              />
              <Label htmlFor="cacheEnabled">Habilitar Caché</Label>
            </div>
            
            {systemSettings.cacheEnabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cacheType">Tipo de Caché</Label>
                    <Select value={systemSettings.cacheType} onValueChange={(value) => handleInputChange('cacheType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="redis">Redis</SelectItem>
                        <SelectItem value="memory">Memoria</SelectItem>
                        <SelectItem value="file">Archivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cacheTTL">TTL (segundos)</Label>
                    <Input
                      id="cacheTTL"
                      value={systemSettings.cacheTTL}
                      onChange={(e) => handleInputChange('cacheTTL', e.target.value)}
                      placeholder="3600"
                    />
                  </div>
                </div>
                
                {systemSettings.cacheType === 'redis' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cacheHost">Host de Redis</Label>
                      <Input
                        id="cacheHost"
                        value={systemSettings.cacheHost}
                        onChange={(e) => handleInputChange('cacheHost', e.target.value)}
                        placeholder="localhost"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cachePort">Puerto de Redis</Label>
                      <Input
                        id="cachePort"
                        value={systemSettings.cachePort}
                        onChange={(e) => handleInputChange('cachePort', e.target.value)}
                        placeholder="6379"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </ModuleCard>

        {/* Configuración de Logs */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="mr-2 h-5 w-5" />
              Configuración de Logs
            </CardTitle>
            <CardDescription>
              Configuración del sistema de logging y monitoreo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logLevel">Nivel de Log</Label>
                <Select value={systemSettings.logLevel} onValueChange={(value) => handleInputChange('logLevel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logFile">Archivo de Log</Label>
                <Input
                  id="logFile"
                  value={systemSettings.logFile}
                  onChange={(e) => handleInputChange('logFile', e.target.value)}
                  placeholder="/var/log/asismedicare.log"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logMaxSize">Tamaño Máximo</Label>
                <Input
                  id="logMaxSize"
                  value={systemSettings.logMaxSize}
                  onChange={(e) => handleInputChange('logMaxSize', e.target.value)}
                  placeholder="100MB"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logMaxFiles">Archivos Máximos</Label>
                <Input
                  id="logMaxFiles"
                  value={systemSettings.logMaxFiles}
                  onChange={(e) => handleInputChange('logMaxFiles', e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="logCompress"
                checked={systemSettings.logCompress}
                onCheckedChange={(checked) => handleInputChange('logCompress', checked)}
              />
              <Label htmlFor="logCompress">Comprimir Logs</Label>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Configuración de Monitoreo */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Configuración de Monitoreo
            </CardTitle>
            <CardDescription>
              Configuración del sistema de monitoreo y alertas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="monitoringEnabled"
                checked={systemSettings.monitoringEnabled}
                onCheckedChange={(checked) => handleInputChange('monitoringEnabled', checked)}
              />
              <Label htmlFor="monitoringEnabled">Habilitar Monitoreo</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="metricsEnabled"
                checked={systemSettings.metricsEnabled}
                onCheckedChange={(checked) => handleInputChange('metricsEnabled', checked)}
              />
              <Label htmlFor="metricsEnabled">Habilitar Métricas</Label>
            </div>
            
            {systemSettings.monitoringEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="healthCheckInterval">Intervalo de Health Check (min)</Label>
                  <Input
                    id="healthCheckInterval"
                    value={systemSettings.healthCheckInterval}
                    onChange={(e) => handleInputChange('healthCheckInterval', e.target.value)}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alertThreshold">Umbral de Alerta (%)</Label>
                  <Input
                    id="alertThreshold"
                    value={systemSettings.alertThreshold}
                    onChange={(e) => handleInputChange('alertThreshold', e.target.value)}
                    placeholder="80"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </ModuleCard>

        {/* Configuración de Almacenamiento */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HardDrive className="mr-2 h-5 w-5" />
              Configuración de Almacenamiento
            </CardTitle>
            <CardDescription>
              Configuración del sistema de almacenamiento y backup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storageType">Tipo de Almacenamiento</Label>
                <Select value={systemSettings.storageType} onValueChange={(value) => handleInputChange('storageType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="s3">Amazon S3</SelectItem>
                    <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                    <SelectItem value="azure">Azure Blob</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storagePath">Ruta de Almacenamiento</Label>
                <Input
                  id="storagePath"
                  value={systemSettings.storagePath}
                  onChange={(e) => handleInputChange('storagePath', e.target.value)}
                  placeholder="/var/lib/asismedicare"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storageMaxSize">Tamaño Máximo</Label>
              <Input
                id="storageMaxSize"
                value={systemSettings.storageMaxSize}
                onChange={(e) => handleInputChange('storageMaxSize', e.target.value)}
                placeholder="10GB"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="backupEnabled"
                checked={systemSettings.backupEnabled}
                onCheckedChange={(checked) => handleInputChange('backupEnabled', checked)}
              />
              <Label htmlFor="backupEnabled">Habilitar Backup Automático</Label>
            </div>
            
            {systemSettings.backupEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupInterval">Intervalo de Backup</Label>
                  <Select value={systemSettings.backupInterval} onValueChange={(value) => handleInputChange('backupInterval', value)}>
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
                <div className="space-y-2">
                  <Label htmlFor="backupRetention">Retención (días)</Label>
                  <Input
                    id="backupRetention"
                    value={systemSettings.backupRetention}
                    onChange={(e) => handleInputChange('backupRetention', e.target.value)}
                    placeholder="30"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </ModuleCard>

        {/* Configuración de Red */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Network className="mr-2 h-5 w-5" />
              Configuración de Red
            </CardTitle>
            <CardDescription>
              Configuración de CORS, rate limiting y seguridad de red
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="corsEnabled"
                checked={systemSettings.corsEnabled}
                onCheckedChange={(checked) => handleInputChange('corsEnabled', checked)}
              />
              <Label htmlFor="corsEnabled">Habilitar CORS</Label>
            </div>
            
            {systemSettings.corsEnabled && (
              <div className="space-y-2">
                <Label htmlFor="corsOrigins">Orígenes Permitidos</Label>
                <Input
                  id="corsOrigins"
                  value={systemSettings.corsOrigins}
                  onChange={(e) => handleInputChange('corsOrigins', e.target.value)}
                  placeholder="*"
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch
                id="rateLimitEnabled"
                checked={systemSettings.rateLimitEnabled}
                onCheckedChange={(checked) => handleInputChange('rateLimitEnabled', checked)}
              />
              <Label htmlFor="rateLimitEnabled">Habilitar Rate Limiting</Label>
            </div>
            
            {systemSettings.rateLimitEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rateLimitMax">Límite Máximo</Label>
                  <Input
                    id="rateLimitMax"
                    value={systemSettings.rateLimitMax}
                    onChange={(e) => handleInputChange('rateLimitMax', e.target.value)}
                    placeholder="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rateLimitWindow">Ventana (minutos)</Label>
                  <Input
                    id="rateLimitWindow"
                    value={systemSettings.rateLimitWindow}
                    onChange={(e) => handleInputChange('rateLimitWindow', e.target.value)}
                    placeholder="15"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </ModuleCard>

        {/* Configuración de Seguridad */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Configuración de Seguridad
            </CardTitle>
            <CardDescription>
              Configuración de seguridad, encriptación y autenticación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="encryptionEnabled"
                checked={systemSettings.encryptionEnabled}
                onCheckedChange={(checked) => handleInputChange('encryptionEnabled', checked)}
              />
              <Label htmlFor="encryptionEnabled">Habilitar Encriptación</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout de Sesión (min)</Label>
                <Input
                  id="sessionTimeout"
                  value={systemSettings.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                  placeholder="30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Intentos Máximos de Login</Label>
                <Input
                  id="maxLoginAttempts"
                  value={systemSettings.maxLoginAttempts}
                  onChange={(e) => handleInputChange('maxLoginAttempts', e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lockoutDuration">Duración de Bloqueo (min)</Label>
              <Input
                id="lockoutDuration"
                value={systemSettings.lockoutDuration}
                onChange={(e) => handleInputChange('lockoutDuration', e.target.value)}
                placeholder="15"
              />
            </div>
          </CardContent>
        </ModuleCard>

        {/* Configuración de Notificaciones */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Configuración de Notificaciones
            </CardTitle>
            <CardDescription>
              Configuración de canales de notificación y colas de mensajes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="emailEnabled"
                  checked={systemSettings.emailEnabled}
                  onCheckedChange={(checked) => handleInputChange('emailEnabled', checked)}
                />
                <Label htmlFor="emailEnabled">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="smsEnabled"
                  checked={systemSettings.smsEnabled}
                  onCheckedChange={(checked) => handleInputChange('smsEnabled', checked)}
                />
                <Label htmlFor="smsEnabled">SMS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="pushEnabled"
                  checked={systemSettings.pushEnabled}
                  onCheckedChange={(checked) => handleInputChange('pushEnabled', checked)}
                />
                <Label htmlFor="pushEnabled">Push</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notificationQueue">Cola de Notificaciones</Label>
              <Select value={systemSettings.notificationQueue} onValueChange={(value) => handleInputChange('notificationQueue', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="redis">Redis</SelectItem>
                  <SelectItem value="rabbitmq">RabbitMQ</SelectItem>
                  <SelectItem value="sqs">Amazon SQS</SelectItem>
                  <SelectItem value="memory">Memoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Configuración de API */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Network className="mr-2 h-5 w-5" />
              Configuración de API
            </CardTitle>
            <CardDescription>
              Configuración de la API REST y webhooks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="apiEnabled"
                checked={systemSettings.apiEnabled}
                onCheckedChange={(checked) => handleInputChange('apiEnabled', checked)}
              />
              <Label htmlFor="apiEnabled">Habilitar API</Label>
            </div>
            
            {systemSettings.apiEnabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiVersion">Versión de API</Label>
                    <Select value={systemSettings.apiVersion} onValueChange={(value) => handleInputChange('apiVersion', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v1">v1</SelectItem>
                        <SelectItem value="v2">v2</SelectItem>
                        <SelectItem value="v3">v3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiRateLimit">Rate Limit de API</Label>
                    <Input
                      id="apiRateLimit"
                      value={systemSettings.apiRateLimit}
                      onChange={(e) => handleInputChange('apiRateLimit', e.target.value)}
                      placeholder="100"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="webhookEnabled"
                    checked={systemSettings.webhookEnabled}
                    onCheckedChange={(checked) => handleInputChange('webhookEnabled', checked)}
                  />
                  <Label htmlFor="webhookEnabled">Habilitar Webhooks</Label>
                </div>
                
                {systemSettings.webhookEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">URL del Webhook</Label>
                    <Input
                      id="webhookUrl"
                      value={systemSettings.webhookUrl}
                      onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                      placeholder="https://example.com/webhook"
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </ModuleCard>

        {/* Configuración de Mantenimiento */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="mr-2 h-5 w-5" />
              Configuración de Mantenimiento
            </CardTitle>
            <CardDescription>
              Configuración de modo de mantenimiento y actualizaciones automáticas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenanceMode"
                checked={systemSettings.maintenanceMode}
                onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
              />
              <Label htmlFor="maintenanceMode">Modo de Mantenimiento</Label>
            </div>
            
            {systemSettings.maintenanceMode && (
              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Mensaje de Mantenimiento</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={systemSettings.maintenanceMessage}
                  onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
                  placeholder="Sistema en mantenimiento"
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoBackup"
                  checked={systemSettings.autoBackup}
                  onCheckedChange={(checked) => handleInputChange('autoBackup', checked)}
                />
                <Label htmlFor="autoBackup">Backup Automático</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoUpdate"
                  checked={systemSettings.autoUpdate}
                  onCheckedChange={(checked) => handleInputChange('autoUpdate', checked)}
                />
                <Label htmlFor="autoUpdate">Actualizaciones Automáticas</Label>
              </div>
            </div>
            
            {systemSettings.autoUpdate && (
              <div className="space-y-2">
                <Label htmlFor="updateChannel">Canal de Actualización</Label>
                <Select value={systemSettings.updateChannel} onValueChange={(value) => handleInputChange('updateChannel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stable">Estable</SelectItem>
                    <SelectItem value="beta">Beta</SelectItem>
                    <SelectItem value="alpha">Alpha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </ModuleCard>
      </form>
    </ModulePageLayout>
  );
}