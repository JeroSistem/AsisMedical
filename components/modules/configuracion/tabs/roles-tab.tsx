'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCog, Info, Plus, Edit, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface RolesTabProps {
  onChange?: () => void;
  entityId?: string | null;
}

const DEFAULT_ROLES = [
  {
    id: 'super-admin',
    name: 'SuperAdmin',
    description: 'Acceso total al sistema',
    users: 1,
    isDefault: true,
    permissions: {
      dashboard: { create: true, read: true, update: true, delete: true },
      usuarios: { create: true, read: true, update: true, delete: true },
      pacientes: { create: true, read: true, update: true, delete: true },
      administracion: { create: true, read: true, update: true, delete: true },
      facturacion: { create: true, read: true, update: true, delete: true },
      citas: { create: true, read: true, update: true, delete: true },
      historias: { create: true, read: true, update: true, delete: true },
      triage: { create: true, read: true, update: true, delete: true },
      asistencial: { create: true, read: true, update: true, delete: true },
      inventario: { create: true, read: true, update: true, delete: true },
      auditoria: { create: true, read: true, update: true, delete: true },
      laboratorio: { create: true, read: true, update: true, delete: true },
      calidad: { create: true, read: true, update: true, delete: true },
      farmacia: { create: true, read: true, update: true, delete: true },
      contabilidad: { create: true, read: true, update: true, delete: true },
      presupuesto: { create: true, read: true, update: true, delete: true },
      nomina: { create: true, read: true, update: true, delete: true },
      cartera: { create: true, read: true, update: true, delete: true },
      imagenes: { create: true, read: true, update: true, delete: true },
      configuracion: { create: true, read: true, update: true, delete: true },
    }
  },
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Administrador de la entidad',
    users: 3,
    isDefault: true,
    permissions: {
      dashboard: { create: false, read: true, update: false, delete: false },
      usuarios: { create: true, read: true, update: true, delete: false },
      pacientes: { create: true, read: true, update: true, delete: true },
      administracion: { create: true, read: true, update: true, delete: false },
      facturacion: { create: true, read: true, update: true, delete: true },
      citas: { create: true, read: true, update: true, delete: false },
      historias: { create: false, read: true, update: false, delete: false },
      triage: { create: true, read: true, update: true, delete: false },
      asistencial: { create: false, read: true, update: false, delete: false },
      inventario: { create: true, read: true, update: true, delete: false },
      auditoria: { create: false, read: true, update: false, delete: false },
      laboratorio: { create: false, read: true, update: false, delete: false },
      calidad: { create: true, read: true, update: true, delete: false },
      farmacia: { create: true, read: true, update: true, delete: false },
      contabilidad: { create: true, read: true, update: true, delete: false },
      presupuesto: { create: true, read: true, update: true, delete: false },
      nomina: { create: true, read: true, update: true, delete: false },
      cartera: { create: true, read: true, update: true, delete: false },
      imagenes: { create: false, read: true, update: false, delete: false },
      configuracion: { create: false, read: false, update: false, delete: false },
    }
  },
  {
    id: 'medico',
    name: 'Médico',
    description: 'Personal médico',
    users: 12,
    isDefault: true,
    permissions: {
      dashboard: { create: false, read: true, update: false, delete: false },
      usuarios: { create: false, read: false, update: false, delete: false },
      pacientes: { create: true, read: true, update: true, delete: false },
      administracion: { create: false, read: false, update: false, delete: false },
      facturacion: { create: false, read: true, update: false, delete: false },
      citas: { create: true, read: true, update: true, delete: false },
      historias: { create: true, read: true, update: true, delete: false },
      triage: { create: true, read: true, update: true, delete: false },
      asistencial: { create: true, read: true, update: true, delete: false },
      inventario: { create: false, read: false, update: false, delete: false },
      auditoria: { create: false, read: false, update: false, delete: false },
      laboratorio: { create: true, read: true, update: true, delete: false },
      calidad: { create: false, read: true, update: false, delete: false },
      farmacia: { create: true, read: true, update: true, delete: false },
      contabilidad: { create: false, read: false, update: false, delete: false },
      presupuesto: { create: false, read: false, update: false, delete: false },
      nomina: { create: false, read: false, update: false, delete: false },
      cartera: { create: false, read: false, update: false, delete: false },
      imagenes: { create: true, read: true, update: true, delete: false },
      configuracion: { create: false, read: false, update: false, delete: false },
    }
  },
  {
    id: 'enfermeria',
    name: 'Enfermería',
    description: 'Personal de enfermería',
    users: 8,
    isDefault: true,
    permissions: {
      dashboard: { create: false, read: true, update: false, delete: false },
      usuarios: { create: false, read: false, update: false, delete: false },
      pacientes: { create: true, read: true, update: true, delete: false },
      administracion: { create: false, read: false, update: false, delete: false },
      facturacion: { create: false, read: false, update: false, delete: false },
      citas: { create: true, read: true, update: true, delete: false },
      historias: { create: true, read: true, update: true, delete: false },
      triage: { create: true, read: true, update: true, delete: false },
      asistencial: { create: true, read: true, update: true, delete: false },
      inventario: { create: false, read: false, update: false, delete: false },
      auditoria: { create: false, read: false, update: false, delete: false },
      laboratorio: { create: false, read: true, update: false, delete: false },
      calidad: { create: false, read: true, update: false, delete: false },
      farmacia: { create: true, read: true, update: true, delete: false },
      contabilidad: { create: false, read: false, update: false, delete: false },
      presupuesto: { create: false, read: false, update: false, delete: false },
      nomina: { create: false, read: false, update: false, delete: false },
      cartera: { create: false, read: false, update: false, delete: false },
      imagenes: { create: false, read: true, update: false, delete: false },
      configuracion: { create: false, read: false, update: false, delete: false },
    }
  },
  {
    id: 'recepcion',
    name: 'Recepción',
    description: 'Personal de recepción y admisiones',
    users: 5,
    isDefault: true,
    permissions: {
      dashboard: { create: false, read: true, update: false, delete: false },
      usuarios: { create: false, read: false, update: false, delete: false },
      pacientes: { create: true, read: true, update: true, delete: false },
      administracion: { create: false, read: false, update: false, delete: false },
      facturacion: { create: true, read: true, update: true, delete: false },
      citas: { create: true, read: true, update: true, delete: false },
      historias: { create: false, read: false, update: false, delete: false },
      triage: { create: true, read: true, update: true, delete: false },
      asistencial: { create: false, read: false, update: false, delete: false },
      inventario: { create: false, read: false, update: false, delete: false },
      auditoria: { create: false, read: false, update: false, delete: false },
      laboratorio: { create: false, read: false, update: false, delete: false },
      calidad: { create: false, read: false, update: false, delete: false },
      farmacia: { create: false, read: false, update: false, delete: false },
      contabilidad: { create: false, read: false, update: false, delete: false },
      presupuesto: { create: false, read: false, update: false, delete: false },
      nomina: { create: false, read: false, update: false, delete: false },
      cartera: { create: false, read: false, update: false, delete: false },
      imagenes: { create: false, read: false, update: false, delete: false },
      configuracion: { create: false, read: false, update: false, delete: false },
    }
  },
  {
    id: 'laboratorio',
    name: 'Laboratorio',
    description: 'Personal de laboratorio clínico',
    users: 4,
    isDefault: true,
    permissions: {
      usuarios: { create: false, read: false, update: false, delete: false },
      pacientes: { create: false, read: true, update: false, delete: false },
      historias: { create: false, read: true, update: false, delete: false },
      imagenes: { create: false, read: false, update: false, delete: false },
      laboratorio: { create: true, read: true, update: true, delete: true },
      facturacion: { create: false, read: false, update: false, delete: false },
      configuracion: { create: false, read: false, update: false, delete: false },
    }
  },
  {
    id: 'facturacion',
    name: 'Facturación',
    description: 'Personal de facturación y contabilidad',
    users: 2,
    isDefault: true,
    permissions: {
      dashboard: { create: false, read: true, update: false, delete: false },
      usuarios: { create: false, read: false, update: false, delete: false },
      pacientes: { create: false, read: true, update: false, delete: false },
      administracion: { create: false, read: false, update: false, delete: false },
      facturacion: { create: true, read: true, update: true, delete: true },
      citas: { create: false, read: false, update: false, delete: false },
      historias: { create: false, read: true, update: false, delete: false },
      triage: { create: false, read: false, update: false, delete: false },
      asistencial: { create: false, read: false, update: false, delete: false },
      inventario: { create: false, read: false, update: false, delete: false },
      auditoria: { create: false, read: false, update: false, delete: false },
      laboratorio: { create: false, read: false, update: false, delete: false },
      calidad: { create: false, read: false, update: false, delete: false },
      farmacia: { create: false, read: false, update: false, delete: false },
      contabilidad: { create: true, read: true, update: true, delete: false },
      presupuesto: { create: true, read: true, update: true, delete: false },
      nomina: { create: false, read: false, update: false, delete: false },
      cartera: { create: true, read: true, update: true, delete: false },
      imagenes: { create: false, read: false, update: false, delete: false },
      configuracion: { create: false, read: false, update: false, delete: false },
    }
  },
];

