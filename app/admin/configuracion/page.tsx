'use client';

import React, { useState, useEffect } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  Settings, 
  Globe, 
  Clock, 
  Database, 
  Mail, 
  Bell, 
  Shield, 
  FileText,
  Calendar,
  Users,
  Activity,
  Palette
} from 'lucide-react';
import { toast } from 'sonner';

interface ConfiguracionGeneralData {
  // Configuración General
  nombreSistema: string;
  versionSistema: string;
  idiomaDefault: string;
  zonaHoraria: string;
  formatoFecha: string;
  formatoHora: string;
  moneda: string;

  // Base de Datos
  tipoBackup: string;
  frecuenciaBackup: string;
  horaBackup: string;
  retencionBackup: number;
  rutaBackup: string;

  // Correo Electrónico
  servidorSMTP: string;
  puertoSMTP: number;
  usuarioSMTP: string;
  passwordSMTP: string;
  encriptacionSMTP: string;
  emailRemitente: string;
  nombreRemitente: string;

  // Notificaciones
  notificacionesEmail: boolean;
  notificacionesSMS: boolean;
  notificacionesPush: boolean;
  notificacionesWhatsApp: boolean;

  // Seguridad
  sesionTimeout: number;
  intentosLogin: number;
  bloqueoCuenta: number;
  longitudMinPassword: number;
  requiereCaracteresEspeciales: boolean;
  requiereNumeros: boolean;
  requireMayusculas: boolean;
  expiracionPassword: number;

  // Citas y Agenda
  duracionCitaDefault: number;
  anticipacionCita: number;
  cancelacionCita: number;
  recordatorioCita: number;
  citasSimultaneas: number;

  // Facturación
  prefijoFactura: string;
  consecutivoFactura: number;
  IVA: number;
  retencionFuente: number;
  diasVencimiento: number;

  // Historias Clínicas
  formatoHistoria: string;
  firmaDigital: boolean;
  consentimientoInformado: boolean;
  historiaElectronicaUnica: boolean;

  // Interfaz de Usuario
  tema: string;
  colorPrimario: string;
  colorSecundario: string;
  mostrarLogo: boolean;
  compactarMenu: boolean;

  // Límites del Sistema
  pacientesPorPagina: number;
  registrosPorPagina: number;
  tamanioMaxArchivo: number;
  sesionesSimultaneas: number;

  // Logs y Auditoría
  registrarLogs: boolean;
  nivelLogs: string;
  retencionLogs: number;
  auditoriaCambios: boolean;

  // Integración
  apiHabilitada: boolean;
  apiKey: string;
  webhookURL: string;
}

