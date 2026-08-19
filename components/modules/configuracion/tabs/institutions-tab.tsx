'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Building2, Edit, Trash2, User, Mail, Shield, CheckCircle2, XCircle, Clock, Settings } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface Module {
  id: string;
  name: string;
  description: string;
  status: string;
}

interface Institution {
  id: string;
  name: string;
  type: string;
  status: string;
  adminUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  } | null;
  modules?: Array<{
    id: string;
    name: string;
    description: string;
    enabled: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface InstitutionFormData {
  name: string;
  type: 'HOSPITAL' | 'CLINICA' | 'CENTRO_MEDICO' | 'LABORATORIO';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  adminUser: {
    name: string;
    email: string;
    password: string;
  };
  modules: string[]; // Array de IDs de módulos seleccionados
}

interface InstitutionsTabProps {
  onChange?: () => void;
}

const entityTypes = [
  { value: 'HOSPITAL', label: 'Hospital' },
  { value: 'CLINICA', label: 'Clínica' },
  { value: 'CENTRO_MEDICO', label: 'Centro Médico' },
  { value: 'LABORATORIO', label: 'Laboratorio' },
];

const statusOptions = [
  { value: 'ACTIVE', label: 'Activo', icon: CheckCircle2, color: 'text-green-600' },
  { value: 'INACTIVE', label: 'Inactivo', icon: XCircle, color: 'text-red-600' },
  { value: 'PENDING', label: 'Pendiente', icon: Clock, color: 'text-yellow-600' },
];

export function InstitutionsTab({ onChange }: InstitutionsTabProps) {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [availableModules, setAvailableModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);
  const [formData, setFormData] = useState<InstitutionFormData>({
    name: '',
    type: 'HOSPITAL',
    status: 'ACTIVE',
    adminUser: {
      name: '',
      email: '',
      password: '',
    },
    modules: [],
  });

  // Cargar instituciones y módulos al montar el componente
  useEffect(() => {
    loadInstitutions();
    loadModules();
  }, []);

  const loadInstitutions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/configuracion/entities');
      const result = await response.json();

      if (result.success) {
        setInstitutions(result.data || []);
      } else {
        toast.error('Error al cargar instituciones: ' + (result.error || 'Error desconocido'));
      }
    } catch (error: any) {
      console.error('Error cargando instituciones:', error);
      toast.error('Error al cargar instituciones');
    } finally {
      setIsLoading(false);
    }
  };

  const loadModules = async () => {
    try {
      const response = await fetch('/api/configuracion/modules');
      const result = await response.json();

      if (result.success) {
        setAvailableModules(result.data || []);
      } else {
        console.error('Error cargando módulos:', result.error);
      }
    } catch (error: any) {
      console.error('Error cargando módulos:', error);
    }
  };

  const handleOpenDialog = (institution?: Institution) => {
    if (institution) {
      setEditingInstitution(institution);
      setFormData({
        name: institution.name,
        type: institution.type as any,
        status: institution.status as any,
        adminUser: institution.adminUser
          ? {
              name: institution.adminUser.name,
              email: institution.adminUser.email,
              password: '', // No mostrar la contraseña existente
            }
          : {
              name: '',
              email: '',
              password: '',
            },
        modules: institution.modules?.filter(m => m.enabled).map(m => m.id) || [],
      });
    } else {
      setEditingInstitution(null);
      setFormData({
        name: '',
        type: 'HOSPITAL',
        status: 'ACTIVE',
        adminUser: {
          name: '',
          email: '',
          password: '',
        },
        modules: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingInstitution(null);
    setFormData({
      name: '',
      type: 'HOSPITAL',
      status: 'ACTIVE',
      adminUser: {
        name: '',
        email: '',
        password: '',
      },
      modules: [],
    });
  };

  const handleModuleToggle = (moduleId: string) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(moduleId)
        ? prev.modules.filter((id) => id !== moduleId)
        : [...prev.modules, moduleId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.name.trim()) {
      toast.error('El nombre de la institución es requerido');
      return;
    }

    if (!formData.adminUser.name.trim()) {
      toast.error('El nombre del administrador es requerido');
      return;
    }

    if (!formData.adminUser.email.trim()) {
      toast.error('El email del administrador es requerido');
      return;
    }

    if (!editingInstitution && !formData.adminUser.password.trim()) {
      toast.error('La contraseña del administrador es requerida');
      return;
    }

    try {
      if (editingInstitution) {
        // Actualizar institución existente
        const response = await fetch('/api/configuracion/entities', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingInstitution.id,
            ...formData,
            // Solo enviar password si se proporcionó uno nuevo
            adminUser: {
              ...formData.adminUser,
              password: formData.adminUser.password || undefined,
            },
          }),
        });

        const result = await response.json();

        if (result.success) {
          toast.success('Institución actualizada exitosamente');
          handleCloseDialog();
          loadInstitutions();
          onChange?.();
        } else {
          toast.error('Error al actualizar: ' + (result.error || 'Error desconocido'));
        }
      } else {
        // Crear nueva institución
        const response = await fetch('/api/configuracion/entities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          toast.success('Institución creada exitosamente');
          handleCloseDialog();
          loadInstitutions();
          onChange?.();
        } else {
          toast.error('Error al crear: ' + (result.error || 'Error desconocido'));
        }
      }
    } catch (error: any) {
      console.error('Error guardando institución:', error);
      toast.error('Error al guardar la institución');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas desactivar esta institución?')) {
      return;
    }

    try {
      const response = await fetch(`/api/configuracion/entities?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Institución desactivada exitosamente');
        loadInstitutions();
        onChange?.();
      } else {
        toast.error('Error al desactivar: ' + (result.error || 'Error desconocido'));
      }
    } catch (error: any) {
      console.error('Error eliminando institución:', error);
      toast.error('Error al desactivar la institución');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    if (!statusOption) return null;

    const Icon = statusOption.icon;
    return (
      <Badge variant="outline" className={`${statusOption.color} border-current`}>
        <Icon className="h-3 w-3 mr-1" />
        {statusOption.label}
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    const typeOption = entityTypes.find((t) => t.value === type);
    return typeOption?.label || type;
  };

  return (
    <div className="space-y-6">
      {/* Header con botón de crear */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestión de Instituciones</h3>
          <p className="text-sm text-muted-foreground">
            Administra las instituciones contratadas y sus usuarios administradores principales
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Institución
        </Button>
      </div>

      {/* Tabla de instituciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Instituciones Registradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Cargando instituciones...</div>
          ) : institutions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay instituciones registradas. Crea la primera institución.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Administrador</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Módulos</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {institutions.map((institution) => (
                    <TableRow key={institution.id}>
                      <TableCell className="font-medium">{institution.name}</TableCell>
                      <TableCell>{getTypeLabel(institution.type)}</TableCell>
                      <TableCell>{getStatusBadge(institution.status)}</TableCell>
                      <TableCell>
                        {institution.adminUser ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {institution.adminUser.name}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Sin administrador</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {institution.adminUser ? (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {institution.adminUser.email}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {institution.modules && institution.modules.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {institution.modules.slice(0, 3).map((module) => (
                              <Badge key={module.id} variant="secondary" className="text-xs">
                                {module.name}
                              </Badge>
                            ))}
                            {institution.modules.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{institution.modules.length - 3}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin módulos</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(institution.createdAt).toLocaleDateString('es-CO')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(institution)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(institution.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear/editar institución */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {editingInstitution ? 'Editar Institución' : 'Nueva Institución'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información de la Institución */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Información de la Institución</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre de la Institución *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Hospital General San José"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Institución *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value as any })
                      }
                    >
                      <SelectTrigger>
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

                <div className="space-y-2">
                  <Label htmlFor="status">Estado *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Usuario Administrador Principal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Usuario Administrador Principal
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Este será el usuario principal que administrará la institución y podrá crear usuarios internos
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Nombre del Administrador *</Label>
                    <Input
                      id="adminName"
                      value={formData.adminUser.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          adminUser: { ...formData.adminUser, name: e.target.value },
                        })
                      }
                      placeholder="Ej: Dr. Juan Pérez"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email del Administrador *</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={formData.adminUser.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          adminUser: { ...formData.adminUser, email: e.target.value },
                        })
                      }
                      placeholder="admin@institucion.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminPassword">
                    Contraseña del Administrador {editingInstitution ? '(dejar vacío para mantener la actual)' : '*'}
                  </Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={formData.adminUser.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        adminUser: { ...formData.adminUser, password: e.target.value },
                      })
                    }
                    placeholder="Contraseña segura"
                    required={!editingInstitution}
                  />
                  {!editingInstitution && (
                    <p className="text-xs text-muted-foreground">
                      La contraseña debe tener al menos 8 caracteres
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Módulos Habilitados */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Módulos Habilitados
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Selecciona los módulos que esta institución podrá utilizar
                </p>
              </CardHeader>
              <CardContent>
                {availableModules.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No hay módulos disponibles. Crea módulos primero en la configuración del sistema.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
                    {availableModules.map((module) => (
                      <div
                        key={module.id}
                        className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Checkbox
                          id={`module-${module.id}`}
                          checked={formData.modules.includes(module.id)}
                          onCheckedChange={() => handleModuleToggle(module.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <Label
                            htmlFor={`module-${module.id}`}
                            className="font-medium cursor-pointer text-gray-900 block"
                          >
                            {module.name}
                          </Label>
                          {module.description && (
                            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {formData.modules.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      {formData.modules.length} módulo{formData.modules.length !== 1 ? 's' : ''} seleccionado{formData.modules.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingInstitution ? 'Actualizar Institución' : 'Crear Institución'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