// Lista completa de módulos del sistema
const MODULES = [
  'dashboard',
  'usuarios',
  'pacientes',
  'administracion',
  'facturacion',
  'citas',
  'historias',
  'triage',
  'asistencial',
  'inventario',
  'auditoria',
  'laboratorio',
  'calidad',
  'farmacia',
  'contabilidad',
  'presupuesto',
  'nomina',
  'cartera',
  'imagenes',
  'configuracion',
];

export function RolesTab({ onChange, entityId }: RolesTabProps) {
  const { data: session } = useSession();
  const currentUserRole = (session?.user as any)?.role || '';
  const isSuperAdmin = currentUserRole === 'SUPER_ADMIN';
  
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [customRolesEnabled, setCustomRolesEnabled] = useState(false);
  const [rolesEnabled, setRolesEnabled] = useState(true); // Estado para activar/desactivar configuración de roles

  const handlePermissionChange = async (roleId: string, module: string, action: string, value: boolean) => {
    if (!rolesEnabled || !entityId) {
      console.log('[handlePermissionChange] Bloqueado:', { rolesEnabled, entityId });
      return;
    }
    
    // Actualizar estado local
    const updatedRoles = roles.map(role => {
      if (role.id === roleId) {
        const updatedPermissions = {
          ...role.permissions,
          [module]: {
            ...role.permissions[module],
            [action]: value
          }
        };
        
        console.log(`[handlePermissionChange] Actualizando permiso:`, {
          roleId,
          module,
          action,
          value,
          permissions: updatedPermissions[module]
        });
        
        return {
          ...role,
          permissions: updatedPermissions
        };
      }
      return role;
    });
    
    setRoles(updatedRoles);
    onChange?.();
    
    // Guardar en la base de datos
    if (entityId) {
      try {
        const role = updatedRoles.find(r => r.id === roleId);
        if (role) {
          console.log(`[handlePermissionChange] Guardando permisos para rol ${roleId}:`, role.permissions);
          
          const response = await fetch('/api/configuracion/general', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              configs: {
                [`roles.${roleId}`]: role.permissions,
              },
              category: 'roles',
              entityId: entityId,
            }),
          });
          
          const result = await response.json();
          
          if (result.success) {
            console.log(`[handlePermissionChange] Permisos guardados exitosamente para rol ${roleId}`);
          } else {
            console.error(`[handlePermissionChange] Error guardando permisos:`, result.error);
          }
          
          // Disparar evento para actualizar la navegación
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('permissions-updated'));
          }
        }
      } catch (error) {
        console.error('Error guardando permisos:', error);
      }
    }
  };

  // Cargar estado de activación y permisos al cambiar la entidad
  React.useEffect(() => {
    if (entityId) {
      console.log('[RolesTab] Cargando permisos para entidad:', entityId);
      loadRolesEnabledState();
      loadRolesPermissions();
    } else {
      console.log('[RolesTab] No hay entityId, usando valores por defecto');
      setRolesEnabled(true); // Por defecto activado si no hay entidad
      // Resetear a valores por defecto cuando no hay entidad
      setRoles(DEFAULT_ROLES);
    }
  }, [entityId]);

  const loadRolesPermissions = async () => {
    if (!entityId) return;
    
    try {
      const response = await fetch(`/api/configuracion/general?category=roles&entityId=${entityId}`);
      const result = await response.json();
      
      console.log('[loadRolesPermissions] Respuesta del servidor:', result);
      
      if (result.success && result.data) {
        const updatedRoles = roles.map(role => {
          // Buscar configuración guardada para este rol
          // La clave puede venir en diferentes formatos:
          // - `roles.${role.id}` (sin prefijo entityId, ya removido por getSystemConfigsByCategory)
          // - `${entityId}:roles.${role.id}` (con prefijo, aunque debería estar removido)
          const roleConfig = result.data.find((config: any) => {
            const key = (config.key || '').trim();
            // Remover el prefijo del entityId si existe (por seguridad)
            const cleanKey = key.includes(':') ? key.split(':').slice(1).join(':') : key;
            // Buscar coincidencias exactas
            const expectedKey = `roles.${role.id}`;
            return cleanKey === expectedKey || cleanKey === role.id || key === expectedKey || key === role.id;
          });
          
          console.log(`[loadRolesPermissions] Rol ${role.id}:`, {
            encontrado: !!roleConfig,
            key: roleConfig?.key,
            expectedKey: `roles.${role.id}`,
            allKeys: result.data.map((c: any) => c.key),
            value: roleConfig?.value ? Object.keys(roleConfig.value).length + ' módulos' : null
          });
          
          if (roleConfig && roleConfig.value) {
            // Usar los permisos guardados directamente, pero asegurar que todos los módulos estén presentes
            const savedPermissions = roleConfig.value as Record<string, { create: boolean; read: boolean; update: boolean; delete: boolean }>;
            
            // Crear un objeto de permisos completo combinando los guardados con los por defecto
            // Los guardados tienen prioridad, pero si falta algún módulo nuevo, usar el por defecto
            const completePermissions: Record<string, { create: boolean; read: boolean; update: boolean; delete: boolean }> = {};
            
            // Primero, asegurar que todos los módulos estén presentes usando los valores por defecto
            MODULES.forEach(module => {
              completePermissions[module] = role.permissions[module] || { create: false, read: false, update: false, delete: false };
            });
            
            // Luego, sobrescribir con los permisos guardados (que tienen prioridad)
            Object.keys(savedPermissions).forEach(module => {
              if (savedPermissions[module] && typeof savedPermissions[module] === 'object') {
                completePermissions[module] = {
                  create: savedPermissions[module].create ?? false,
                  read: savedPermissions[module].read ?? false,
                  update: savedPermissions[module].update ?? false,
                  delete: savedPermissions[module].delete ?? false,
                };
              }
            });
            
            return {
              ...role,
              permissions: completePermissions,
            };
          }
          
          // Si no hay configuración guardada, usar los permisos por defecto
          return role;
        });
        
        console.log('[loadRolesPermissions] Roles actualizados:', updatedRoles);
        setRoles(updatedRoles);
      } else {
        console.warn('[loadRolesPermissions] No se recibieron datos o la respuesta no fue exitosa');
      }
    } catch (error) {
      console.error('Error cargando permisos de roles:', error);
    }
  };

  const loadRolesEnabledState = async () => {
    if (!entityId) return;
    
    try {
      const response = await fetch(`/api/configuracion/general?category=roles&entityId=${entityId}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        const enabledConfig = result.data.find((config: any) => 
          config.key === 'roles.enabled' || config.key === 'enabled'
        );
        if (enabledConfig) {
          setRolesEnabled(enabledConfig.value === true);
        }
      }
    } catch (error) {
      console.error('Error cargando estado de roles:', error);
    }
  };

  const handleRolesEnabledToggle = async (enabled: boolean) => {
    setRolesEnabled(enabled);
    onChange?.();
    
    // Guardar el estado inmediatamente
    if (entityId) {
      try {
        await fetch('/api/configuracion/general', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            configs: {
              'roles.enabled': enabled,
            },
            category: 'roles',
            entityId: entityId,
          }),
        });
        
        // Disparar evento para actualizar la navegación
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('permissions-updated'));
        }
      } catch (error) {
        console.error('Error guardando estado de roles:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UserCog className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Roles & Permisos</h3>
          <p className="text-sm text-muted-foreground">
            Gestión de roles y control de acceso basado en roles (RBAC)
          </p>
        </div>
      </div>

      {/* Toggle para activar/desactivar configuración de roles para la entidad */}
      {entityId && (
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">
                  {rolesEnabled ? 'Configuración de Roles Activada' : 'Configuración de Roles Desactivada'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {rolesEnabled 
                    ? 'Los roles y permisos están habilitados para esta institución. Puedes modificar los permisos a continuación.'
                    : 'Los roles y permisos están deshabilitados para esta institución. Todos los switches están bloqueados.'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={rolesEnabled ? "default" : "secondary"} className="text-sm">
                  {rolesEnabled ? 'Activo' : 'Inactivo'}
                </Badge>
                <Switch
                  checked={rolesEnabled}
                  onCheckedChange={handleRolesEnabledToggle}
                  className="scale-125"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Habilitar roles personalizados */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Habilitar Roles Personalizados</Label>
              <p className="text-sm text-muted-foreground">
                Permite crear roles adicionales además de los predefinidos
              </p>
            </div>
            <Switch
              checked={customRolesEnabled}
              onCheckedChange={(checked) => {
                setCustomRolesEnabled(checked);
                onChange?.();
              }}
              disabled={!rolesEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla de roles y permisos */}
      <Card className={!rolesEnabled ? 'opacity-60' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Permisos por Rol</CardTitle>
              <CardDescription>
                Configura los permisos CRUD para cada módulo y rol
              </CardDescription>
            </div>
            {customRolesEnabled && rolesEnabled && (
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Rol
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!rolesEnabled && entityId && (
            <Alert className="mb-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
              <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                <strong>Configuración bloqueada:</strong> Los roles y permisos están desactivados para esta institución. 
                Activa la configuración de roles en la parte superior para poder modificar los permisos.
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-6">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{role.name}</h4>
                        {role.isDefault && (
                          <Badge variant="secondary">Por defecto</Badge>
                        )}
                        {role.id === 'super-admin' && (
                          <Badge variant={isSuperAdmin ? "default" : "destructive"}>
                            {isSuperAdmin ? "Editable" : "Protegido"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {role.users} usuario{role.users !== 1 ? 's' : ''} asignado{role.users !== 1 ? 's' : ''}
                      </p>
                      {role.id === 'super-admin' && isSuperAdmin && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">
                          ✓ Puedes modificar los permisos de este rol
                        </p>
                      )}
                    </div>
                  </div>
                  {!role.isDefault && customRolesEnabled && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Grid de permisos */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Módulo</TableHead>
                        <TableHead className="text-center">Crear</TableHead>
                        <TableHead className="text-center">Leer</TableHead>
                        <TableHead className="text-center">Actualizar</TableHead>
                        <TableHead className="text-center">Eliminar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MODULES.map((module) => {
                        // Mapeo de nombres técnicos a nombres legibles
                        const moduleNames: Record<string, string> = {
                          dashboard: 'Dashboard',
                          usuarios: 'Usuarios',
                          pacientes: 'Pacientes',
                          administracion: 'Administración',
                          facturacion: 'Facturación',
                          citas: 'Citas',
                          historias: 'Historias Clínicas',
                          triage: 'Triage',
                          asistencial: 'Asistencial',
                          inventario: 'Inventario',
                          auditoria: 'Auditoría',
                          laboratorio: 'Laboratorio',
                          calidad: 'Calidad',
                          farmacia: 'Farmacia',
                          contabilidad: 'Contabilidad',
                          presupuesto: 'Presupuesto',
                          nomina: 'Nómina',
                          cartera: 'Cartera',
                          imagenes: 'Imágenes Diagnósticas',
                          configuracion: 'Configuración General',
                        };
                        
                        return (
                        <TableRow key={module}>
                          <TableCell className="font-medium">{moduleNames[module] || module}</TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={role.permissions[module]?.create || false}
                              onCheckedChange={(checked) => handlePermissionChange(role.id, module, 'create', checked)}
                              disabled={(role.id === 'super-admin' && !isSuperAdmin) || !rolesEnabled}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={role.permissions[module]?.read || false}
                              onCheckedChange={(checked) => handlePermissionChange(role.id, module, 'read', checked)}
                              disabled={(role.id === 'super-admin' && !isSuperAdmin) || !rolesEnabled}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={role.permissions[module]?.update || false}
                              onCheckedChange={(checked) => handlePermissionChange(role.id, module, 'update', checked)}
                              disabled={(role.id === 'super-admin' && !isSuperAdmin) || !rolesEnabled}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={role.permissions[module]?.delete || false}
                              onCheckedChange={(checked) => handlePermissionChange(role.id, module, 'delete', checked)}
                              disabled={(role.id === 'super-admin' && !isSuperAdmin) || !rolesEnabled}
                            />
                          </TableCell>
                        </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>

          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Importante:</strong> Debe existir siempre al menos un usuario con rol SuperAdmin. 
              {isSuperAdmin 
                ? ' Como SuperAdmin, puedes modificar los permisos de este rol para ajustar los permisos necesarios.'
                : ' Este rol no puede ser modificado ni eliminado por otros usuarios.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

