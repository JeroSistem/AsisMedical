'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Shield, Save, Plus, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  createAccessProfile,
  deleteAccessProfile,
  getModulesForProfiles,
  listAccessProfiles,
  updateAccessProfile,
  type ModuleTreeNode,
  type ProfilePermissionInput,
} from '@/lib/actions/access-profiles';

type ProfileRow = {
  id: string;
  name: string;
  description: string;
  status: string;
  permissions: Array<{
    moduleKey: string;
    submoduleKey: string;
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  }>;
};

function permKey(moduleKey: string, submoduleKey = '') {
  return `${moduleKey}::${submoduleKey || ''}`;
}

export default function RolesPage() {
  const [modules, setModules] = useState<ModuleTreeNode[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  /** Keys seleccionadas: moduleKey::submoduleKey */
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [modRes, profRes] = await Promise.all([
        getModulesForProfiles(),
        listAccessProfiles(),
      ]);
      if (!modRes.success) {
        toast.error(modRes.error || 'No se pudieron cargar los módulos');
      } else {
        setModules(modRes.data || []);
      }
      if (!profRes.success) {
        toast.error(profRes.error || 'No se pudieron cargar los perfiles');
        setProfiles([]);
      } else {
        setProfiles(profRes.data || []);
      }
    } catch {
      toast.error('Error al cargar perfiles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const flatItems = useMemo(() => {
    const items: Array<{
      moduleKey: string;
      submoduleKey: string;
      title: string;
      depth: number;
    }> = [];
    const walk = (nodes: ModuleTreeNode[], parentModule?: string, depth = 0) => {
      for (const node of nodes) {
        const moduleKey = depth === 0 ? node.id : parentModule || node.id;
        const submoduleKey = depth === 0 ? '' : node.id;
        items.push({
          moduleKey,
          submoduleKey,
          title: node.title,
          depth,
        });
        if (node.children?.length) {
          walk(node.children, moduleKey, depth + 1);
        }
      }
    };
    walk(modules);
    return items;
  }, [modules]);

  const toggle = (moduleKey: string, submoduleKey: string, checked: boolean) => {
    const key = permKey(moduleKey, submoduleKey);
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const toggleModuleWithChildren = (moduleId: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const item of flatItems) {
        if (item.moduleKey === moduleId || item.submoduleKey === moduleId) {
          const key = permKey(item.moduleKey, item.submoduleKey);
          if (checked) next.add(key);
          else next.delete(key);
        }
      }
      // también el módulo raíz
      const rootKey = permKey(moduleId, '');
      if (checked) next.add(rootKey);
      else next.delete(rootKey);
      return next;
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setSelected(new Set());
  };

  const startEdit = (profile: ProfileRow) => {
    setEditingId(profile.id);
    setName(profile.name);
    setDescription(profile.description || '');
    const keys = new Set(
      profile.permissions.map((p) => permKey(p.moduleKey, p.submoduleKey))
    );
    setSelected(keys);
  };

  const buildPermissions = (): ProfilePermissionInput[] => {
    return Array.from(selected).map((key) => {
      const [moduleKey, submoduleKey = ''] = key.split('::');
      return {
        moduleKey,
        submoduleKey,
        canRead: true,
        canCreate: true,
        canUpdate: true,
        canDelete: false,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Indique el nombre del perfil');
      return;
    }
    if (selected.size === 0) {
      toast.error('Seleccione al menos un módulo o submódulo');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name,
        description,
        permissions: buildPermissions(),
      };
      const result = editingId
        ? await updateAccessProfile(editingId, payload)
        : await createAccessProfile(payload);

      if (!result.success) {
        toast.error(result.error || 'No se pudo guardar el perfil');
        return;
      }
      toast.success(
        editingId ? 'Perfil actualizado' : `Perfil "${name}" creado`
      );
      resetForm();
      await load();
    } catch {
      toast.error('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, profileName: string) => {
    if (!confirm(`¿Eliminar el perfil "${profileName}"?`)) return;
    const res = await deleteAccessProfile(id);
    if (!res.success) {
      toast.error(res.error || 'No se pudo eliminar');
      return;
    }
    toast.success('Perfil eliminado');
    if (editingId === id) resetForm();
    await load();
  };

  return (
    <ModulePageLayout
      title="Perfiles de acceso"
      description="Defina perfiles y asigne permisos sobre los módulos activos de su institución"
      maxWidth="7xl"
      showBackButton
      actions={
        <Button type="button" variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Actualizar
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {editingId ? 'Editar perfil' : 'Nuevo perfil'}
                </CardTitle>
                <CardDescription>
                  La lista de módulos se actualiza según los módulos contratados
                  para esta institución
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profileName">Nombre del perfil *</Label>
                      <Input
                        id="profileName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Médico de urgencias"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="profileDesc">Descripción</Label>
                      <Textarea
                        id="profileDesc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Qué puede hacer este perfil"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Módulos y submódulos permitidos</Label>
                      <Badge variant="secondary">
                        {selected.size} seleccionados
                      </Badge>
                    </div>

                    {loading ? (
                      <p className="text-sm text-gray-500">Cargando módulos…</p>
                    ) : modules.length === 0 ? (
                      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
                        Esta institución no tiene módulos activos. Active
                        módulos desde Plataforma → Usuarios principales y
                        volverán a aparecer aquí.
                      </p>
                    ) : (
                      <div className="max-h-[420px] overflow-y-auto rounded-md border p-3 space-y-3">
                        {modules.map((mod) => {
                          const rootChecked = selected.has(permKey(mod.id, ''));
                          return (
                            <div key={mod.id} className="space-y-2">
                              <div className="flex items-center gap-2 font-medium">
                                <Checkbox
                                  id={`mod-${mod.id}`}
                                  checked={rootChecked}
                                  onCheckedChange={(v) =>
                                    toggleModuleWithChildren(mod.id, v === true)
                                  }
                                />
                                <Label
                                  htmlFor={`mod-${mod.id}`}
                                  className="cursor-pointer"
                                >
                                  {mod.title}
                                </Label>
                              </div>
                              {mod.children?.map((sub) => {
                                const subKey = permKey(mod.id, sub.id);
                                const subChecked = selected.has(subKey);
                                return (
                                  <div key={sub.id} className="ml-6 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Checkbox
                                        id={`sub-${sub.id}`}
                                        checked={subChecked}
                                        onCheckedChange={(v) =>
                                          toggle(mod.id, sub.id, v === true)
                                        }
                                      />
                                      <Label
                                        htmlFor={`sub-${sub.id}`}
                                        className="cursor-pointer text-sm"
                                      >
                                        {sub.title}
                                      </Label>
                                    </div>
                                    {sub.children?.map((nested) => {
                                      const nKey = permKey(mod.id, nested.id);
                                      return (
                                        <div
                                          key={nested.id}
                                          className="ml-6 flex items-center gap-2"
                                        >
                                          <Checkbox
                                            id={`nested-${nested.id}`}
                                            checked={selected.has(nKey)}
                                            onCheckedChange={(v) =>
                                              toggle(
                                                mod.id,
                                                nested.id,
                                                v === true
                                              )
                                            }
                                          />
                                          <Label
                                            htmlFor={`nested-${nested.id}`}
                                            className="cursor-pointer text-xs text-gray-700"
                                          >
                                            {nested.title}
                                          </Label>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end">
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        disabled={saving}
                      >
                        Cancelar edición
                      </Button>
                    )}
                    <Button type="submit" disabled={saving || modules.length === 0}>
                      {editingId ? (
                        <>
                          <Save className="h-4 w-4 mr-1" />
                          {saving ? 'Guardando…' : 'Actualizar perfil'}
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          {saving ? 'Guardando…' : 'Crear perfil'}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ModuleCard>
        </div>

        <div className="lg:col-span-2">
          <ModuleCard>
            <Card>
              <CardHeader>
                <CardTitle>Perfiles creados</CardTitle>
                <CardDescription>
                  Guardados en la base de datos de su institución
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-gray-500">Cargando…</p>
                ) : profiles.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Aún no hay perfiles. Cree el primero con el formulario.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Perfil</TableHead>
                        <TableHead>Permisos</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            <div className="font-medium">{p.name}</div>
                            {p.description && (
                              <div className="text-xs text-gray-500">
                                {p.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {p.permissions.length}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(p)}
                            >
                              Editar
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(p.id, p.name)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </ModuleCard>
        </div>
      </div>
    </ModulePageLayout>
  );
}
