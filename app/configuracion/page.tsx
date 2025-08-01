"use client";

import { useState } from 'react';
import { AppLayout } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, Bell, Database, Users, Globe, Key, Save } from 'lucide-react';

// Datos de ejemplo para configuración
const mockSettings = [
  {
    id: 1,
    name: "Configuración General",
    description: "Configuración básica del sistema",
    status: "active",
    lastModified: "2024-01-15",
    category: "General"
  },
  {
    id: 2,
    name: "Configuración de Seguridad",
    description: "Configuración de contraseñas y acceso",
    status: "active",
    lastModified: "2024-01-14",
    category: "Seguridad"
  },
  {
    id: 3,
    name: "Configuración de Notificaciones",
    description: "Configuración de alertas y notificaciones",
    status: "inactive",
    lastModified: "2024-01-10",
    category: "Notificaciones"
  }
];

const categoryColors = {
  "General": "bg-blue-100 text-blue-800",
  "Seguridad": "bg-red-100 text-red-800",
  "Notificaciones": "bg-green-100 text-green-800",
  "Base de Datos": "bg-purple-100 text-purple-800",
  "Integración": "bg-orange-100 text-orange-800"
};

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800"
};

const statusLabels = {
  active: "Activo",
  inactive: "Inactivo",
  pending: "Pendiente"
};

export default function ConfiguracionPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSettings = mockSettings.filter(setting =>
    setting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSettings = mockSettings.length;
  const activeSettings = mockSettings.filter(s => s.status === 'active').length;
  const inactiveSettings = mockSettings.filter(s => s.status === 'inactive').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
            <p className="text-gray-600 mt-1">Gestión de configuraciones del sistema</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Backup
            </Button>
            <Button className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Configuraciones</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSettings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Activas</p>
                  <p className="text-2xl font-bold text-gray-900">{activeSettings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactivas</p>
                  <p className="text-2xl font-bold text-gray-900">{inactiveSettings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Database className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Último Backup</p>
                  <p className="text-2xl font-bold text-gray-900">Hoy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Usuarios y Permisos</h3>
              <p className="text-gray-600 mb-4">Gestionar usuarios y roles del sistema</p>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Seguridad</h3>
              <p className="text-gray-600 mb-4">Configuración de seguridad y acceso</p>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Bell className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Notificaciones</h3>
              <p className="text-gray-600 mb-4">Configurar alertas y notificaciones</p>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Versión:</span>
                  <span className="font-semibold">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base de Datos:</span>
                  <span className="font-semibold">PostgreSQL 16.9</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Framework:</span>
                  <span className="font-semibold">Next.js 15.4.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Última Actualización:</span>
                  <span className="font-semibold">2024-01-15</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <Badge className="bg-green-100 text-green-800">Operativo</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime:</span>
                  <span className="font-semibold">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memoria:</span>
                  <span className="font-semibold">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Almacenamiento:</span>
                  <span className="font-semibold">60%</span>
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
                <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar configuraciones por nombre o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings List */}
        <Card>
          <CardHeader>
            <CardTitle>Configuraciones del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSettings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Settings className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{setting.name}</h3>
                        <Badge className={categoryColors[setting.category as keyof typeof categoryColors]}>
                          {setting.category}
                        </Badge>
                        <Badge className={statusColors[setting.status as keyof typeof statusColors]}>
                          {statusLabels[setting.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                      <p className="text-sm text-gray-500">
                        Última modificación: {setting.lastModified}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredSettings.length === 0 && (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron configuraciones</h3>
                  <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 