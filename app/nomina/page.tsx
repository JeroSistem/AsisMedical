'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, Calendar, FileText, UserPlus } from 'lucide-react';

export default function NominaPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nómina</h1>
          <p className="text-gray-600 mt-2">Gestión de recursos humanos</p>
        </div>
        <Button className="bg-fuchsia-500 hover:bg-fuchsia-600">
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Empleado
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Personal activo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nómina Mensual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$245,800</div>
            <p className="text-xs text-muted-foreground">
              Salarios + prestaciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vacaciones</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">12</div>
            <p className="text-xs text-muted-foreground">
              Solicitudes pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
            <p className="text-xs text-muted-foreground">
              Por renovar este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empleados por Departamento */}
        <Card>
          <CardHeader>
            <CardTitle>Empleados por Departamento</CardTitle>
            <CardDescription>
              Distribución del personal por área
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { departamento: 'Médicos', empleados: 45, porcentaje: 28.8 },
                { departamento: 'Enfermería', empleados: 38, porcentaje: 24.4 },
                { departamento: 'Administrativo', empleados: 25, porcentaje: 16.0 },
                { departamento: 'Laboratorio', empleados: 18, porcentaje: 11.5 },
                { departamento: 'Servicios Generales', empleados: 30, porcentaje: 19.2 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-fuchsia-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-fuchsia-600" />
                    </div>
                    <div>
                      <p className="font-medium">{item.departamento}</p>
                      <p className="text-sm text-gray-500">{item.empleados} empleados</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.porcentaje}%</p>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-fuchsia-500 rounded-full" 
                        style={{ width: `${item.porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Solicitudes Pendientes */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Pendientes</CardTitle>
            <CardDescription>
              Solicitudes de personal pendientes de aprobación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { empleado: 'María González', tipo: 'Vacaciones', fecha: '2024-02-15', estado: 'Pendiente' },
                { empleado: 'Juan Pérez', tipo: 'Permiso Médico', fecha: '2024-01-20', estado: 'Aprobado' },
                { empleado: 'Ana López', tipo: 'Vacaciones', fecha: '2024-03-10', estado: 'Pendiente' },
                { empleado: 'Carlos Ruiz', tipo: 'Permiso Personal', fecha: '2024-01-25', estado: 'Rechazado' },
                { empleado: 'Laura Torres', tipo: 'Vacaciones', fecha: '2024-02-28', estado: 'Pendiente' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.estado === 'Aprobado' ? 'bg-green-100' : 
                      item.estado === 'Rechazado' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      <Calendar className={`w-4 h-4 ${
                        item.estado === 'Aprobado' ? 'text-green-600' : 
                        item.estado === 'Rechazado' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{item.empleado}</p>
                      <p className="text-sm text-gray-500">{item.tipo} • {item.fecha}</p>
                    </div>
                  </div>
                  <Badge variant={item.estado === 'Aprobado' ? 'default' : 
                                item.estado === 'Rechazado' ? 'destructive' : 'secondary'}>
                    {item.estado}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Acciones frecuentes del módulo de nómina
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <UserPlus className="w-6 h-6 mb-2" />
              <span>Nuevo Empleado</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <DollarSign className="w-6 h-6 mb-2" />
              <span>Procesar Nómina</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="w-6 h-6 mb-2" />
              <span>Solicitudes</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="w-6 h-6 mb-2" />
              <span>Reportes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 