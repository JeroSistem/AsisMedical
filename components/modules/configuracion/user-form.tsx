"use client";

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, Shield, Key, Eye, Lock, Unlock, Settings, Building } from 'lucide-react';

interface UserFormProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'entity_admin' | 'user';
    entityId: string;
    status: 'active' | 'inactive';
    permissionIds: string[];
  };
  entities: Array<{ id: string; name: string }>;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const userRoles = [
  { value: 'super_admin', label: 'Super Administrador', description: 'Acceso completo al sistema' },
  { value: 'entity_admin', label: 'Administrador de Entidad', description: 'Administra una entidad específica' },
  { value: 'user', label: 'Usuario', description: 'Usuario con permisos limitados' }
];

type ApiModule = {
  id: string;
  name: string;
  description?: string;
  permissions: Array<{ id: string; name: string; description?: string }>;
};

export function UserForm({ user, entities, isOpen, onClose, onSubmit }: UserFormProps) {
  const [modules, setModules] = useState<ApiModule[]>([]);
  const [loadingModules, setLoadingModules] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoadingModules(true);
        const res = await fetch('/api/configuracion/modules');
        const json = await res.json();
        if (json?.success) setModules((json.data || []).map((m: any) => ({
          id: m.id,
          name: m.name,
          description: m.description,
          permissions: (m.permissions || []).map((p: any) => ({ id: p.id, name: p.name, description: p.description }))
        })));
      } catch (e) {
        // noop
      } finally {
        setLoadingModules(false);
      }
    })();
  }, []);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    entityId: user?.entityId || '',
    status: user?.status || 'active',
    password: '',
    confirmPassword: '',
    permissionIds: user?.permissionIds || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    const roleMap: Record<string, string> = {
      super_admin: 'SUPER_ADMIN',
      entity_admin: 'ENTITY_ADMIN',
      user: 'USER'
    };
    const payload = {
      name: formData.name,
      email: formData.email,
      role: roleMap[formData.role] || 'USER',
      entityId: formData.entityId || undefined,
      status: formData.status === 'active' ? 'Active' : 'Inactive',
      password: formData.password,
      permissions: formData.permissionIds,
    };
    onSubmit(payload);
    onClose();
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({ ...prev, role: role as any }));
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(p => p !== permissionId)
        : [...prev.permissionIds, permissionId]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-emerald-50">
        <DialogHeader className="bg-white rounded-t-xl p-6 border-b border-gray-200">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            {user ? 'Editar Usuario' : 'Nuevo Usuario'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Información Básica */}
          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <Users className="h-5 w-5" />
                Información del Usuario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Dr. Juan Pérez"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="usuario@entidad.com"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">Rol</Label>
                  <Select
                    value={formData.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Administrador</SelectItem>
                      <SelectItem value="entity_admin">Administrador de Entidad</SelectItem>
                      <SelectItem value="user">Usuario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="entity" className="text-sm font-medium text-gray-700">Entidad</Label>
                  <Select
                    value={formData.entityId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, entityId: value }))}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="Seleccionar entidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {entities.map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>
                          {entity.name}
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
                  <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Contraseña */}
          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Key className="h-5 w-5" />
                Configuración de Contraseña
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Contraseña segura"
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    required={!user}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Repetir contraseña"
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    required={!user}
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números
              </p>
            </CardContent>
          </Card>

          {/* Permisos */}
          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Shield className="h-5 w-5" />
                Permisos y Accesos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loadingModules ? (
                <div className="text-sm text-gray-500">Cargando módulos...</div>
              ) : modules.length === 0 ? (
                <div className="text-sm text-gray-500">No hay módulos disponibles</div>
              ) : (
                <Tabs defaultValue={modules[0]?.id} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-6 bg-gray-100 p-1 rounded-xl">
                    {modules.map((mod) => (
                      <TabsTrigger key={mod.id} value={mod.id} className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200">
                        <Settings className="h-4 w-4" />
                        {mod.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {modules.map((mod) => (
                    <TabsContent key={mod.id} value={mod.id} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mod.permissions.map((perm) => (
                          <div key={perm.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                            <Checkbox
                              id={perm.id}
                              checked={formData.permissionIds.includes(perm.id)}
                              onCheckedChange={() => handlePermissionToggle(perm.id)}
                              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            />
                            <div className="flex-1">
                              <Label htmlFor={perm.id} className="font-medium cursor-pointer text-gray-900">
                                {perm.name}
                              </Label>
                              {perm.description && (
                                <p className="text-sm text-gray-600">
                                  {perm.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 hover:bg-gray-50">
              Cancelar
            </Button>
            <Button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg">
              <Plus className="h-4 w-4" />
              {user ? 'Actualizar Usuario' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
