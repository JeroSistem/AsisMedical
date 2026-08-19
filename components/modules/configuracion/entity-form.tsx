"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Building, Users, Settings, Shield, Globe } from 'lucide-react';

interface EntityFormProps {
  entity?: {
    id: string;
    name: string;
    type: 'HOSPITAL' | 'CLINICA' | 'CENTRO_MEDICO' | 'LABORATORIO';
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    adminUser: string;
    adminEmail: string;
    adminPassword: string;
    modules: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const entityTypes = [
  { value: 'HOSPITAL', label: 'Hospital' },
  { value: 'CLINICA', label: 'Clínica' },
  { value: 'CENTRO_MEDICO', label: 'Centro Médico' },
  { value: 'LABORATORIO', label: 'Laboratorio' }
];

const availableModules = [
  { id: 'historias', name: 'Historias Clínicas', description: 'Gestión de historias clínicas' },
  { id: 'triage', name: 'Triage', description: 'Sistema de clasificación de urgencias' },
  { id: 'asistencial', name: 'Asistencial', description: 'Gestión de servicios asistenciales' },
  { id: 'laboratorio', name: 'Laboratorio', description: 'Gestión de pruebas de laboratorio' },
  { id: 'imagenes-diagnosticas', name: 'Imágenes Diagnósticas', description: 'Gestión de imágenes médicas' },
  { id: 'farmacia', name: 'Farmacia', description: 'Gestión de medicamentos' },
  { id: 'facturacion', name: 'Facturación', description: 'Gestión de facturación' },
  { id: 'inventario', name: 'Inventario', description: 'Control de inventario' },
  { id: 'auditoria', name: 'Auditoría', description: 'Sistema de auditoría' },
  { id: 'contabilidad', name: 'Contabilidad', description: 'Gestión contable' },
  { id: 'presupuesto', name: 'Presupuesto', description: 'Gestión presupuestaria' },
  { id: 'nomina', name: 'Nómina', description: 'Gestión de nómina' },
  { id: 'cartera', name: 'Cartera', description: 'Gestión de cartera' }
];

export function EntityForm({ entity, isOpen, onClose, onSubmit }: EntityFormProps) {
  const [formData, setFormData] = useState({
    name: entity?.name || '',
    type: entity?.type || 'HOSPITAL',
    status: entity?.status || 'ACTIVE',
    adminUser: entity?.adminUser || '',
    adminEmail: entity?.adminEmail || '',
    adminPassword: entity?.adminPassword || '',
    modules: entity?.modules || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Transformar IDs de módulos a nombres para el API
    const selectedModuleNames = availableModules
      .filter(m => formData.modules.includes(m.id))
      .map(m => m.name);

    onSubmit({
      ...formData,
      modules: selectedModuleNames,
    });
    onClose();
  };

  const handleModuleToggle = (moduleId: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(moduleId)
        ? prev.modules.filter(id => id !== moduleId)
        : [...prev.modules, moduleId]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
        <DialogHeader className="bg-white rounded-t-xl p-6 border-b border-gray-200">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Building className="h-5 w-5 text-white" />
            </div>
            {entity ? 'Editar Entidad' : 'Nueva Entidad'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Información Básica */}
          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Globe className="h-5 w-5" />
                Información de la Entidad
              </CardTitle>
            </CardHeader>
              <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre de la Entidad</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Hospital General San José"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="type" className="text-sm font-medium text-gray-700">Tipo de Entidad</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {entityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Activo</SelectItem>
                    <SelectItem value="INACTIVE">Inactivo</SelectItem>
                    <SelectItem value="PENDING">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Usuario Administrador */}
          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <Users className="h-5 w-5" />
                Usuario Administrador Principal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="adminUser" className="text-sm font-medium text-gray-700">Nombre del Administrador</Label>
                  <Input
                    id="adminUser"
                    value={formData.adminUser}
                    onChange={(e) => setFormData(prev => ({ ...prev, adminUser: e.target.value }))}
                    placeholder="Ej: Dr. Juan Pérez"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="adminEmail" className="text-sm font-medium text-gray-700">Email del Administrador</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, adminEmail: e.target.value }))}
                    placeholder="admin@entidad.com"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="adminPassword" className="text-sm font-medium text-gray-700">Contraseña del Administrador</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={formData.adminPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, adminPassword: e.target.value }))}
                  placeholder="Contraseña segura"
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Esta será la cuenta principal de administración para la entidad
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Módulos Habilitados */}
          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Settings className="h-5 w-5" />
                Módulos Habilitados
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableModules.map((module) => (
                  <div key={module.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    <Checkbox
                      id={module.id}
                      checked={formData.modules.includes(module.id)}
                      onCheckedChange={() => handleModuleToggle(module.id)}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <Label htmlFor={module.id} className="font-medium cursor-pointer text-gray-900">
                        {module.name}
                      </Label>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 hover:bg-gray-50">
              Cancelar
            </Button>
            <Button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              <Plus className="h-4 w-4" />
              {entity ? 'Actualizar Entidad' : 'Crear Entidad'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
