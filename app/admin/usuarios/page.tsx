"use client";

import { useState } from 'react';
import { AppLayout } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Users, Shield, UserPlus, Settings } from 'lucide-react';
import { UserForm } from '@/components/shared/modal-form';
import { useModalForm } from '@/hooks/use-modal-form';

// Datos de ejemplo para usuarios
const mockUsers = [
  {
    id: 1,
    name: "Dr. Ana Martínez",
    email: "ana.martinez@hospital.com",
    role: "doctor",
    department: "emergency",
    status: "active",
    lastLogin: "2024-01-15 10:30"
  },
  {
    id: 2,
    name: "Lic. Carlos Rodríguez",
    email: "carlos.rodriguez@hospital.com",
    role: "nurse",
    department: "pediatrics",
    status: "active",
    lastLogin: "2024-01-15 09:15"
  },
  {
    id: 3,
    name: "María González",
    email: "maria.gonzalez@hospital.com",
    role: "receptionist",
    department: "internal",
    status: "inactive",
    lastLogin: "2024-01-14 16:45"
  }
];

const roleColors = {
  admin: "bg-red-100 text-red-800",
  doctor: "bg-blue-100 text-blue-800",
  nurse: "bg-green-100 text-green-800",
  receptionist: "bg-purple-100 text-purple-800"
};

const roleLabels = {
  admin: "Administrador",
  doctor: "Doctor",
  nurse: "Enfermero/a",
  receptionist: "Recepcionista"
};

const departmentLabels = {
  emergency: "Emergencias",
  pediatrics: "Pediatría",
  surgery: "Cirugía",
  internal: "Medicina Interna"
};

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800"
};

const statusLabels = {
  active: "Activo",
  inactive: "Inactivo"
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, formData, openModal, closeModal, handleSubmit } = useModalForm();

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roleLabels[user.role as keyof typeof roleLabels].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = async (formData: FormData) => {
    try {
      const data = Object.fromEntries(formData.entries());
      console.log('Nuevo usuario:', data);
      // Aquí puedes hacer la llamada a la API para crear el usuario
      closeModal();
      // Recargar la lista de usuarios
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
            <p className="text-gray-600 mt-1">Gestiona los usuarios del sistema</p>
          </div>
          <Button onClick={() => openModal()} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                  <p className="text-2xl font-bold text-gray-900">{mockUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockUsers.filter(u => u.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Administradores</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockUsers.filter(u => u.role === 'admin').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserPlus className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Nuevos Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar usuarios por nombre, email o rol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                          {roleLabels[user.role as keyof typeof roleLabels]}
                        </Badge>
                        <Badge className={statusColors[user.status as keyof typeof statusColors]}>
                          {statusLabels[user.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        {departmentLabels[user.department as keyof typeof departmentLabels]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Último acceso</p>
                      <p className="text-sm font-medium text-gray-900">{user.lastLogin}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
                  <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Form */}
      <UserForm
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleCreateUser}
        user={formData}
      />
    </AppLayout>
  );
}
