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
import { useToast } from '@/hooks/use-toast';
import { Bell, Mail, MessageSquare, Smartphone, Save, RefreshCw, TestTube, Clock, Users, AlertCircle } from 'lucide-react';

export default function NotificacionesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Estados para los campos del formulario
  const [notificationSettings, setNotificationSettings] = useState({
    // Configuración general
    enableNotifications: true,
    notificationLanguage: 'es',
    timezone: 'America/Bogota',
    
    // Email
    enableEmailNotifications: true,
    smtpServer: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@asismedicare.com',
    fromName: 'AsisMediCare',
    
    // SMS
    enableSMSNotifications: false,
    smsProvider: 'twilio',
    smsApiKey: '',
    smsApiSecret: '',
    smsFromNumber: '',
    
    // Push notifications
    enablePushNotifications: true,
    pushProvider: 'firebase',
    pushApiKey: '',
    
    // Tipos de notificaciones
    patientAdmissions: true,
    appointmentReminders: true,
    labResults: true,
    medicationAlerts: true,
    systemAlerts: true,
    securityAlerts: true,
    
    // Horarios
    enableQuietHours: false,
    quietStartHour: '22:00',
    quietEndHour: '08:00',
    weekendNotifications: true,
    
    // Plantillas
    emailTemplate: 'default',
    smsTemplate: 'default',
    pushTemplate: 'default',
    
    // Configuración avanzada
    retryAttempts: '3',
    retryDelay: '5',
    batchSize: '100',
    queueEnabled: true
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setNotificationSettings(prev => ({
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
        description: "La configuración de notificaciones se ha actualizado correctamente.",
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
    if (confirm('¿Estás seguro de restablecer la configuración de notificaciones a los valores por defecto?')) {
      // Restablecer valores por defecto
      setNotificationSettings({
        enableNotifications: true,
        notificationLanguage: 'es',
        timezone: 'America/Bogota',
        enableEmailNotifications: true,
        smtpServer: 'smtp.gmail.com',
        smtpPort: '587',
        smtpUsername: '',
        smtpPassword: '',
        fromEmail: 'noreply@asismedicare.com',
        fromName: 'AsisMediCare',
        enableSMSNotifications: false,
        smsProvider: 'twilio',
        smsApiKey: '',
        smsApiSecret: '',
        smsFromNumber: '',
        enablePushNotifications: true,
        pushProvider: 'firebase',
        pushApiKey: '',
        patientAdmissions: true,
        appointmentReminders: true,
        labResults: true,
        medicationAlerts: true,
        systemAlerts: true,
        securityAlerts: true,
        enableQuietHours: false,
        quietStartHour: '22:00',
        quietEndHour: '08:00',
        weekendNotifications: true,
        emailTemplate: 'default',
        smsTemplate: 'default',
        pushTemplate: 'default',
        retryAttempts: '3',
        retryDelay: '5',
        batchSize: '100',
        queueEnabled: true
      });
      
      toast({
        title: "Configuración restablecida",
        description: "La configuración de notificaciones se ha restablecido a los valores por defecto.",
      });
    }
  };

  const handleTestEmail = () => {
    toast({
      title: "Email de prueba enviado",
      description: "Se ha enviado un email de prueba a la dirección configurada.",
    });
  };

  const handleTestSMS = () => {
    toast({
      title: "SMS de prueba enviado",
      description: "Se ha enviado un SMS de prueba al número configurado.",
    });
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
      title="Configuración de Notificaciones"
      description="Configuración de canales de notificación, plantillas y horarios del sistema"
      actions={actions}
      maxWidth="7xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Configuración General */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Configuración General
            </CardTitle>
            <CardDescription>
              Configuración básica del sistema de notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableNotifications"
                checked={notificationSettings.enableNotifications}
                onCheckedChange={(checked) => handleInputChange('enableNotifications', checked)}
              />
              <Label htmlFor="enableNotifications">Habilitar Notificaciones</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="notificationLanguage">Idioma de Notificaciones</Label>
                <Select value={notificationSettings.notificationLanguage} onValueChange={(value) => handleInputChange('notificationLanguage', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Zona Horaria</Label>
                <Select value={notificationSettings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
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
          </CardContent>
        </ModuleCard>

        {/* Configuración de Email */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Configuración de Email
            </CardTitle>
            <CardDescription>
              Configuración del servidor SMTP para notificaciones por email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableEmailNotifications"
                checked={notificationSettings.enableEmailNotifications}
                onCheckedChange={(checked) => handleInputChange('enableEmailNotifications', checked)}
              />
              <Label htmlFor="enableEmailNotifications">Habilitar Notificaciones por Email</Label>
            </div>
            
            {notificationSettings.enableEmailNotifications && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer">Servidor SMTP</Label>
                    <Input
                      id="smtpServer"
                      value={notificationSettings.smtpServer}
                      onChange={(e) => handleInputChange('smtpServer', e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Puerto SMTP</Label>
                    <Input
                      id="smtpPort"
                      value={notificationSettings.smtpPort}
                      onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                      placeholder="587"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">Usuario SMTP</Label>
                    <Input
                      id="smtpUsername"
                      value={notificationSettings.smtpUsername}
                      onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                      placeholder="usuario@ejemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">Contraseña SMTP</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={notificationSettings.smtpPassword}
                      onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">Email Remitente</Label>
                    <Input
                      id="fromEmail"
                      value={notificationSettings.fromEmail}
                      onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                      placeholder="noreply@asismedicare.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fromName">Nombre Remitente</Label>
                    <Input
                      id="fromName"
                      value={notificationSettings.fromName}
                      onChange={(e) => handleInputChange('fromName', e.target.value)}
                      placeholder="AsisMediCare"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={handleTestEmail}>
                    <TestTube className="mr-2 h-4 w-4" />
                    Probar Email
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </ModuleCard>

        {/* Configuración de SMS */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Configuración de SMS
            </CardTitle>
            <CardDescription>
              Configuración del proveedor de SMS para notificaciones por mensaje de texto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableSMSNotifications"
                checked={notificationSettings.enableSMSNotifications}
                onCheckedChange={(checked) => handleInputChange('enableSMSNotifications', checked)}
              />
              <Label htmlFor="enableSMSNotifications">Habilitar Notificaciones por SMS</Label>
            </div>
            
            {notificationSettings.enableSMSNotifications && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="smsProvider">Proveedor de SMS</Label>
                  <Select value={notificationSettings.smsProvider} onValueChange={(value) => handleInputChange('smsProvider', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="nexmo">Nexmo</SelectItem>
                      <SelectItem value="aws">AWS SNS</SelectItem>
                      <SelectItem value="local">Local</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smsApiKey">API Key</Label>
                    <Input
                      id="smsApiKey"
                      value={notificationSettings.smsApiKey}
                      onChange={(e) => handleInputChange('smsApiKey', e.target.value)}
                      placeholder="API Key del proveedor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smsApiSecret">API Secret</Label>
                    <Input
                      id="smsApiSecret"
                      type="password"
                      value={notificationSettings.smsApiSecret}
                      onChange={(e) => handleInputChange('smsApiSecret', e.target.value)}
                      placeholder="API Secret del proveedor"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smsFromNumber">Número Remitente</Label>
                  <Input
                    id="smsFromNumber"
                    value={notificationSettings.smsFromNumber}
                    onChange={(e) => handleInputChange('smsFromNumber', e.target.value)}
                    placeholder="+1234567890"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={handleTestSMS}>
                    <TestTube className="mr-2 h-4 w-4" />
                    Probar SMS
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </ModuleCard>

        {/* Configuración de Push Notifications */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="mr-2 h-5 w-5" />
              Configuración de Push Notifications
            </CardTitle>
            <CardDescription>
              Configuración de notificaciones push para aplicaciones móviles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enablePushNotifications"
                checked={notificationSettings.enablePushNotifications}
                onCheckedChange={(checked) => handleInputChange('enablePushNotifications', checked)}
              />
              <Label htmlFor="enablePushNotifications">Habilitar Push Notifications</Label>
            </div>
            
            {notificationSettings.enablePushNotifications && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pushProvider">Proveedor de Push</Label>
                  <Select value={notificationSettings.pushProvider} onValueChange={(value) => handleInputChange('pushProvider', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="firebase">Firebase</SelectItem>
                      <SelectItem value="onesignal">OneSignal</SelectItem>
                      <SelectItem value="pusher">Pusher</SelectItem>
                      <SelectItem value="local">Local</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pushApiKey">API Key</Label>
                  <Input
                    id="pushApiKey"
                    value={notificationSettings.pushApiKey}
                    onChange={(e) => handleInputChange('pushApiKey', e.target.value)}
                    placeholder="API Key del proveedor"
                  />
                </div>
              </>
            )}
          </CardContent>
        </ModuleCard>

        {/* Tipos de Notificaciones */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Tipos de Notificaciones
            </CardTitle>
            <CardDescription>
              Configuración de qué tipos de eventos generan notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="patientAdmissions"
                  checked={notificationSettings.patientAdmissions}
                  onCheckedChange={(checked) => handleInputChange('patientAdmissions', checked)}
                />
                <Label htmlFor="patientAdmissions">Admisiones de Pacientes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="appointmentReminders"
                  checked={notificationSettings.appointmentReminders}
                  onCheckedChange={(checked) => handleInputChange('appointmentReminders', checked)}
                />
                <Label htmlFor="appointmentReminders">Recordatorios de Citas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="labResults"
                  checked={notificationSettings.labResults}
                  onCheckedChange={(checked) => handleInputChange('labResults', checked)}
                />
                <Label htmlFor="labResults">Resultados de Laboratorio</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="medicationAlerts"
                  checked={notificationSettings.medicationAlerts}
                  onCheckedChange={(checked) => handleInputChange('medicationAlerts', checked)}
                />
                <Label htmlFor="medicationAlerts">Alertas de Medicamentos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="systemAlerts"
                  checked={notificationSettings.systemAlerts}
                  onCheckedChange={(checked) => handleInputChange('systemAlerts', checked)}
                />
                <Label htmlFor="systemAlerts">Alertas del Sistema</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="securityAlerts"
                  checked={notificationSettings.securityAlerts}
                  onCheckedChange={(checked) => handleInputChange('securityAlerts', checked)}
                />
                <Label htmlFor="securityAlerts">Alertas de Seguridad</Label>
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Configuración de Horarios */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Configuración de Horarios
            </CardTitle>
            <CardDescription>
              Configuración de horarios de silencio y notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableQuietHours"
                checked={notificationSettings.enableQuietHours}
                onCheckedChange={(checked) => handleInputChange('enableQuietHours', checked)}
              />
              <Label htmlFor="enableQuietHours">Habilitar Horarios de Silencio</Label>
            </div>
            
            {notificationSettings.enableQuietHours && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quietStartHour">Hora de Inicio</Label>
                  <Input
                    id="quietStartHour"
                    type="time"
                    value={notificationSettings.quietStartHour}
                    onChange={(e) => handleInputChange('quietStartHour', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quietEndHour">Hora de Fin</Label>
                  <Input
                    id="quietEndHour"
                    type="time"
                    value={notificationSettings.quietEndHour}
                    onChange={(e) => handleInputChange('quietEndHour', e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Switch
                id="weekendNotifications"
                checked={notificationSettings.weekendNotifications}
                onCheckedChange={(checked) => handleInputChange('weekendNotifications', checked)}
              />
              <Label htmlFor="weekendNotifications">Notificaciones en Fines de Semana</Label>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Plantillas de Notificación */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Plantillas de Notificación
            </CardTitle>
            <CardDescription>
              Configuración de plantillas para diferentes tipos de notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emailTemplate">Plantilla de Email</Label>
                <Select value={notificationSettings.emailTemplate} onValueChange={(value) => handleInputChange('emailTemplate', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Por Defecto</SelectItem>
                    <SelectItem value="medical">Médica</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="custom">Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smsTemplate">Plantilla de SMS</Label>
                <Select value={notificationSettings.smsTemplate} onValueChange={(value) => handleInputChange('smsTemplate', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Por Defecto</SelectItem>
                    <SelectItem value="short">Corta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="custom">Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pushTemplate">Plantilla de Push</Label>
                <Select value={notificationSettings.pushTemplate} onValueChange={(value) => handleInputChange('pushTemplate', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Por Defecto</SelectItem>
                    <SelectItem value="medical">Médica</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="custom">Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Configuración Avanzada */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Configuración Avanzada
            </CardTitle>
            <CardDescription>
              Configuración avanzada del sistema de notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="retryAttempts">Intentos de Reenvío</Label>
                <Input
                  id="retryAttempts"
                  value={notificationSettings.retryAttempts}
                  onChange={(e) => handleInputChange('retryAttempts', e.target.value)}
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retryDelay">Delay entre Intentos (min)</Label>
                <Input
                  id="retryDelay"
                  value={notificationSettings.retryDelay}
                  onChange={(e) => handleInputChange('retryDelay', e.target.value)}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchSize">Tamaño de Lote</Label>
                <Input
                  id="batchSize"
                  value={notificationSettings.batchSize}
                  onChange={(e) => handleInputChange('batchSize', e.target.value)}
                  placeholder="100"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="queueEnabled"
                checked={notificationSettings.queueEnabled}
                onCheckedChange={(checked) => handleInputChange('queueEnabled', checked)}
              />
              <Label htmlFor="queueEnabled">Habilitar Cola de Notificaciones</Label>
            </div>
          </CardContent>
        </ModuleCard>
      </form>
    </ModulePageLayout>
  );
}