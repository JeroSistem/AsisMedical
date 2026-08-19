'use client';

import React, { useState, useEffect } from 'react';
import { TabEnableToggle, TabContentWrapper } from '@/components/modules/configuracion/tab-enable-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bell, Info, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NotificationsTabProps {
  onChange?: () => void;
  entityId?: string | null;
}

const NOTIFICATION_EVENTS = [
  {
    id: 'patient-admission',
    name: 'Alta de Paciente',
    description: 'Cuando se registra un nuevo paciente en el sistema',
    channels: ['email', 'sms'],
    template: 'Nuevo paciente registrado: {{patient.name}} ({{patient.document}})',
  },
  {
    id: 'new-note',
    name: 'Nueva Nota Clínica',
    description: 'Cuando se crea una nueva nota en la historia clínica',
    channels: ['email'],
    template: 'Nueva nota clínica para {{patient.name}} por {{doctor.name}}',
  },
  {
    id: 'lab-result',
    name: 'Resultado de Laboratorio',
    description: 'Cuando están listos los resultados de laboratorio',
    channels: ['email', 'sms', 'push'],
    template: 'Resultados de laboratorio disponibles para {{patient.name}}',
  },
  {
    id: 'image-ready',
    name: 'Imagen Diagnóstica Lista',
    description: 'Cuando una imagen diagnóstica está disponible',
    channels: ['email', 'push'],
    template: 'Imagen diagnóstica lista para {{patient.name}} - {{study.type}}',
  },
  {
    id: 'appointment-reminder',
    name: 'Recordatorio de Cita',
    description: 'Recordatorio de cita programada',
    channels: ['email', 'sms'],
    template: 'Recordatorio: Cita médica mañana a las {{appointment.time}}',
  },
  {
    id: 'prescription-ready',
    name: 'Receta Lista',
    description: 'Cuando una receta está lista para dispensar',
    channels: ['email', 'sms'],
    template: 'Receta médica lista para recoger - {{patient.name}}',
  },
];

