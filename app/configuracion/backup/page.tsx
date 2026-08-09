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
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, 
  Download, 
  Upload, 
  Save, 
  RefreshCw, 
  Clock, 
  HardDrive, 
  Cloud,
  Shield,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Trash2
} from 'lucide-react';

export default function BackupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [backupSettings, setBackupSettings] = useState({
    // Configuración general
    enableAutoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: '30',
    compressionEnabled: true,
    encryptionEnabled: true,
    
    // Ubicaciones
    localBackupEnabled: true,
    localBackupPath: '/var/backups/asismedicare',
    cloudBackupEnabled: false,
    cloudProvider: 'aws',
    cloudBucket: '',
    cloudRegion: 'us-east-1',
    
    // Configuración de base de datos
    includeDatabase: true,
    includeFiles: true,
    includeLogs: false,
    includeConfig: true,
    
    // Configuración de encriptación
    encryptionKey: '',
    encryptionAlgorithm: 'AES-256',
    
    // Configuración de compresión
    compressionLevel: '6',
    compressionFormat: 'gzip',
    
    // Configuración de verificación
    verifyBackups: true,
    testRestore: false,
    checksumVerification: true
  });

  // Datos de ejemplo para backups existentes
  const [existingBackups] = useState([
    {
      id: 1,
      name: 'backup_2024_01_15_020000',
      type: 'full',
      size: '2.3 GB',
      date: '2024-01-15 02:00:00',
      status: 'completed',
      location: 'local'
    },
    {
      id: 2,
      name: 'backup_2024_01_14_020000',
      type: 'incremental',
      size: '156 MB',
      date: '2024-01-14 02:00:00',
      status: 'completed',
      location: 'local'
    },
    {
      id: 3,
      name: 'backup_2024_01_13_020000',
      type: 'full',
      size: '2.1 GB',
      date: '2024-01-13 02:00:00',
      status: 'failed',
      location: 'local'
    }
  ]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setBackupSettings(prev => ({
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
        description: "La configuración de backup se ha actualizado correctamente.",
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
    if (confirm('¿Estás seguro de restablecer la configuración de backup a los valores por defecto?')) {
      // Restablecer valores por defecto
      setBackupSettings({
        enableAutoBackup: true,
        backupFrequency: 'daily',
        backupTime: '02:00',
        retentionDays: '30',
        compressionEnabled: true,
        encryptionEnabled: true,
        localBackupEnabled: true,
        localBackupPath: '/var/backups/asismedicare',
        cloudBackupEnabled: false,
        cloudProvider: 'aws',
        cloudBucket: '',
        cloudRegion: 'us-east-1',
        includeDatabase: true,
        includeFiles: true,
        includeLogs: false,
        includeConfig: true,
        encryptionKey: '',
        encryptionAlgorithm: 'AES-256',
        compressionLevel: '6',
        compressionFormat: 'gzip',
        verifyBackups: true,
        testRestore: false,
        checksumVerification: true
      });
      
      toast({
        title: "Configuración restablecida",
        description: "La configuración de backup se ha restablecido a los valores por defecto.",
      });
    }
  };

  const handleStartBackup = async () => {
    setIsBackupRunning(true);
    setBackupProgress(0);
    
    // Simular progreso de backup
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackupRunning(false);
          toast({
            title: "Backup completado",
            description: "El backup se ha completado exitosamente.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleRestoreBackup = (backupId: number) => {
    toast({
      title: "Restauración iniciada",
      description: `Se ha iniciado la restauración del backup ${backupId}.`,
    });
  };

  const handleDeleteBackup = (backupId: number) => {
    if (confirm('¿Estás seguro de eliminar este backup?')) {
      toast({
        title: "Backup eliminado",
        description: `El backup ${backupId} ha sido eliminado.`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completado</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Fallido</Badge>;
      case 'running':
        return <Badge variant="secondary"><Play className="w-3 h-3 mr-1" />Ejecutando</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
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
      title="Backup y Restauración"
      description="Configuración de respaldos automáticos, restauración y gestión de backups del sistema"
      actions={actions}
      maxWidth="7xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Configuración General */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Configuración General
            </CardTitle>
            <CardDescription>
              Configuración básica de respaldos automáticos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableAutoBackup"
                checked={backupSettings.enableAutoBackup}
                onCheckedChange={(checked) => handleInputChange('enableAutoBackup', checked)}
              />
              <Label htmlFor="enableAutoBackup">Habilitar Backup Automático</Label>
            </div>
            
            {backupSettings.enableAutoBackup && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Frecuencia</Label>
                    <Select value={backupSettings.backupFrequency} onValueChange={(value) => handleInputChange('backupFrequency', value)}>
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
                    <Label htmlFor="backupTime">Hora de Backup</Label>
                    <Input
                      id="backupTime"
                      type="time"
                      value={backupSettings.backupTime}
                      onChange={(e) => handleInputChange('backupTime', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retentionDays">Retención (días)</Label>
                    <Input
                      id="retentionDays"
                      value={backupSettings.retentionDays}
                      onChange={(e) => handleInputChange('retentionDays', e.target.value)}
                      placeholder="30"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="compressionEnabled"
                      checked={backupSettings.compressionEnabled}
                      onCheckedChange={(checked) => handleInputChange('compressionEnabled', checked)}
                    />
                    <Label htmlFor="compressionEnabled">Habilitar Compresión</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="encryptionEnabled"
                      checked={backupSettings.encryptionEnabled}
                      onCheckedChange={(checked) => handleInputChange('encryptionEnabled', checked)}
                    />
                    <Label htmlFor="encryptionEnabled">Habilitar Encriptación</Label>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </ModuleCard>

        {/* Ubicaciones de Backup */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HardDrive className="mr-2 h-5 w-5" />
              Ubicaciones de Backup
            </CardTitle>
            <CardDescription>
              Configuración de ubicaciones locales y en la nube para almacenar backups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="localBackupEnabled"
                checked={backupSettings.localBackupEnabled}
                onCheckedChange={(checked) => handleInputChange('localBackupEnabled', checked)}
              />
              <Label htmlFor="localBackupEnabled">Habilitar Backup Local</Label>
            </div>
            
            {backupSettings.localBackupEnabled && (
              <div className="space-y-2">
                <Label htmlFor="localBackupPath">Ruta de Backup Local</Label>
                <Input
                  id="localBackupPath"
                  value={backupSettings.localBackupPath}
                  onChange={(e) => handleInputChange('localBackupPath', e.target.value)}
                  placeholder="/var/backups/asismedicare"
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch
                id="cloudBackupEnabled"
                checked={backupSettings.cloudBackupEnabled}
                onCheckedChange={(checked) => handleInputChange('cloudBackupEnabled', checked)}
              />
              <Label htmlFor="cloudBackupEnabled">Habilitar Backup en la Nube</Label>
            </div>
            
            {backupSettings.cloudBackupEnabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cloudProvider">Proveedor de Nube</Label>
                    <Select value={backupSettings.cloudProvider} onValueChange={(value) => handleInputChange('cloudProvider', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aws">Amazon S3</SelectItem>
                        <SelectItem value="gcp">Google Cloud Storage</SelectItem>
                        <SelectItem value="azure">Azure Blob Storage</SelectItem>
                        <SelectItem value="dropbox">Dropbox</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cloudRegion">Región</Label>
                    <Input
                      id="cloudRegion"
                      value={backupSettings.cloudRegion}
                      onChange={(e) => handleInputChange('cloudRegion', e.target.value)}
                      placeholder="us-east-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cloudBucket">Bucket/Contenedor</Label>
                  <Input
                    id="cloudBucket"
                    value={backupSettings.cloudBucket}
                    onChange={(e) => handleInputChange('cloudBucket', e.target.value)}
                    placeholder="asismedicare-backups"
                  />
                </div>
              </>
            )}
          </CardContent>
        </ModuleCard>

        {/* Contenido del Backup */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Contenido del Backup
            </CardTitle>
            <CardDescription>
              Configuración de qué datos incluir en los backups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="includeDatabase"
                  checked={backupSettings.includeDatabase}
                  onCheckedChange={(checked) => handleInputChange('includeDatabase', checked)}
                />
                <Label htmlFor="includeDatabase">Incluir Base de Datos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="includeFiles"
                  checked={backupSettings.includeFiles}
                  onCheckedChange={(checked) => handleInputChange('includeFiles', checked)}
                />
                <Label htmlFor="includeFiles">Incluir Archivos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="includeLogs"
                  checked={backupSettings.includeLogs}
                  onCheckedChange={(checked) => handleInputChange('includeLogs', checked)}
                />
                <Label htmlFor="includeLogs">Incluir Logs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="includeConfig"
                  checked={backupSettings.includeConfig}
                  onCheckedChange={(checked) => handleInputChange('includeConfig', checked)}
                />
                <Label htmlFor="includeConfig">Incluir Configuración</Label>
              </div>
            </div>
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
              Configuración de encriptación para backups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {backupSettings.encryptionEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="encryptionKey">Clave de Encriptación</Label>
                  <Input
                    id="encryptionKey"
                    type="password"
                    value={backupSettings.encryptionKey}
                    onChange={(e) => handleInputChange('encryptionKey', e.target.value)}
                    placeholder="Ingresa la clave de encriptación"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="encryptionAlgorithm">Algoritmo de Encriptación</Label>
                  <Select value={backupSettings.encryptionAlgorithm} onValueChange={(value) => handleInputChange('encryptionAlgorithm', value)}>
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
              </>
            )}
          </CardContent>
        </ModuleCard>

        {/* Configuración de Compresión */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HardDrive className="mr-2 h-5 w-5" />
              Configuración de Compresión
            </CardTitle>
            <CardDescription>
              Configuración de compresión para optimizar el tamaño de los backups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {backupSettings.compressionEnabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="compressionLevel">Nivel de Compresión (1-9)</Label>
                    <Input
                      id="compressionLevel"
                      value={backupSettings.compressionLevel}
                      onChange={(e) => handleInputChange('compressionLevel', e.target.value)}
                      placeholder="6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compressionFormat">Formato de Compresión</Label>
                    <Select value={backupSettings.compressionFormat} onValueChange={(value) => handleInputChange('compressionFormat', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gzip">GZIP</SelectItem>
                        <SelectItem value="bzip2">BZIP2</SelectItem>
                        <SelectItem value="xz">XZ</SelectItem>
                        <SelectItem value="zip">ZIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </ModuleCard>

        {/* Configuración de Verificación */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Configuración de Verificación
            </CardTitle>
            <CardDescription>
              Configuración de verificación y validación de backups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="verifyBackups"
                  checked={backupSettings.verifyBackups}
                  onCheckedChange={(checked) => handleInputChange('verifyBackups', checked)}
                />
                <Label htmlFor="verifyBackups">Verificar Backups</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="testRestore"
                  checked={backupSettings.testRestore}
                  onCheckedChange={(checked) => handleInputChange('testRestore', checked)}
                />
                <Label htmlFor="testRestore">Probar Restauración</Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="checksumVerification"
                checked={backupSettings.checksumVerification}
                onCheckedChange={(checked) => handleInputChange('checksumVerification', checked)}
              />
              <Label htmlFor="checksumVerification">Verificación de Checksum</Label>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Backup Manual */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="mr-2 h-5 w-5" />
              Backup Manual
            </CardTitle>
            <CardDescription>
              Ejecutar un backup manual del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Ejecutar Backup Ahora</h4>
                <p className="text-sm text-muted-foreground">
                  Inicia un backup completo del sistema inmediatamente
                </p>
              </div>
              <Button 
                onClick={handleStartBackup} 
                disabled={isBackupRunning}
                className="flex items-center space-x-2"
              >
                {isBackupRunning ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Ejecutando...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Iniciar Backup</span>
                  </>
                )}
              </Button>
            </div>
            
            {isBackupRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso del Backup</span>
                  <span>{backupProgress}%</span>
                </div>
                <Progress value={backupProgress} className="w-full" />
              </div>
            )}
          </CardContent>
        </ModuleCard>

        {/* Backups Existentes */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Backups Existentes
            </CardTitle>
            <CardDescription>
              Lista de backups disponibles para restauración
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {existingBackups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium">{backup.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Tipo: {backup.type}</span>
                          <span>Tamaño: {backup.size}</span>
                          <span>Fecha: {backup.date}</span>
                          <span>Ubicación: {backup.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(backup.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreBackup(backup.id)}
                      disabled={backup.status === 'failed'}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Restaurar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBackup(backup.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </ModuleCard>
      </form>
    </ModulePageLayout>
  );
}