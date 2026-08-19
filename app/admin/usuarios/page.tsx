'use client';

import React, { useEffect, useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Save, User, Shield, Mail, List, Plus, RefreshCw, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  createInstitutionEmployee,
  listInstitutionEmployees,
  setInstitutionEmployeeStatus,
  updateInstitutionEmployee,
} from '@/lib/actions/entity-employees';
import { getMyInstitution } from '@/lib/actions/my-institution';
import {
  ensureDefaultAccessProfilesForCurrentInstitution,
  listAccessProfiles,
} from '@/lib/actions/access-profiles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserFormData {
  // Información Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  birthDate: string;
  identificationNumber: string;
  identificationType: string;
  profilePhoto: File | null;

  // Información del Sistema
  username: string;
  password: string;
  confirmPassword: string;
  departmentWork: string;
  position: string;
  employeeCode: string;
  hireDate: string;
  status: string;

  /** Perfil de acceso (Roles / Perfiles) */
  accessProfileId: string;

  // Configuración de Notificaciones
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  appointmentReminders: boolean;
  systemAlerts: boolean;
  reportNotifications: boolean;
}

type AccessProfileOption = {
  id: string;
  name: string;
  description: string;
  status: string;
};

type EmployeeRow = {
  id: string;
  name: string;
  email: string;
  username: string;
  status: string;
  accessProfileId: string | null;
  accessProfileName: string | null;
  createdAt: string;
  lastLogin: string | null;
};

function statusLabel(status: string) {
  const s = (status || '').toLowerCase();
  if (s === 'active' || s === 'activo') return 'Activo';
  if (s === 'inactive' || s === 'inactivo') return 'Inactivo';
  if (s === 'suspended' || s === 'suspendido') return 'Suspendido';
  return status || '—';
}

function formatDate(value?: string | null) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('es-CO');
}

