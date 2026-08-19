"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Settings, Shield, Zap, Clock, Database, Bell } from 'lucide-react';

interface ModuleFormProps {
  module?: {
    id: string;
    name: string;
    description: string;
    status: 'enabled' | 'disabled';
    permissions: string[];
    config?: any;
  };
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const modulePermissions = {
  historias: [
    { id: 'read', name: 'Leer', description: 'Ver historias clínicas' },
    { id: 'write', name: 'Escribir', description: 'Crear y editar historias' },
    { id: 'delete', name: 'Eliminar', description: 'Eliminar historias' },
    { id: 'export', name: 'Exportar', description: 'Exportar datos' },
    { id: 'print', name: 'Imprimir', description: 'Imprimir historias' }
  ],
  triage: [
    { id: 'read', name: 'Leer', description: 'Ver clasificaciones' },
    { id: 'write', name: 'Escribir', description: 'Crear y editar triage' },
    { id: 'assign', name: 'Asignar', description: 'Asignar pacientes' },
    { id: 'prioritize', name: 'Priorizar', description: 'Cambiar prioridades' }
  ],
  asistencial: [
    { id: 'read', name: 'Leer', description: 'Ver servicios' },
    { id: 'write', name: 'Escribir', description: 'Gestionar servicios' },
    { id: 'schedule', name: 'Programar', description: 'Programar citas' },
    { id: 'cancel', name: 'Cancelar', description: 'Cancelar citas' }
  ],
  laboratorio: [
    { id: 'read', name: 'Leer', description: 'Ver resultados' },
    { id: 'write', name: 'Escribir', description: 'Gestionar pruebas' },
    { id: 'results', name: 'Resultados', description: 'Ver resultados' },
    { id: 'approve', name: 'Aprobar', description: 'Aprobar resultados' }
  ]
};

const moduleConfigs = {
  historias: {
    autoSave: true,
    backupEnabled: true,
    maxFileSize: 10,
    allowedFormats: ['pdf', 'jpg', 'png'],
    retentionDays: 365
  },
  triage: {
    autoAssign: false,
    maxWaitTime: 30,
    priorityLevels: 5,
    notificationEnabled: true
  },
  asistencial: {
    appointmentDuration: 30,
    maxAppointmentsPerDay: 50,
    reminderEnabled: true,
    reminderTime: 24
  },
  laboratorio: {
    autoValidation: false,
    resultNotification: true,
    qualityControl: true,
    retentionPeriod: 180
  }
};

export function ModuleForm({ module, isOpen, onClose, onSubmit }: ModuleFormProps) {
  const [formData, setFormData] = useState({
    name: module?.name || '',
    description: module?.description || '',
    status: module?.status || 'enabled',
    permissions: module?.permissions || [],
    config: module?.config || {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleConfigChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value
      }
    }));
  };

  const getModulePermissions = (moduleId: string) => {
    return modulePermissions[moduleId as keyof typeof modulePermissions] || [];
  };

  const getModuleConfig = (moduleId: string) => {
    return moduleConfigs[moduleId as keyof typeof moduleConfigs] || {};
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-purple-50">
        <DialogHeader className="bg-white rounded-t-xl p-6 border-b border-gray-200">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            {module ? 'Editar Módulo' : 'Nuevo Módulo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Información Básica */}
          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Settings className="h-5 w-5" />
                Información del Módulo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre del Módulo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Historias Clínicas"
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Habilitado</SelectItem>
                      <SelectItem value="disabled">Deshabilitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Descripción</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción detallada del módulo"
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Permisos */}
          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Shield className="h-5 w-5" />
                Permisos del Módulo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['read', 'write', 'delete', 'export', 'admin'].map((permission) => (
                  <div key={permission} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    <Checkbox
                      id={permission}
                      checked={formData.permissions.includes(permission)}
                      onCheckedChange={() => handlePermissionToggle(permission)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <Label htmlFor={permission} className="font-medium cursor-pointer text-gray-900">
                        {permission === 'read' ? 'Leer' : 
                         permission === 'write' ? 'Escribir' : 
                         permission === 'delete' ? 'Eliminar' : 
                         permission === 'export' ? 'Exportar' : 'Administrar'}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {permission === 'read' ? 'Permitir lectura de datos' : 
                         permission === 'write' ? 'Permitir creación y edición' : 
                         permission === 'delete' ? 'Permitir eliminación' : 
                         permission === 'export' ? 'Permitir exportación' : 'Acceso administrativo completo'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configuración Avanzada */}
          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <Zap className="h-5 w-5" />
                Configuración Avanzada
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Configuración específica por módulo */}
              {formData.name.toLowerCase().includes('historias') && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Configuración de Historias Clínicas
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">Auto-guardado</Label>
                        <Switch
                          checked={formData.config.autoSave || false}
                          onCheckedChange={(checked) => handleConfigChange('autoSave', checked)}
                        />
                      </div>
                      <p className="text-sm text-gray-500">Guardar automáticamente los cambios</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">Backup automático</Label>
                        <Switch
                          checked={formData.config.autoBackup || false}
                          onCheckedChange={(checked) => handleConfigChange('autoBackup', checked)}
                        />
                      </div>
                      <p className="text-sm text-gray-500">Crear copias de seguridad automáticas</p>
                    </div>
                  </div>
                </div>
              )}

              {formData.name.toLowerCase().includes('triage') && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Configuración de Triage
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">Asignación automática</Label>
                        <Switch
                          checked={formData.config.autoAssign || false}
                          onCheckedChange={(checked) => handleConfigChange('autoAssign', checked)}
                        />
                      </div>
                      <p className="text-sm text-gray-500">Asignar automáticamente casos</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">Tiempo máximo de espera (minutos)</Label>
                      <Input
                        type="number"
                        value={formData.config.maxWaitTime || 30}
                        onChange={(e) => handleConfigChange('maxWaitTime', parseInt(e.target.value))}
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        min="1"
                        max="120"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.name.toLowerCase().includes('laboratorio') && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Configuración de Laboratorio
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">Notificaciones automáticas</Label>
                        <Switch
                          checked={formData.config.autoNotifications || false}
                          onCheckedChange={(checked) => handleConfigChange('autoNotifications', checked)}
                        />
                      </div>
                      <p className="text-sm text-gray-500">Enviar notificaciones cuando los resultados estén listos</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">Tiempo de procesamiento (horas)</Label>
                      <Input
                        type="number"
                        value={formData.config.processingTime || 24}
                        onChange={(e) => handleConfigChange('processingTime', parseInt(e.target.value))}
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        min="1"
                        max="72"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Configuración general */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Configuración General
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-700">Registro de auditoría</Label>
                      <Switch
                        checked={formData.config.auditLog || false}
                        onCheckedChange={(checked) => handleConfigChange('auditLog', checked)}
                      />
                    </div>
                    <p className="text-sm text-gray-500">Registrar todas las acciones del módulo</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-700">Modo de mantenimiento</Label>
                      <Switch
                        checked={formData.config.maintenanceMode || false}
                        onCheckedChange={(checked) => handleConfigChange('maintenanceMode', checked)}
                      />
                    </div>
                    <p className="text-sm text-gray-500">Deshabilitar acceso temporalmente</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 hover:bg-gray-50">
              Cancelar
            </Button>
            <Button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
              <Plus className="h-4 w-4" />
              {module ? 'Actualizar Módulo' : 'Crear Módulo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
