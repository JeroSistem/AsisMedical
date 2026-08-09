'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Baby, User, UserCheck } from 'lucide-react';

export default function GruposEtareosPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grupos Etáreos</h1>
          <p className="text-gray-600 mt-2">Gestión de grupos etáreos</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Users className="w-4 h-4 mr-2" />
          Nuevo Grupo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Grupos</CardTitle>
            <Users className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Categorías activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Niños (0-12)</CardTitle>
            <Baby className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">Pacientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adolescentes (13-17)</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">Pacientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adultos (18+)</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Pacientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Groups */}
        <Card>
          <CardHeader>
            <CardTitle>Grupos Etáreos</CardTitle>
            <CardDescription>Distribución por edades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Lactantes (0-2 años)', count: 123, icon: Baby, color: 'text-blue-600' },
                { name: 'Preescolares (3-5 años)', count: 89, icon: User, color: 'text-green-600' },
                { name: 'Escolares (6-12 años)', count: 244, icon: User, color: 'text-green-600' },
                { name: 'Adolescentes (13-17 años)', count: 234, icon: User, color: 'text-purple-600' },
                { name: 'Adultos Jóvenes (18-35 años)', count: 567, icon: User, color: 'text-purple-600' },
                { name: 'Adultos (36-65 años)', count: 445, icon: UserCheck, color: 'text-orange-600' },
                { name: 'Adultos Mayores (65+)', count: 222, icon: UserCheck, color: 'text-red-600' }
              ].map((group, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <group.icon className={`h-5 w-5 ${group.color}`} />
                    <div>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-gray-500">{group.count} pacientes</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{group.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Operaciones frecuentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Crear Grupo
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Baby className="w-4 h-4 mr-2" />
                Estadísticas por Edad
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Reportes Demográficos
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <UserCheck className="w-4 h-4 mr-2" />
                Análisis de Tendencias
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 