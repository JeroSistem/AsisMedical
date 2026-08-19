'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Plus,
  Shield,
  Building2,
  Mail,
  Edit,
  Ban,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { PLATFORM_MODULES_CATALOG } from '@/lib/platform-modules';

type ModuleItem = { id: string; name: string; description?: string };

const FALLBACK_MODULES: ModuleItem[] = PLATFORM_MODULES_CATALOG.map((m) => ({
  id: m.name,
  name: m.name,
  description: m.description,
}));

type PrincipalRow = {
  id: string;
  name: string;
  nit?: string | null;
  city?: string | null;
  department?: string | null;
  phone?: string | null;
  type: string;
  status: string;
  hasPrincipalUser: boolean;
  moduleIds?: string[];
  adminUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  } | null;
};

type FormState = {
  entityId: string;
  institutionName: string;
  nit: string;
  city: string;
  department: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  status: 'Active' | 'Inactive';
  modules: string[];
};

const emptyForm = (): FormState => ({
  entityId: '',
  institutionName: '',
  nit: '',
  city: '',
  department: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  status: 'Active',
  modules: [],
});

export function PrincipalUsersPanel() {
  const [rows, setRows] = useState<PrincipalRow[]>([]);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingEntityId, setEditingEntityId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());

  const load = async () => {
    setLoading(true);
    try {
      const [usersRes, modulesRes] = await Promise.all([
        fetch('/api/plataforma/usuarios-principales', {
          credentials: 'include',
          cache: 'no-store',
        }),
        fetch('/api/plataforma/modulos', {
          credentials: 'include',
          cache: 'no-store',
        }),
      ]);

      let usersJson: any = null;
      let modulesJson: any = null;
      try {
        usersJson = await usersRes.json();
      } catch {
        usersJson = { success: false, error: 'Respuesta inválida al listar' };
      }
      try {
        modulesJson = await modulesRes.json();
      } catch {
        modulesJson = { success: false, data: [] };
      }

      if (!usersJson.success) {
        toast.error(usersJson.error || 'No se pudo cargar el listado');
        setRows([]);
      } else {
        setRows(usersJson.data || []);
      }

      if (
        modulesJson.success &&
        Array.isArray(modulesJson.data) &&
        modulesJson.data.length > 0
      ) {
        setModules(modulesJson.data);
      } else {
        // Fallback: catálogo local para que siempre se puedan seleccionar
        setModules(FALLBACK_MODULES);
      }
    } catch {
      setModules(FALLBACK_MODULES);
      toast.error('Error al cargar usuarios principales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingEntityId(null);
    setForm(emptyForm());
    if (modules.length === 0) {
      setModules(FALLBACK_MODULES);
    }
    setOpen(true);
  };

  const openEdit = (row: PrincipalRow) => {
    setEditingEntityId(row.id);
    setForm({
      entityId: row.id,
      institutionName: row.name || '',
      nit: row.nit || '',
      city: row.city || '',
      department: row.department || '',
      phone: row.phone || '',
      email: row.adminUser?.email || '',
      password: '',
      confirmPassword: '',
      status:
        row.adminUser?.status === 'Inactive' || row.status === 'INACTIVE'
          ? 'Inactive'
          : 'Active',
      modules: row.moduleIds || [],
    });
    setOpen(true);
  };

  const toggleModule = (id: string) => {
    setForm((prev) => ({
      ...prev,
      modules: prev.modules.includes(id)
        ? prev.modules.filter((m) => m !== id)
        : [...prev.modules, id],
    }));
  };

  const toggleAllModules = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      modules: checked ? modules.map((m) => m.id) : [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.institutionName.trim() ||
      !form.nit.trim() ||
      !form.city.trim() ||
      !form.department.trim() ||
      !form.phone.trim() ||
      !form.email.trim()
    ) {
      toast.error('Complete todos los campos obligatorios');
      return;
    }

    const needsPassword = !editingEntityId || !!form.password;
    if (needsPassword) {
      if (!form.password) {
        toast.error('La contraseña es obligatoria');
        return;
      }
      if (form.password !== form.confirmPassword) {
        toast.error('Las contraseñas no coinciden');
        return;
      }
      if (form.password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres');
        return;
      }
    }

    if (form.modules.length === 0) {
      toast.error('Seleccione al menos un módulo');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/plataforma/usuarios-principales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityId: editingEntityId || undefined,
          institutionName: form.institutionName,
          nit: form.nit,
          city: form.city,
          department: form.department,
          phone: form.phone,
          email: form.email,
          password: form.password || undefined,
          status: form.status,
          modules: form.modules,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.error || 'No se pudo guardar');
        return;
      }
      toast.success(
        editingEntityId
          ? 'Usuario principal actualizado'
          : 'Institución y usuario principal creados'
      );
      setOpen(false);
      setForm(emptyForm());
      await load();
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (entityId: string) => {
    if (!confirm('¿Desactivar el usuario principal de esta entidad?')) return;
    try {
      const res = await fetch(
        `/api/plataforma/usuarios-principales?entityId=${encodeURIComponent(entityId)}`,
        { method: 'DELETE' }
      );
      const json = await res.json();
      if (!json.success) {
        toast.error(json.error || 'No se pudo desactivar');
        return;
      }
      toast.success('Usuario principal desactivado');
      await load();
    } catch {
      toast.error('Error al desactivar');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Usuarios principales por entidad
            </CardTitle>
            <CardDescription>
              Registre la institución contratada, su acceso principal y los
              módulos permitidos. Si una institución quedó sin acceso, ábrala en
              Editar, vuelva a escribir la contraseña y guarde.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={load}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Actualizar
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button type="button" size="sm" onClick={openCreate}>
                  <Plus className="h-4 w-4 mr-1" />
                  Nuevo usuario principal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingEntityId
                      ? 'Editar usuario principal'
                      : 'Crear usuario principal'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="pu-institution">
                      Nombre completo de la institución
                    </Label>
                    <Input
                      id="pu-institution"
                      value={form.institutionName}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          institutionName: e.target.value,
                        }))
                      }
                      placeholder="Ej. Clínica San José"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="pu-nit">NIT</Label>
                      <Input
                        id="pu-nit"
                        value={form.nit}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, nit: e.target.value }))
                        }
                        placeholder="900123456-7"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pu-phone">Teléfono</Label>
                      <Input
                        id="pu-phone"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="601 123 4567"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="pu-city">Ciudad</Label>
                      <Input
                        id="pu-city"
                        value={form.city}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, city: e.target.value }))
                        }
                        placeholder="Bogotá"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pu-department">Departamento</Label>
                      <Input
                        id="pu-department"
                        value={form.department}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            department: e.target.value,
                          }))
                        }
                        placeholder="Cundinamarca"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pu-email">Email de acceso</Label>
                    <Input
                      id="pu-email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="admin@entidad.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="pu-pass">
                        Contraseña
                        {editingEntityId ? ' (opcional)' : ''}
                      </Label>
                      <Input
                        id="pu-pass"
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pu-pass2">Confirmar</Label>
                      <Input
                        id="pu-pass2"
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v: 'Active' | 'Inactive') =>
                        setForm((prev) => ({ ...prev, status: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Activo</SelectItem>
                        <SelectItem value="Inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Label>Módulos permitidos</Label>
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline"
                        onClick={() =>
                          toggleAllModules(
                            form.modules.length !== modules.length
                          )
                        }
                      >
                        {form.modules.length === modules.length
                          ? 'Quitar todos'
                          : 'Seleccionar todos'}
                      </button>
                    </div>
                    <div className="max-h-52 overflow-y-auto rounded-md border p-3 space-y-2">
                      {modules.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No hay módulos disponibles.
                        </p>
                      ) : (
                        modules.map((m) => (
                          <label
                            key={m.id}
                            className="flex items-start gap-2 text-sm cursor-pointer"
                          >
                            <Checkbox
                              checked={form.modules.includes(m.id)}
                              onCheckedChange={() => toggleModule(m.id)}
                            />
                            <span>
                              <span className="font-medium">{m.name}</span>
                              {m.description ? (
                                <span className="block text-muted-foreground text-xs">
                                  {m.description}
                                </span>
                              ) : null}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Guardando…' : 'Guardar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando…</p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay instituciones. Cree la primera con “Nuevo usuario
              principal”.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Institución</TableHead>
                  <TableHead>NIT</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{row.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {[row.city, row.department]
                              .filter(Boolean)
                              .join(', ') || row.type}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{row.nit || '—'}</TableCell>
                    <TableCell>
                      {row.adminUser ? (
                        <span className="inline-flex items-center gap-1 text-sm">
                          <Mail className="h-3.5 w-3.5" />
                          {row.adminUser.email}
                        </span>
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>
                      {row.adminUser ? (
                        <Badge
                          variant={
                            row.adminUser.status === 'Active'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {row.adminUser.status === 'Active'
                            ? 'Activo'
                            : 'Inactivo'}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pendiente</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(row)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Editar
                      </Button>
                      {row.adminUser?.status === 'Active' && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeactivate(row.id)}
                        >
                          <Ban className="h-3.5 w-3.5 mr-1" />
                          Desactivar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