export default function UsersPage() {
  const [tab, setTab] = useState<'crear' | 'lista'>('crear');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [institutionLabel, setInstitutionLabel] = useState('');
  const [profiles, setProfiles] = useState<AccessProfileOption[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    // Información Personal
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    department: '',
    birthDate: '',
    identificationNumber: '',
    identificationType: 'cc',
    profilePhoto: null,

    // Información del Sistema
    username: '',
    password: '',
    confirmPassword: '',
    departmentWork: '',
    position: '',
    employeeCode: '',
    hireDate: '',
    status: 'active',

    accessProfileId: '',

    // Configuración de Notificaciones
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: true,
    systemAlerts: true,
    reportNotifications: false,
  });

  const loadEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const res = await listInstitutionEmployees();
      if (!res.success) {
        toast.error(res.error || 'No se pudo cargar la lista de usuarios');
        setEmployees([]);
        return;
      }
      setEmployees(
        (res.data || []).map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          username: u.username,
          status: u.status,
          accessProfileId: u.accessProfileId || null,
          accessProfileName: u.accessProfileName || null,
          createdAt: u.createdAt,
          lastLogin: u.lastLogin,
        }))
      );
    } catch {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    (async () => {
      const [inst, profilesRes] = await Promise.all([
        getMyInstitution(),
        listAccessProfiles(),
      ]);
      if (inst.success && inst.data) {
        setInstitutionLabel(inst.data.name);
        setFormData((prev) => ({
          ...prev,
          city: inst.data!.city || '',
          department: inst.data!.department || '',
          phone: prev.phone || inst.data!.phone || '',
        }));
      }
      if (profilesRes.success) {
        const active = (profilesRes.data || []).filter(
          (p) => String(p.status).toLowerCase() === 'active'
        );
        setProfiles(active);
        if (active.length > 0) {
          setFormData((prev) =>
            prev.accessProfileId
              ? prev
              : { ...prev, accessProfileId: active[0].id }
          );
        }
      } else if (profilesRes.error) {
        toast.error(profilesRes.error);
      }
      setLoadingProfiles(false);
    })();
  }, []);

  useEffect(() => {
    if (tab === 'lista') {
      void loadEmployees();
    }
  }, [tab]);

  const handleInputChange = (field: keyof UserFormData, value: string | boolean | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field: 'profilePhoto', file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const resetCreateForm = (keepInstitution = true) => {
    setEditingId(null);
    setFormData((prev) => ({
      ...prev,
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      identificationNumber: '',
      address: '',
      departmentWork: '',
      position: '',
      employeeCode: '',
      accessProfileId: '',
      status: 'active',
      phone: keepInstitution ? prev.phone : '',
      city: keepInstitution ? prev.city : '',
      department: keepInstitution ? prev.department : '',
    }));
  };

  const startEdit = (row: EmployeeRow) => {
    const parts = row.name.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    const st = (row.status || '').toLowerCase();
    const status =
      st === 'inactive' || st === 'inactivo'
        ? 'inactive'
        : st === 'suspended' || st === 'suspendido'
          ? 'suspended'
          : 'active';

    setEditingId(row.id);
    setFormData((prev) => ({
      ...prev,
      firstName,
      lastName,
      email: row.email || '',
      username: row.username || '',
      password: '',
      confirmPassword: '',
      accessProfileId: row.accessProfileId || '',
      status,
    }));
    setTab('crear');
    toast.message('Editando usuario', {
      description: 'Deje la contraseña en blanco si no desea cambiarla.',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.username.trim()
    ) {
      toast.error('Complete nombre, apellido, email y usuario');
      return;
    }

    if (!editingId) {
      if (!formData.password || !formData.confirmPassword) {
        toast.error('Complete la contraseña y su confirmación');
        return;
      }
    }

    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Las contraseñas no coinciden');
        return;
      }
    }

    if (!formData.accessProfileId) {
      toast.error('Seleccione un perfil de acceso para el usuario');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const result = await updateInstitutionEmployee({
          userId: editingId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          username: formData.username,
          password: formData.password || undefined,
          status: formData.status,
          accessProfileId: formData.accessProfileId,
        });
        if (!result.success) {
          toast.error(result.error || 'No se pudo actualizar el usuario');
          return;
        }
        toast.success('Usuario actualizado');
        resetCreateForm();
        setTab('lista');
        void loadEmployees();
        return;
      }

      const result = await createInstitutionEmployee({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        status: formData.status,
        accessProfileId: formData.accessProfileId,
      });
      if (!result.success) {
        toast.error(result.error || 'No se pudo crear el usuario');
        return;
      }
      toast.success(
        `Usuario creado en la BD de ${institutionLabel || 'la institución'}`
      );
      resetCreateForm();
      setTab('lista');
      void loadEmployees();
    } catch {
      toast.error(
        editingId ? 'Error al actualizar el usuario' : 'Error al guardar el usuario'
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleEmployeeStatus = async (row: EmployeeRow) => {
    const isActive =
      row.status.toLowerCase() === 'active' || row.status.toLowerCase() === 'activo';
    const next = isActive ? 'Inactive' : 'Active';
    const res = await setInstitutionEmployeeStatus(row.id, next);
    if (!res.success) {
      toast.error(res.error || 'No se pudo cambiar el estado');
      return;
    }
    toast.success(`Usuario ${next === 'Active' ? 'activado' : 'desactivado'}`);
    void loadEmployees();
  };

  const actions =
    tab === 'crear' ? (
      <div className="flex gap-2">
        {editingId ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetCreateForm();
              setTab('lista');
            }}
          >
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" form="user-form" className="flex items-center gap-2" disabled={saving}>
          <Save className="h-4 w-4" />
          {saving
            ? 'Guardando…'
            : editingId
              ? 'Actualizar usuario'
              : 'Guardar Usuario'}
        </Button>
      </div>
    ) : (
      <Button
        type="button"
        variant="outline"
        onClick={() => void loadEmployees()}
        disabled={loadingEmployees}
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${loadingEmployees ? 'animate-spin' : ''}`} />
        Actualizar
      </Button>
    );

  return (
    <ModulePageLayout
      title="Gestión de Usuarios"
      description={
        institutionLabel
          ? `Empleados de ${institutionLabel} (ciudad y departamento vienen de la institución)`
          : 'Crear y administrar usuarios de la institución'
      }
      actions={actions}
      maxWidth="7xl"
      showBackButton={true}
    >
      <Tabs
        value={tab}
        onValueChange={(v) => {
          const next = v === 'lista' ? 'lista' : 'crear';
          if (next === 'lista' && editingId) {
            resetCreateForm();
          }
          if (next === 'crear' && !editingId) {
            // crear nuevo
          }
          setTab(next);
        }}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="crear" className="gap-2">
            {editingId ? (
              <Pencil className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {editingId ? 'Editar usuario' : 'Crear usuario'}
          </TabsTrigger>
          <TabsTrigger value="lista" className="gap-2">
            <List className="h-4 w-4" />
            Lista de usuarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crear" className="mt-0 space-y-6">
      <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Sección 1: Información Personal */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="flex items-center gap-1">
                      Nombres
                      <Badge variant="destructive" className="text-xs">*</Badge>
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Nombres del usuario"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="flex items-center gap-1">
                      Apellidos
                      <Badge variant="destructive" className="text-xs">*</Badge>
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Apellidos del usuario"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                      Email
                      <Badge variant="destructive" className="text-xs">*</Badge>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="email@ejemplo.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-1">
                      Teléfono
                      <Badge variant="destructive" className="text-xs">*</Badge>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Teléfono"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="identificationType">Tipo de Documento</Label>
                    <Select value={formData.identificationType} onValueChange={(value) => handleInputChange('identificationType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cc">Cédula de Ciudadanía</SelectItem>
                        <SelectItem value="ce">Cédula de Extranjería</SelectItem>
                        <SelectItem value="ti">Tarjeta de Identidad</SelectItem>
                        <SelectItem value="pp">Pasaporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="identificationNumber" className="flex items-center gap-1">
                      Número de Documento
                      <Badge variant="destructive" className="text-xs">*</Badge>
                    </Label>
                    <Input
                      id="identificationNumber"
                      value={formData.identificationNumber}
                      onChange={(e) => handleInputChange('identificationNumber', e.target.value)}
                      placeholder="Número de documento"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Dirección completa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Ciudad (de la institución)"
                      readOnly
                      className="bg-slate-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="Departamento (de la institución)"
                      readOnly
                      className="bg-slate-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Foto de Perfil</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('profilePhoto', e.target.files?.[0] || null)}
                        className="hidden"
                        id="profilePhoto"
                      />
                      <Label htmlFor="profilePhoto" className="cursor-pointer text-blue-600 hover:text-blue-700">
                        Arrastra o selecciona una foto
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
        </ModuleCard>

        {/* Sección 2: Información del Sistema */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Información del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="flex items-center gap-1">
                      Nombre de Usuario
                      <Badge variant="destructive" className="text-xs">*</Badge>
                    </Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Nombre de usuario"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-1">
                      Contraseña
                      {!editingId ? (
                        <Badge variant="destructive" className="text-xs">
                          *
                        </Badge>
                      ) : null}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder={
                        editingId
                          ? 'Dejar en blanco para no cambiar'
                          : 'Contraseña'
                      }
                      required={!editingId}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-1">
                      Confirmar Contraseña
                      {!editingId ? (
                        <Badge variant="destructive" className="text-xs">
                          *
                        </Badge>
                      ) : null}
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder={
                        editingId
                          ? 'Dejar en blanco para no cambiar'
                          : 'Confirmar contraseña'
                      }
                      required={!editingId}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departmentWork" className="flex items-center gap-1">
                      Departamento/Área
                      <Badge variant="destructive" className="text-xs">*</Badge>
                    </Label>
                    <Input
                      id="departmentWork"
                      value={formData.departmentWork}
                      onChange={(e) => handleInputChange('departmentWork', e.target.value)}
                      placeholder="Departamento o área de trabajo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position" className="flex items-center gap-1">
                      Cargo
                      <Badge variant="destructive" className="text-xs">*</Badge>
                    </Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="Cargo del usuario"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeCode">Código de Empleado</Label>
                    <Input
                      id="employeeCode"
                      value={formData.employeeCode}
                      onChange={(e) => handleInputChange('employeeCode', e.target.value)}
                      placeholder="Código de empleado"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hireDate">Fecha de Contratación</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => handleInputChange('hireDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                        <SelectItem value="suspended">Suspendido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
        </ModuleCard>

        {/* Sección 3: Perfil de acceso */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Perfil de acceso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-xl space-y-2">
              <Label htmlFor="accessProfileId" className="flex items-center gap-1">
                Perfil asignado
                <Badge variant="destructive" className="text-xs">
                  *
                </Badge>
              </Label>
              <Select
                value={formData.accessProfileId || undefined}
                onValueChange={(value) => handleInputChange('accessProfileId', value)}
                disabled={loadingProfiles || profiles.length === 0}
              >
                <SelectTrigger id="accessProfileId">
                  <SelectValue
                    placeholder={
                      loadingProfiles
                        ? 'Cargando perfiles…'
                        : profiles.length === 0
                          ? 'No hay perfiles creados'
                          : 'Seleccione un perfil'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                      {p.description ? ` — ${p.description}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Los permisos del usuario salen del perfil seleccionado. Cree o edite
                perfiles en{' '}
                <Link href="/admin/roles" className="text-primary underline-offset-4 hover:underline">
                  Roles / Perfiles
                </Link>
                .
              </p>
              {!loadingProfiles && profiles.length === 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-amber-700">
                    Debe haber al menos un perfil activo para registrar usuarios.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={creatingProfile}
                    onClick={async () => {
                      setCreatingProfile(true);
                      try {
                        const res =
                          await ensureDefaultAccessProfilesForCurrentInstitution();
                        if (!res.success) {
                          toast.error(
                            res.error || 'No se pudo crear el perfil Administrador'
                          );
                          return;
                        }
                        const profilesRes = await listAccessProfiles();
                        const active = (profilesRes.data || []).filter(
                          (p) => String(p.status).toLowerCase() === 'active'
                        );
                        setProfiles(active);
                        if (active[0]) {
                          setFormData((prev) => ({
                            ...prev,
                            accessProfileId: active[0].id,
                          }));
                        }
                        toast.success('Perfil Administrador creado. Ya puede guardar el usuario.');
                      } finally {
                        setCreatingProfile(false);
                      }
                    }}
                  >
                    {creatingProfile ? 'Creando…' : 'Crear perfil Administrador'}
                  </Button>
                </div>
              ) : null}
            </div>
          </CardContent>
        </ModuleCard>

        {/* Sección 4: Configuración de Notificaciones */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configuración de Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 mb-4">Tipos de Notificación</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          checked={formData.emailNotifications}
                          onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="emailNotifications" className="cursor-pointer">Notificaciones por Email</Label>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          id="smsNotifications"
                          checked={formData.smsNotifications}
                          onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="smsNotifications" className="cursor-pointer">Notificaciones por SMS</Label>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          id="pushNotifications"
                          checked={formData.pushNotifications}
                          onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="pushNotifications" className="cursor-pointer">Notificaciones Push</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 mb-4">Alertas Específicas</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          id="appointmentReminders"
                          checked={formData.appointmentReminders}
                          onChange={(e) => handleInputChange('appointmentReminders', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="appointmentReminders" className="cursor-pointer">Recordatorios de Citas</Label>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          id="systemAlerts"
                          checked={formData.systemAlerts}
                          onChange={(e) => handleInputChange('systemAlerts', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="systemAlerts" className="cursor-pointer">Alertas del Sistema</Label>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          id="reportNotifications"
                          checked={formData.reportNotifications}
                          onChange={(e) => handleInputChange('reportNotifications', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="reportNotifications" className="cursor-pointer">Notificaciones de Reportes</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
        </ModuleCard>
      </form>
        </TabsContent>

        <TabsContent value="lista" className="mt-0">
          <ModuleCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Lista de usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingEmployees ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Cargando usuarios…
                </p>
              ) : employees.length === 0 ? (
                <div className="space-y-3 py-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    Aún no hay usuarios del sistema registrados.
                  </p>
                  <Button type="button" onClick={() => setTab('crear')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear usuario
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Perfil</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Creado</TableHead>
                        <TableHead>Último acceso</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((u) => {
                        const isActive =
                          u.status.toLowerCase() === 'active' ||
                          u.status.toLowerCase() === 'activo';
                        return (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">{u.name}</TableCell>
                            <TableCell className="font-mono text-sm">
                              {u.username || '—'}
                            </TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{u.accessProfileName || '—'}</TableCell>
                            <TableCell>
                              <Badge variant={isActive ? 'default' : 'secondary'}>
                                {statusLabel(u.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-sm">
                              {formatDate(u.createdAt)}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-sm">
                              {formatDate(u.lastLogin)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => startEdit(u)}
                                >
                                  <Pencil className="mr-1 h-3.5 w-3.5" />
                                  Editar
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => void toggleEmployeeStatus(u)}
                                >
                                  {isActive ? 'Desactivar' : 'Activar'}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </ModuleCard>
        </TabsContent>
      </Tabs>
    </ModulePageLayout>
  );
}
