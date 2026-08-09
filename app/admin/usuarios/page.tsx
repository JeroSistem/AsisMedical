'use client';

import React, { useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Save, Users, User, Shield, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';

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
  role: string;
  departmentWork: string;
  position: string;
  employeeCode: string;
  hireDate: string;
  status: string;

  // Permisos y Acceso
  canAccessAdmin: boolean;
  canAccessMedical: boolean;
  canAccessFinancial: boolean;
  canAccessInventory: boolean;
  canAccessReports: boolean;
  canManageUsers: boolean;
  canManageRoles: boolean;

  // Configuración de Notificaciones
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  appointmentReminders: boolean;
  systemAlerts: boolean;
  reportNotifications: boolean;
}

export default function UsersPage() {
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
    role: 'user',
    departmentWork: '',
    position: '',
    employeeCode: '',
    hireDate: '',
    status: 'active',

    // Permisos y Acceso
    canAccessAdmin: false,
    canAccessMedical: false,
    canAccessFinancial: false,
    canAccessInventory: false,
    canAccessReports: false,
    canManageUsers: false,
    canManageRoles: false,

    // Configuración de Notificaciones
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: true,
    systemAlerts: true,
    reportNotifications: false,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'identificationNumber',
      'username', 'password', 'confirmPassword', 'role', 'departmentWork', 'position'
    ];

    const missingFields = requiredFields.filter(field => !formData[field as keyof UserFormData]);
    
    if (missingFields.length > 0) {
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    try {
      // Aquí iría la lógica para enviar los datos al servidor
      console.log('Datos del formulario:', formData);
      toast.success('Usuario guardado correctamente');
    } catch (error) {
      toast.error('Error al guardar el usuario');
    }
  };

  const actions = (
    <Button type="submit" form="user-form" className="flex items-center gap-2">
      <Save className="h-4 w-4" />
      Guardar Usuario
    </Button>
  );

  return (
    <ModulePageLayout
      title="Gestión de Usuarios"
      description="Crear y administrar usuarios del sistema"
      actions={actions}
      maxWidth="7xl"
      showBackButton={true}
    >
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
                      placeholder="Ciudad"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="Departamento"
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
                      <Badge variant="destructive" className="text-xs">*</Badge>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Contraseña"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-1">
                      Confirmar Contraseña
                      <Badge variant="destructive" className="text-xs">*</Badge>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirmar contraseña"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="flex items-center gap-1">
                      Rol
                      <Badge variant="destructive" className="text-xs">*</Badge>
                    </Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="medico">Médico</SelectItem>
                        <SelectItem value="enfermero">Enfermero</SelectItem>
                        <SelectItem value="user">Usuario</SelectItem>
                      </SelectContent>
                    </Select>
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

        {/* Sección 3: Permisos y Acceso */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permisos y Acceso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 mb-4">Módulos de Acceso</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          id="canAccessAdmin"
                          checked={formData.canAccessAdmin}
                          onChange={(e) => handleInputChange('canAccessAdmin', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="canAccessAdmin" className="cursor-pointer">Acceso a Administración</Label>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          id="canAccessMedical"
                          checked={formData.canAccessMedical}
                          onChange={(e) => handleInputChange('canAccessMedical', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="canAccessMedical" className="cursor-pointer">Acceso a Módulos Médicos</Label>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          id="canAccessFinancial"
                          checked={formData.canAccessFinancial}
                          onChange={(e) => handleInputChange('canAccessFinancial', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="canAccessFinancial" className="cursor-pointer">Acceso a Módulos Financieros</Label>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          id="canAccessInventory"
                          checked={formData.canAccessInventory}
                          onChange={(e) => handleInputChange('canAccessInventory', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="canAccessInventory" className="cursor-pointer">Acceso a Inventario</Label>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          id="canAccessReports"
                          checked={formData.canAccessReports}
                          onChange={(e) => handleInputChange('canAccessReports', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="canAccessReports" className="cursor-pointer">Acceso a Reportes</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 mb-4">Permisos Especiales</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          id="canManageUsers"
                          checked={formData.canManageUsers}
                          onChange={(e) => handleInputChange('canManageUsers', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="canManageUsers" className="cursor-pointer">Gestionar Usuarios</Label>
                      </div>

                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          id="canManageRoles"
                          checked={formData.canManageRoles}
                          onChange={(e) => handleInputChange('canManageRoles', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="canManageRoles" className="cursor-pointer">Gestionar Roles</Label>
                      </div>
                    </div>
                  </div>
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
    </ModulePageLayout>
  );
}
