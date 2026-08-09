'use client';

import React, { useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Save, X, Plus, Building2, Eye, Edit, Trash2, FilePlus } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

interface RoleFormData {
  roleName: string;
  roleDescription: string;
  roleDepartment: string;
}

interface DepartmentFormData {
  name: string;
  code: string;
  description: string;
  permissions: {
    view: boolean;
    edit: boolean;
    delete: boolean;
    create: boolean;
  };
}

export default function RolesPage() {
  const [formData, setFormData] = useState<RoleFormData>({
    roleName: '',
    roleDescription: '',
    roleDepartment: ''
  });

  const [departmentFormData, setDepartmentFormData] = useState<DepartmentFormData>({
    name: '',
    code: '',
    description: '',
    permissions: {
      view: false,
      edit: false,
      delete: false,
      create: false
    }
  });

  const [roles, setRoles] = useState([
    { id: 1, name: 'Administrador', description: 'Acceso completo al sistema', department: 'Administración' },
    { id: 2, name: 'Médico', description: 'Acceso a historias clínicas y pacientes', department: 'Médico' },
    { id: 3, name: 'Enfermero', description: 'Acceso a triage y atención básica', department: 'Enfermería' },
    { id: 4, name: 'Recepcionista', description: 'Acceso a admisiones y citas', department: 'Recepción' }
  ]);

  const [departments, setDepartments] = useState([
    { id: 1, name: 'Administración', code: 'ADM', description: 'Departamento administrativo' },
    { id: 2, name: 'Médico', code: 'MED', description: 'Departamento médico' },
    { id: 3, name: 'Enfermería', code: 'ENF', description: 'Departamento de enfermería' },
    { id: 4, name: 'Recepción', code: 'REC', description: 'Departamento de recepción' }
  ]);

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roleName || !formData.roleDescription) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    const newRole = {
      id: roles.length + 1,
      name: formData.roleName,
      description: formData.roleDescription,
      department: formData.roleDepartment
    };

    setRoles([...roles, newRole]);
    setFormData({ roleName: '', roleDescription: '', roleDepartment: '' });
    toast.success('Rol creado exitosamente');
  };

  const handleDepartmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentFormData.name || !departmentFormData.code) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    const newDepartment = {
      id: departments.length + 1,
      name: departmentFormData.name,
      code: departmentFormData.code,
      description: departmentFormData.description
    };

    setDepartments([...departments, newDepartment]);
    setDepartmentFormData({
      name: '',
      code: '',
      description: '',
      permissions: { view: false, edit: false, delete: false, create: false }
    });
    toast.success('Departamento creado exitosamente');
  };

  const handleDeleteRole = (id: number) => {
    setRoles(roles.filter(role => role.id !== id));
    toast.success('Rol eliminado exitosamente');
  };

  const handleDeleteDepartment = (id: number) => {
    setDepartments(departments.filter(dept => dept.id !== id));
    toast.success('Departamento eliminado exitosamente');
  };

  const actions = (
    <>
      <Button variant="outline" size="sm">
        <FilePlus className="mr-2 h-4 w-4" />
        Exportar Roles
      </Button>
      <Button size="sm">
        <Save className="mr-2 h-4 w-4" />
        Guardar Cambios
      </Button>
    </>
  );

  return (
    <ModulePageLayout
      title="Gestión de Roles y Permisos"
      description="Administre roles, permisos y departamentos del sistema"
      actions={actions}
      maxWidth="7xl"
    >
      <div className="space-y-6">
        {/* Crear/Editar Rol */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Crear/Editar Rol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRoleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roleName">Nombre del Rol*</Label>
                  <Input
                    id="roleName"
                    placeholder="Ej: Médico Jefe"
                    value={formData.roleName}
                    onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleDepartment">Departamento</Label>
                  <Select value={formData.roleDepartment} onValueChange={(value) => setFormData({ ...formData, roleDepartment: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roleDescription">Descripción del Rol*</Label>
                <Textarea
                  id="roleDescription"
                  placeholder="Describe las responsabilidades y acceso de este rol..."
                  value={formData.roleDescription}
                  onChange={(e) => setFormData({ ...formData, roleDescription: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Rol
                </Button>
              </div>
            </form>
          </CardContent>
        </ModuleCard>

        {/* Crear/Editar Departamento */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Crear/Editar Departamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDepartmentSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deptName">Nombre del Departamento*</Label>
                  <Input
                    id="deptName"
                    placeholder="Ej: Cardiología"
                    value={departmentFormData.name}
                    onChange={(e) => setDepartmentFormData({ ...departmentFormData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deptCode">Código del Departamento*</Label>
                  <Input
                    id="deptCode"
                    placeholder="Ej: CAR"
                    value={departmentFormData.code}
                    onChange={(e) => setDepartmentFormData({ ...departmentFormData, code: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deptDescription">Descripción</Label>
                <Textarea
                  id="deptDescription"
                  placeholder="Describe las funciones de este departamento..."
                  value={departmentFormData.description}
                  onChange={(e) => setDepartmentFormData({ ...departmentFormData, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-4">
                <Label>Permisos del Departamento</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="view"
                      checked={departmentFormData.permissions.view}
                      onCheckedChange={(checked) => 
                        setDepartmentFormData({
                          ...departmentFormData,
                          permissions: { ...departmentFormData.permissions, view: !!checked }
                        })
                      }
                    />
                    <Label htmlFor="view">Ver</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="create"
                      checked={departmentFormData.permissions.create}
                      onCheckedChange={(checked) => 
                        setDepartmentFormData({
                          ...departmentFormData,
                          permissions: { ...departmentFormData.permissions, create: !!checked }
                        })
                      }
                    />
                    <Label htmlFor="create">Crear</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit"
                      checked={departmentFormData.permissions.edit}
                      onCheckedChange={(checked) => 
                        setDepartmentFormData({
                          ...departmentFormData,
                          permissions: { ...departmentFormData.permissions, edit: !!checked }
                        })
                      }
                    />
                    <Label htmlFor="edit">Editar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="delete"
                      checked={departmentFormData.permissions.delete}
                      onCheckedChange={(checked) => 
                        setDepartmentFormData({
                          ...departmentFormData,
                          permissions: { ...departmentFormData.permissions, delete: !!checked }
                        })
                      }
                    />
                    <Label htmlFor="delete">Eliminar</Label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline">
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Departamento
                </Button>
              </div>
            </form>
          </CardContent>
        </ModuleCard>

        {/* Lista de Roles */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Roles Existentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{role.name}</h4>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                    <p className="text-xs text-muted-foreground">Departamento: {role.department}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteRole(role.id)}
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

        {/* Lista de Departamentos */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Departamentos Existentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{dept.name}</h4>
                    <p className="text-sm text-muted-foreground">{dept.description}</p>
                    <p className="text-xs text-muted-foreground">Código: {dept.code}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteDepartment(dept.id)}
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
      </div>
    </ModulePageLayout>
  );
}