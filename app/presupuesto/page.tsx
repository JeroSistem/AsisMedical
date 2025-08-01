'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Target, TrendingUp, DollarSign, FileText } from 'lucide-react';

export default function PresupuestoPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Presupuesto</h1>
          <p className="text-gray-600 mt-2">Gestión presupuestaria</p>
        </div>
        <Button className="bg-sky-500 hover:bg-sky-600">
          <BarChart3 className="w-4 h-4 mr-2" />
          Nuevo Presupuesto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,450,000</div>
            <p className="text-xs text-muted-foreground">
              Año fiscal 2024
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ejecutado</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$1,890,450</div>
            <p className="text-xs text-muted-foreground">
              77.2% del presupuesto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponible</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$559,550</div>
            <p className="text-xs text-muted-foreground">
              Restante para el año
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencimientos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">$125,000</div>
            <p className="text-xs text-muted-foreground">
              Próximos 30 días
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Partidas Presupuestarias */}
        <Card>
          <CardHeader>
            <CardTitle>Partidas Presupuestarias</CardTitle>
            <CardDescription>
              Ejecución por partida presupuestaria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { partida: 'Personal Médico', presupuesto: 850000, ejecutado: 720000, porcentaje: 84.7 },
                { partida: 'Medicamentos', presupuesto: 450000, ejecutado: 380000, porcentaje: 84.4 },
                { partida: 'Equipos Médicos', presupuesto: 320000, ejecutado: 280000, porcentaje: 87.5 },
                { partida: 'Servicios Generales', presupuesto: 280000, ejecutado: 220000, porcentaje: 78.6 },
                { partida: 'Mantenimiento', presupuesto: 150000, ejecutado: 110450, porcentaje: 73.6 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.porcentaje >= 80 ? 'bg-green-100' : 
                      item.porcentaje >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <BarChart3 className={`w-4 h-4 ${
                        item.porcentaje >= 80 ? 'text-green-600' : 
                        item.porcentaje >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{item.partida}</p>
                      <p className="text-sm text-gray-500">Presupuesto: ${item.presupuesto.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.ejecutado.toLocaleString()}</p>
                    <Badge variant={item.porcentaje >= 80 ? 'default' : 
                                  item.porcentaje >= 60 ? 'secondary' : 'destructive'}>
                      {item.porcentaje}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Proyectos de Inversión */}
        <Card>
          <CardHeader>
            <CardTitle>Proyectos de Inversión</CardTitle>
            <CardDescription>
              Proyectos presupuestarios en ejecución
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { proyecto: 'Nuevo Equipo de Resonancia', presupuesto: 450000, ejecutado: 320000, estado: 'En Progreso' },
                { proyecto: 'Ampliación de Emergencias', presupuesto: 280000, ejecutado: 280000, estado: 'Completado' },
                { proyecto: 'Sistema de Información', presupuesto: 180000, ejecutado: 150000, estado: 'En Progreso' },
                { proyecto: 'Renovación de Laboratorio', presupuesto: 220000, ejecutado: 180000, estado: 'En Progreso' },
                { proyecto: 'Equipos de Monitoreo', presupuesto: 120000, ejecutado: 95000, estado: 'En Progreso' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.estado === 'Completado' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <Target className={`w-4 h-4 ${
                        item.estado === 'Completado' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{item.proyecto}</p>
                      <p className="text-sm text-gray-500">Presupuesto: ${item.presupuesto.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.ejecutado.toLocaleString()}</p>
                    <Badge variant={item.estado === 'Completado' ? 'default' : 'secondary'}>
                      {item.estado}
                    </Badge>
                  </div>
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
            Acciones frecuentes del módulo de presupuesto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="w-6 h-6 mb-2" />
              <span>Nuevo Presupuesto</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Target className="w-6 h-6 mb-2" />
              <span>Ejecución</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="w-6 h-6 mb-2" />
              <span>Proyecciones</span>
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