export function NotificationsTab({ onChange, entityId }: NotificationsTabProps) {
  const [enabled, setEnabled] = useState(true);
  const [eventConfigs, setEventConfigs] = useState(
    NOTIFICATION_EVENTS.map(event => ({
      ...event,
      enabled: true,
      selectedChannels: event.channels.slice(0, 1), // Solo el primer canal por defecto
    }))
  );

  const [quietHours, setQuietHours] = useState({
    enabled: false,
    startTime: '22:00',
    endTime: '07:00',
  });

  const [escalation, setEscalation] = useState({
    enabled: false,
    hours: 2,
    supervisorEmail: '',
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
      const response = await fetch(`/api/configuracion/general?category=notifications&entityId=${entityId}`);
      const result = await response.json();
      if (result.success && result.data) {
        const enabledConfig = result.data.find((config: any) => 
          config.key === 'notifications.enabled' || config.key === 'enabled'
        );
        if (enabledConfig) {
          setEnabled(enabledConfig.value === true);
        }
      }
    } catch (error) {
      console.error('Error cargando estado de notificaciones:', error);
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
            configs: { 'notifications.enabled': newEnabled },
            category: 'notifications',
            entityId: entityId,
          }),
        });
      } catch (error) {
        console.error('Error guardando estado de notificaciones:', error);
      }
    }
  };

  const handleEventToggle = (eventId: string, eventEnabled: boolean) => {
    if (!enabled) return;
    setEventConfigs(prev => prev.map(e => 
      e.id === eventId ? { ...e, enabled: eventEnabled } : e
    ));
    onChange?.();
  };

  const handleChannelToggle = (eventId: string, channel: string) => {
    if (!enabled) return;
    setEventConfigs(prev => prev.map(e => {
      if (e.id === eventId) {
        const newChannels = e.selectedChannels.includes(channel)
          ? e.selectedChannels.filter(c => c !== channel)
          : [...e.selectedChannels, channel];
        return { ...e, selectedChannels: newChannels };
      }
      return e;
    }));
    onChange?.();
  };

  const handleTemplateChange = (eventId: string, template: string) => {
    setEventConfigs(prev => prev.map(e => 
      e.id === eventId ? { ...e, template } : e
    ));
    onChange?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Notificaciones & Alertas</h3>
          <p className="text-sm text-muted-foreground">
            Configura eventos, canales y plantillas de notificación
          </p>
        </div>
      </div>

      {/* Toggle para activar/desactivar configuración */}
      {entityId && (
        <TabEnableToggle
          entityId={entityId}
          category="notifications"
          label="Configuración de Notificaciones"
          description={enabled 
            ? 'Las notificaciones están habilitadas para esta institución. Puedes modificar los campos a continuación.'
            : 'Las notificaciones están deshabilitadas para esta institución. Todos los campos están bloqueados.'}
          enabled={enabled}
          onToggle={handleToggle}
        />
      )}

      <TabContentWrapper
        entityId={entityId}
        category="notifications"
        label="Configuración de Notificaciones"
        description=""
        enabled={enabled}
      >

      {/* Eventos de Notificación */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos de Notificación</CardTitle>
          <CardDescription>
            Configura qué eventos generan notificaciones y por qué canales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {eventConfigs.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 space-y-4">
              {/* Header del evento */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Checkbox
                      id={`event-${event.id}`}
                      checked={event.enabled}
                      onCheckedChange={(checked) => handleEventToggle(event.id, checked as boolean)}
                    />
                    <Label htmlFor={`event-${event.id}`} className="font-medium cursor-pointer">
                      {event.name}
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    {event.description}
                  </p>
                </div>
              </div>

              {event.enabled && (
                <>
                  {/* Canales */}
                  <div className="ml-6 space-y-3">
                    <Label className="text-sm font-medium">Canales de Notificación:</Label>
                    <div className="flex flex-wrap gap-3">
                      {event.channels.includes('email') && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${event.id}-email`}
                            checked={event.selectedChannels.includes('email')}
                            onCheckedChange={() => handleChannelToggle(event.id, 'email')}
                          />
                          <Label htmlFor={`${event.id}-email`} className="font-normal cursor-pointer flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            Email
                          </Label>
                        </div>
                      )}
                      {event.channels.includes('sms') && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${event.id}-sms`}
                            checked={event.selectedChannels.includes('sms')}
                            onCheckedChange={() => handleChannelToggle(event.id, 'sms')}
                          />
                          <Label htmlFor={`${event.id}-sms`} className="font-normal cursor-pointer flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            SMS
                          </Label>
                        </div>
                      )}
                      {event.channels.includes('push') && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${event.id}-push`}
                            checked={event.selectedChannels.includes('push')}
                            onCheckedChange={() => handleChannelToggle(event.id, 'push')}
                          />
                          <Label htmlFor={`${event.id}-push`} className="font-normal cursor-pointer flex items-center gap-1">
                            <Smartphone className="h-4 w-4" />
                            Push
                          </Label>
                        </div>
                      )}
                    </div>

                    {/* Plantilla del mensaje */}
                    <div className="space-y-2">
                      <Label htmlFor={`template-${event.id}`} className="flex items-center gap-2">
                        Plantilla del Mensaje
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Variables disponibles: {'{'}{'{'} patient.name {'}'}{'}'}, {'{'}{'{'} patient.document {'}'}{'}'}, {'{'}{'{'} doctor.name {'}'}{'}'}, {'{'}{'{'} appointment.time {'}'}{'}'}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Textarea
                        id={`template-${event.id}`}
                        value={event.template}
                        onChange={(e) => handleTemplateChange(event.id, e.target.value)}
                        rows={2}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Horario de Silencio */}
      <Card>
        <CardHeader>
          <CardTitle>Horario de Silencio (Do Not Disturb)</CardTitle>
          <CardDescription>
            Define un horario en el que no se enviarán notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Habilitar Horario de Silencio</Label>
            <Switch
              checked={quietHours.enabled}
              onCheckedChange={(checked) => {
                setQuietHours(prev => ({ ...prev, enabled: checked }));
                onChange?.();
              }}
            />
          </div>

          {quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quietStart">Hora de Inicio</Label>
                <Input
                  id="quietStart"
                  type="time"
                  value={quietHours.startTime}
                  onChange={(e) => {
                    setQuietHours(prev => ({ ...prev, startTime: e.target.value }));
                    onChange?.();
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quietEnd">Hora de Fin</Label>
                <Input
                  id="quietEnd"
                  type="time"
                  value={quietHours.endTime}
                  onChange={(e) => {
                    setQuietHours(prev => ({ ...prev, endTime: e.target.value }));
                    onChange?.();
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Escalamiento */}
      <Card>
        <CardHeader>
          <CardTitle>Escalamiento de Notificaciones</CardTitle>
          <CardDescription>
            Notificar a supervisores si no hay respuesta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Habilitar Escalamiento</Label>
            <Switch
              checked={escalation.enabled}
              onCheckedChange={(checked) => {
                setEscalation(prev => ({ ...prev, enabled: checked }));
                onChange?.();
              }}
            />
          </div>

          {escalation.enabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="escalationHours" className="flex items-center gap-2">
                  Tiempo de Espera (horas)
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Si no hay respuesta después de estas horas, se notificará al supervisor</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="escalationHours"
                  type="number"
                  min={1}
                  max={48}
                  value={escalation.hours}
                  onChange={(e) => {
                    setEscalation(prev => ({ ...prev, hours: parseInt(e.target.value) }));
                    onChange?.();
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supervisorEmail">Email del Supervisor</Label>
                <Input
                  id="supervisorEmail"
                  type="email"
                  placeholder="supervisor@hospital.com"
                  value={escalation.supervisorEmail}
                  onChange={(e) => {
                    setEscalation(prev => ({ ...prev, supervisorEmail: e.target.value }));
                    onChange?.();
                  }}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      </TabContentWrapper>
    </div>
  );
}