export default function ConfiguracionGeneralPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState<ConfiguracionGeneralData>({
    // Configuración General
    nombreSistema: 'AsisMediCare',
    versionSistema: '1.0.0',
    idiomaDefault: 'es',
    zonaHoraria: 'America/Bogota',
    formatoFecha: 'DD/MM/YYYY',
    formatoHora: '24h',
    moneda: 'COP',

    // Base de Datos
    tipoBackup: 'completo',
    frecuenciaBackup: 'diario',
    horaBackup: '02:00',
    retencionBackup: 30,
    rutaBackup: '/backups',

    // Correo Electrónico
    servidorSMTP: '',
    puertoSMTP: 587,
    usuarioSMTP: '',
    passwordSMTP: '',
    encriptacionSMTP: 'TLS',
    emailRemitente: '',
    nombreRemitente: 'AsisMediCare',

    // Notificaciones
    notificacionesEmail: true,
    notificacionesSMS: false,
    notificacionesPush: true,
    notificacionesWhatsApp: false,

    // Seguridad
    sesionTimeout: 30,
    intentosLogin: 3,
    bloqueoCuenta: 15,
    longitudMinPassword: 8,
    requiereCaracteresEspeciales: true,
    requiereNumeros: true,
    requireMayusculas: true,
    expiracionPassword: 90,

    // Citas y Agenda
    duracionCitaDefault: 30,
    anticipacionCita: 24,
    cancelacionCita: 2,
    recordatorioCita: 24,
    citasSimultaneas: 1,

    // Facturación
    prefijoFactura: 'FAC',
    consecutivoFactura: 1,
    IVA: 19,
    retencionFuente: 0,
    diasVencimiento: 30,

    // Historias Clínicas
    formatoHistoria: 'SOAP',
    firmaDigital: true,
    consentimientoInformado: true,
    historiaElectronicaUnica: true,

    // Interfaz de Usuario
    tema: 'light',
    colorPrimario: '#3B82F6',
    colorSecundario: '#10B981',
    mostrarLogo: true,
    compactarMenu: false,

    // Límites del Sistema
    pacientesPorPagina: 20,
    registrosPorPagina: 50,
    tamanioMaxArchivo: 10,
    sesionesSimultaneas: 5,

    // Logs y Auditoría
    registrarLogs: true,
    nivelLogs: 'info',
    retencionLogs: 90,
    auditoriaCambios: true,

    // Integración
    apiHabilitada: false,
    apiKey: '',
    webhookURL: ''
  });

  // Cargar configuración desde la base de datos al montar el componente
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setIsLoadingData(true);
        const response = await fetch('/api/configuracion/general?category=general');
        const result = await response.json();

        if (result.success && result.data) {
          // Convertir el array de configuraciones a objeto plano
          const configObject: any = {};
          if (Array.isArray(result.data)) {
            result.data.forEach((config: any) => {
              // Remover el prefijo "general." si existe
              const key = config.key.replace(/^general\./, '');
              configObject[key] = config.value;
            });
          } else if (typeof result.data === 'object') {
            // Si es un objeto plano, remover prefijos
            Object.entries(result.data).forEach(([key, value]) => {
              const cleanKey = key.replace(/^general\./, '');
              configObject[cleanKey] = value;
            });
          }

          // Actualizar el formulario con los valores guardados
          if (Object.keys(configObject).length > 0) {
            setFormData(prev => ({
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

  const handleInputChange = (field: keyof ConfiguracionGeneralData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/configuracion/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          configs: formData,
          category: 'general',
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Configuración guardada correctamente en la base de datos');
      } else {
        throw new Error(result.error || 'Error al guardar la configuración');
      }
    } catch (error: any) {
      console.error('Error guardando configuración:', error);
      toast.error(error.message || 'Error al guardar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const actions = (
    <Button type="submit" form="config-form" disabled={isLoading}>
      <Save className="h-4 w-4 mr-2" />
      {isLoading ? 'Guardando...' : 'Guardar Configuración'}
    </Button>
  );

  if (isLoadingData) {
    return (
      <ModulePageLayout
        title="Configuración General del Sistema"
        description="Cargando configuración..."
        maxWidth="7xl"
        showBackButton={true}
      >
        <div className="flex items-center justify-center p-8">
          <p>Cargando configuración desde la base de datos...</p>
        </div>
      </ModulePageLayout>
    );
  }

  return (
    <ModulePageLayout
      title="Configuración General del Sistema"
      description="Configure los parámetros generales de la aplicación"
      actions={actions}
      maxWidth="7xl"
      showBackButton={true}
    >
      <form id="config-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Configuración General */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombreSistema">Nombre del Sistema</Label>
                <Input
                  id="nombreSistema"
                  value={formData.nombreSistema}
                  onChange={(e) => handleInputChange('nombreSistema', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="versionSistema">Versión</Label>
                <Input
                  id="versionSistema"
                  value={formData.versionSistema}
                  onChange={(e) => handleInputChange('versionSistema', e.target.value)}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idiomaDefault">Idioma Predeterminado</Label>
                <Select value={formData.idiomaDefault} onValueChange={(value) => handleInputChange('idiomaDefault', value)}>
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
                <Label htmlFor="zonaHoraria">Zona Horaria</Label>
                <Select value={formData.zonaHoraria} onValueChange={(value) => handleInputChange('zonaHoraria', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Bogota">Colombia (UTC-5)</SelectItem>
                    <SelectItem value="America/Mexico_City">México (UTC-6)</SelectItem>
                    <SelectItem value="America/Buenos_Aires">Argentina (UTC-3)</SelectItem>
                    <SelectItem value="America/Lima">Perú (UTC-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="formatoFecha">Formato de Fecha</Label>
                <Select value={formData.formatoFecha} onValueChange={(value) => handleInputChange('formatoFecha', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="formatoHora">Formato de Hora</Label>
                <Select value={formData.formatoHora} onValueChange={(value) => handleInputChange('formatoHora', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 horas</SelectItem>
                    <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="moneda">Moneda</Label>
                <Select value={formData.moneda} onValueChange={(value) => handleInputChange('moneda', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                    <SelectItem value="USD">USD - Dólar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Base de Datos y Backups */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Base de Datos y Backups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoBackup">Tipo de Backup</Label>
                <Select value={formData.tipoBackup} onValueChange={(value) => handleInputChange('tipoBackup', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completo">Completo</SelectItem>
                    <SelectItem value="incremental">Incremental</SelectItem>
                    <SelectItem value="diferencial">Diferencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frecuenciaBackup">Frecuencia</Label>
                <Select value={formData.frecuenciaBackup} onValueChange={(value) => handleInputChange('frecuenciaBackup', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="horario">Cada hora</SelectItem>
                    <SelectItem value="diario">Diario</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensual">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaBackup">Hora de Ejecución</Label>
                <Input
                  id="horaBackup"
                  type="time"
                  value={formData.horaBackup}
                  onChange={(e) => handleInputChange('horaBackup', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retencionBackup">Retención (días)</Label>
                <Input
                  id="retencionBackup"
                  type="number"
                  min="1"
                  value={formData.retencionBackup}
                  onChange={(e) => handleInputChange('retencionBackup', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="rutaBackup">Ruta de Backups</Label>
                <Input
                  id="rutaBackup"
                  value={formData.rutaBackup}
                  onChange={(e) => handleInputChange('rutaBackup', e.target.value)}
                  placeholder="/ruta/de/backups"
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Configuración de Correo */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configuración de Correo Electrónico (SMTP)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="servidorSMTP">Servidor SMTP</Label>
                <Input
                  id="servidorSMTP"
                  value={formData.servidorSMTP}
                  onChange={(e) => handleInputChange('servidorSMTP', e.target.value)}
                  placeholder="smtp.ejemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="puertoSMTP">Puerto</Label>
                <Input
                  id="puertoSMTP"
                  type="number"
                  value={formData.puertoSMTP}
                  onChange={(e) => handleInputChange('puertoSMTP', parseInt(e.target.value))}
                  placeholder="587"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usuarioSMTP">Usuario</Label>
                <Input
                  id="usuarioSMTP"
                  value={formData.usuarioSMTP}
                  onChange={(e) => handleInputChange('usuarioSMTP', e.target.value)}
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordSMTP">Contraseña</Label>
                <Input
                  id="passwordSMTP"
                  type="password"
                  value={formData.passwordSMTP}
                  onChange={(e) => handleInputChange('passwordSMTP', e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="encriptacionSMTP">Encriptación</Label>
                <Select value={formData.encriptacionSMTP} onValueChange={(value) => handleInputChange('encriptacionSMTP', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TLS">TLS</SelectItem>
                    <SelectItem value="SSL">SSL</SelectItem>
                    <SelectItem value="ninguna">Sin encriptación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailRemitente">Email Remitente</Label>
                <Input
                  id="emailRemitente"
                  type="email"
                  value={formData.emailRemitente}
                  onChange={(e) => handleInputChange('emailRemitente', e.target.value)}
                  placeholder="noreply@ejemplo.com"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nombreRemitente">Nombre del Remitente</Label>
                <Input
                  id="nombreRemitente"
                  value={formData.nombreRemitente}
                  onChange={(e) => handleInputChange('nombreRemitente', e.target.value)}
                  placeholder="AsisMediCare"
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Notificaciones */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Canales de Notificación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="notificacionesEmail" className="cursor-pointer">Notificaciones por Email</Label>
                  <p className="text-sm text-muted-foreground">Enviar notificaciones vía correo electrónico</p>
                </div>
                <Switch
                  id="notificacionesEmail"
                  checked={formData.notificacionesEmail}
                  onCheckedChange={(checked) => handleInputChange('notificacionesEmail', checked)}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="notificacionesSMS" className="cursor-pointer">Notificaciones por SMS</Label>
                  <p className="text-sm text-muted-foreground">Enviar notificaciones vía mensajes de texto</p>
                </div>
                <Switch
                  id="notificacionesSMS"
                  checked={formData.notificacionesSMS}
                  onCheckedChange={(checked) => handleInputChange('notificacionesSMS', checked)}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="notificacionesPush" className="cursor-pointer">Notificaciones Push</Label>
                  <p className="text-sm text-muted-foreground">Enviar notificaciones push en navegador</p>
                </div>
                <Switch
                  id="notificacionesPush"
                  checked={formData.notificacionesPush}
                  onCheckedChange={(checked) => handleInputChange('notificacionesPush', checked)}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="notificacionesWhatsApp" className="cursor-pointer">Notificaciones WhatsApp</Label>
                  <p className="text-sm text-muted-foreground">Enviar notificaciones vía WhatsApp</p>
                </div>
                <Switch
                  id="notificacionesWhatsApp"
                  checked={formData.notificacionesWhatsApp}
                  onCheckedChange={(checked) => handleInputChange('notificacionesWhatsApp', checked)}
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Seguridad */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Seguridad y Autenticación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sesionTimeout">Timeout de Sesión (min)</Label>
                <Input
                  id="sesionTimeout"
                  type="number"
                  min="5"
                  value={formData.sesionTimeout}
                  onChange={(e) => handleInputChange('sesionTimeout', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intentosLogin">Intentos de Login</Label>
                <Input
                  id="intentosLogin"
                  type="number"
                  min="1"
                  value={formData.intentosLogin}
                  onChange={(e) => handleInputChange('intentosLogin', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloqueoCuenta">Bloqueo Cuenta (min)</Label>
                <Input
                  id="bloqueoCuenta"
                  type="number"
                  min="5"
                  value={formData.bloqueoCuenta}
                  onChange={(e) => handleInputChange('bloqueoCuenta', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitudMinPassword">Long. Mín. Contraseña</Label>
                <Input
                  id="longitudMinPassword"
                  type="number"
                  min="6"
                  value={formData.longitudMinPassword}
                  onChange={(e) => handleInputChange('longitudMinPassword', parseInt(e.target.value))}
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-3">Requisitos de Contraseña</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                  <Label htmlFor="requiereCaracteresEspeciales" className="cursor-pointer">Caracteres Especiales</Label>
                  <Switch
                    id="requiereCaracteresEspeciales"
                    checked={formData.requiereCaracteresEspeciales}
                    onCheckedChange={(checked) => handleInputChange('requiereCaracteresEspeciales', checked)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                  <Label htmlFor="requiereNumeros" className="cursor-pointer">Números</Label>
                  <Switch
                    id="requiereNumeros"
                    checked={formData.requiereNumeros}
                    onCheckedChange={(checked) => handleInputChange('requiereNumeros', checked)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2 p-3 border rounded-lg">
                  <Label htmlFor="requireMayusculas" className="cursor-pointer">Mayúsculas</Label>
                  <Switch
                    id="requireMayusculas"
                    checked={formData.requireMayusculas}
                    onCheckedChange={(checked) => handleInputChange('requireMayusculas', checked)}
                  />
                </div>
                <div className="space-y-2 flex items-center gap-3 p-3 border rounded-lg">
                  <Label htmlFor="expiracionPassword" className="whitespace-nowrap">Expiración (días)</Label>
                  <Input
                    id="expiracionPassword"
                    type="number"
                    min="0"
                    value={formData.expiracionPassword}
                    onChange={(e) => handleInputChange('expiracionPassword', parseInt(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Citas y Agenda */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Citas y Agenda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duracionCitaDefault">Duración Cita Default (min)</Label>
                <Input
                  id="duracionCitaDefault"
                  type="number"
                  min="5"
                  value={formData.duracionCitaDefault}
                  onChange={(e) => handleInputChange('duracionCitaDefault', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anticipacionCita">Anticipación Mínima (horas)</Label>
                <Input
                  id="anticipacionCita"
                  type="number"
                  min="0"
                  value={formData.anticipacionCita}
                  onChange={(e) => handleInputChange('anticipacionCita', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cancelacionCita">Cancelación Mínima (horas)</Label>
                <Input
                  id="cancelacionCita"
                  type="number"
                  min="0"
                  value={formData.cancelacionCita}
                  onChange={(e) => handleInputChange('cancelacionCita', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recordatorioCita">Recordatorio (horas antes)</Label>
                <Input
                  id="recordatorioCita"
                  type="number"
                  min="1"
                  value={formData.recordatorioCita}
                  onChange={(e) => handleInputChange('recordatorioCita', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="citasSimultaneas">Citas Simultáneas</Label>
                <Input
                  id="citasSimultaneas"
                  type="number"
                  min="1"
                  value={formData.citasSimultaneas}
                  onChange={(e) => handleInputChange('citasSimultaneas', parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Facturación */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Facturación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prefijoFactura">Prefijo de Factura</Label>
                <Input
                  id="prefijoFactura"
                  value={formData.prefijoFactura}
                  onChange={(e) => handleInputChange('prefijoFactura', e.target.value.toUpperCase())}
                  placeholder="FAC"
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consecutivoFactura">Consecutivo Inicial</Label>
                <Input
                  id="consecutivoFactura"
                  type="number"
                  min="1"
                  value={formData.consecutivoFactura}
                  onChange={(e) => handleInputChange('consecutivoFactura', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="IVA">IVA (%)</Label>
                <Input
                  id="IVA"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.IVA}
                  onChange={(e) => handleInputChange('IVA', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retencionFuente">Retención Fuente (%)</Label>
                <Input
                  id="retencionFuente"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.retencionFuente}
                  onChange={(e) => handleInputChange('retencionFuente', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diasVencimiento">Días de Vencimiento</Label>
                <Input
                  id="diasVencimiento"
                  type="number"
                  min="1"
                  value={formData.diasVencimiento}
                  onChange={(e) => handleInputChange('diasVencimiento', parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Historias Clínicas */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Historias Clínicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="formatoHistoria">Formato de Historia Clínica</Label>
                <Select value={formData.formatoHistoria} onValueChange={(value) => handleInputChange('formatoHistoria', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOAP">SOAP</SelectItem>
                    <SelectItem value="POMR">POMR</SelectItem>
                    <SelectItem value="tradicional">Tradicional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="firmaDigital" className="cursor-pointer">Firma Digital</Label>
                  <p className="text-sm text-muted-foreground">Requerir firma digital en documentos</p>
                </div>
                <Switch
                  id="firmaDigital"
                  checked={formData.firmaDigital}
                  onCheckedChange={(checked) => handleInputChange('firmaDigital', checked)}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="consentimientoInformado" className="cursor-pointer">Consentimiento Informado</Label>
                  <p className="text-sm text-muted-foreground">Requerir consentimiento del paciente</p>
                </div>
                <Switch
                  id="consentimientoInformado"
                  checked={formData.consentimientoInformado}
                  onCheckedChange={(checked) => handleInputChange('consentimientoInformado', checked)}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="historiaElectronicaUnica" className="cursor-pointer">Historia Electrónica Única</Label>
                  <p className="text-sm text-muted-foreground">Un solo registro por paciente</p>
                </div>
                <Switch
                  id="historiaElectronicaUnica"
                  checked={formData.historiaElectronicaUnica}
                  onCheckedChange={(checked) => handleInputChange('historiaElectronicaUnica', checked)}
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Interfaz de Usuario */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Interfaz de Usuario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tema">Tema</Label>
                <Select value={formData.tema} onValueChange={(value) => handleInputChange('tema', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="colorPrimario">Color Primario</Label>
                <div className="flex gap-2">
                  <Input
                    id="colorPrimario"
                    type="color"
                    value={formData.colorPrimario}
                    onChange={(e) => handleInputChange('colorPrimario', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.colorPrimario}
                    onChange={(e) => handleInputChange('colorPrimario', e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="colorSecundario">Color Secundario</Label>
                <div className="flex gap-2">
                  <Input
                    id="colorSecundario"
                    type="color"
                    value={formData.colorSecundario}
                    onChange={(e) => handleInputChange('colorSecundario', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.colorSecundario}
                    onChange={(e) => handleInputChange('colorSecundario', e.target.value)}
                    placeholder="#10B981"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                <Label htmlFor="mostrarLogo" className="cursor-pointer">Mostrar Logo</Label>
                <Switch
                  id="mostrarLogo"
                  checked={formData.mostrarLogo}
                  onCheckedChange={(checked) => handleInputChange('mostrarLogo', checked)}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                <Label htmlFor="compactarMenu" className="cursor-pointer">Menú Compacto</Label>
                <Switch
                  id="compactarMenu"
                  checked={formData.compactarMenu}
                  onCheckedChange={(checked) => handleInputChange('compactarMenu', checked)}
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Límites del Sistema */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Límites del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pacientesPorPagina">Pacientes por Página</Label>
                <Input
                  id="pacientesPorPagina"
                  type="number"
                  min="5"
                  value={formData.pacientesPorPagina}
                  onChange={(e) => handleInputChange('pacientesPorPagina', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrosPorPagina">Registros por Página</Label>
                <Input
                  id="registrosPorPagina"
                  type="number"
                  min="10"
                  value={formData.registrosPorPagina}
                  onChange={(e) => handleInputChange('registrosPorPagina', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tamanioMaxArchivo">Tamaño Máx. Archivo (MB)</Label>
                <Input
                  id="tamanioMaxArchivo"
                  type="number"
                  min="1"
                  value={formData.tamanioMaxArchivo}
                  onChange={(e) => handleInputChange('tamanioMaxArchivo', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sesionesSimultaneas">Sesiones Simultáneas</Label>
                <Input
                  id="sesionesSimultaneas"
                  type="number"
                  min="1"
                  value={formData.sesionesSimultaneas}
                  onChange={(e) => handleInputChange('sesionesSimultaneas', parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Logs y Auditoría */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Logs y Auditoría
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="registrarLogs" className="cursor-pointer">Registrar Logs</Label>
                  <p className="text-sm text-muted-foreground">Guardar logs del sistema</p>
                </div>
                <Switch
                  id="registrarLogs"
                  checked={formData.registrarLogs}
                  onCheckedChange={(checked) => handleInputChange('registrarLogs', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nivelLogs">Nivel de Logs</Label>
                <Select value={formData.nivelLogs} onValueChange={(value) => handleInputChange('nivelLogs', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retencionLogs">Retención de Logs (días)</Label>
                <Input
                  id="retencionLogs"
                  type="number"
                  min="1"
                  value={formData.retencionLogs}
                  onChange={(e) => handleInputChange('retencionLogs', parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="auditoriaCambios" className="cursor-pointer">Auditoría de Cambios</Label>
                  <p className="text-sm text-muted-foreground">Rastrear cambios en registros</p>
                </div>
                <Switch
                  id="auditoriaCambios"
                  checked={formData.auditoriaCambios}
                  onCheckedChange={(checked) => handleInputChange('auditoriaCambios', checked)}
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Integración */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              API e Integración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg mb-4">
              <div className="space-y-0.5">
                <Label htmlFor="apiHabilitada" className="cursor-pointer">API Habilitada</Label>
                <p className="text-sm text-muted-foreground">Permitir acceso vía API REST</p>
              </div>
              <Switch
                id="apiHabilitada"
                checked={formData.apiHabilitada}
                onCheckedChange={(checked) => handleInputChange('apiHabilitada', checked)}
              />
            </div>
            {formData.apiHabilitada && (
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    value={formData.apiKey}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    placeholder="Ingrese o genere una API Key"
                    type="password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhookURL">Webhook URL</Label>
                  <Input
                    id="webhookURL"
                    value={formData.webhookURL}
                    onChange={(e) => handleInputChange('webhookURL', e.target.value)}
                    placeholder="https://ejemplo.com/webhook"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </ModuleCard>
      </form>
    </ModulePageLayout>
  );
}

