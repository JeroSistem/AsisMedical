'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ModulePageLayout } from '@/components/shared/module-page-layout';

interface PermissionData {
  entityId: string;
  entityName: string;
  rolesEnabled: boolean;
  rolePermissions: Record<string, {
    usuarios?: { read: boolean; create: boolean; update: boolean; delete: boolean };
    pacientes?: { read: boolean; create: boolean; update: boolean; delete: boolean };
    historias?: { read: boolean; create: boolean; update: boolean; delete: boolean };
    imagenes?: { read: boolean; create: boolean; update: boolean; delete: boolean };
    laboratorio?: { read: boolean; create: boolean; update: boolean; delete: boolean };
    facturacion?: { read: boolean; create: boolean; update: boolean; delete: boolean };
    configuracion?: { read: boolean; create: boolean; update: boolean; delete: boolean };
  }>;
}

const MODULE_NAMES: Record<string, string> = {
  usuarios: 'Usuarios',
  pacientes: 'Pacientes',
  historias: 'Historias Clínicas',
  imagenes: 'Imágenes Diagnósticas',
  laboratorio: 'Laboratorio',
  facturacion: 'Facturación',
  configuracion: 'Configuración',
};

const ROLE_NAMES: Record<string, string> = {
  'super-admin': 'SuperAdmin',
  'admin': 'Administrador',
  'medico': 'Médico',
  'enfermeria': 'Enfermería',
  'recepcion': 'Recepción',
  'laboratorio': 'Laboratorio',
  'facturacion': 'Facturación',
};

export default function ConsultarPermisosPage() {
  const [entityName, setEntityName] = useState('');
  const [loading, setLoading] = useState(false);
  const [permissionData, setPermissionData] = useState<PermissionData | null>(null);

  const handleSearch = async () => {
    if (!entityName.trim()) {
      toast.error('Por favor ingresa el nombre de la entidad');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/configuracion/entity-permissions?entityName=${encodeURIComponent(entityName.trim())}`);
      const result = await response.json();

      if (result.success && result.data) {
        setPermissionData(result.data);
        toast.success(`Permisos encontrados para "${result.data.entityName}"`);
      } else {
        toast.error(result.error || 'No se encontraron permisos para esta entidad');
        setPermissionData(null);
      }
    } catch (error: any) {
      console.error('Error consultando permisos:', error);
      toast.error('Error al consultar los permisos: ' + error.message);
      setPermissionData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <ModulePageLayout
      title="Consultar Permisos de Entidades"
      description="Consulta los permisos configurados para cada entidad del sistema"
    >
      <div className="space-y-6">
        {/* Buscador */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Entidad</CardTitle>
            <CardDescription>
              Ingresa el nombre de la entidad para consultar sus permisos configurados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="entity-name">Nombre de la Entidad</Label>
                <Input
                  id="entity-name"
                  placeholder="Ej: Hospital San José de Tolu"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        {permissionData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Permisos de: {permissionData.entityName}</CardTitle>
                  <CardDescription>
                    ID: {permissionData.entityId}
                  </CardDescription>
                </div>
                <Badge variant={permissionData.rolesEnabled ? 'default' : 'secondary'}>
                  {permissionData.rolesEnabled ? 'Roles Habilitados' : 'Roles Deshabilitados'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {!permissionData.rolesEnabled ? (
                <Alert>
                  <AlertDescription>
                    Los roles no están habilitados para esta entidad. Los usuarios usarán los permisos por defecto según su rol.
                  </AlertDescription>
                </Alert>
              ) : Object.keys(permissionData.rolePermissions).length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No se han configurado permisos específicos para ningún rol en esta entidad.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-6">
                  {Object.entries(permissionData.rolePermissions).map(([roleId, permissions]) => (
                    <div key={roleId} className="space-y-2">
                      <h3 className="text-lg font-semibold">
                        {ROLE_NAMES[roleId] || roleId}
                      </h3>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Módulo</TableHead>
                              <TableHead className="text-center">Leer</TableHead>
                              <TableHead className="text-center">Crear</TableHead>
                              <TableHead className="text-center">Actualizar</TableHead>
                              <TableHead className="text-center">Eliminar</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(permissions).map(([module, perms]) => (
                              <TableRow key={module}>
                                <TableCell className="font-medium">
                                  {MODULE_NAMES[module] || module}
                                </TableCell>
                                <TableCell className="text-center">
                                  {perms.read ? (
                                    <Check className="h-5 w-5 text-green-600 mx-auto" />
                                  ) : (
                                    <X className="h-5 w-5 text-red-600 mx-auto" />
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  {perms.create ? (
                                    <Check className="h-5 w-5 text-green-600 mx-auto" />
                                  ) : (
                                    <X className="h-5 w-5 text-red-600 mx-auto" />
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  {perms.update ? (
                                    <Check className="h-5 w-5 text-green-600 mx-auto" />
                                  ) : (
                                    <X className="h-5 w-5 text-red-600 mx-auto" />
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  {perms.delete ? (
                                    <Check className="h-5 w-5 text-green-600 mx-auto" />
                                  ) : (
                                    <X className="h-5 w-5 text-red-600 mx-auto" />
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instrucciones */}
        {!permissionData && !loading && (
          <Card>
            <CardHeader>
              <CardTitle>Instrucciones</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Ingresa el nombre completo o parcial de la entidad que deseas consultar</li>
                <li>La búsqueda es case-insensitive (no distingue mayúsculas/minúsculas)</li>
                <li>Se mostrarán todos los permisos configurados para cada rol en esa entidad</li>
                <li>Si los roles no están habilitados, se mostrará un mensaje indicándolo</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </ModulePageLayout>
  );
}
