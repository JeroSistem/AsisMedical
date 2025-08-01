'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Target, TrendingUp, Award, CheckCircle } from 'lucide-react';

export default function CalidadPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calidad</h1>
          <p className="text-gray-600 mt-2">Gestión de calidad y acreditación</p>
        </div>
        <Button className="bg-rose-500 hover:bg-rose-600">
          <Star className="w-4 h-4 mr-2" />
          Nueva Evaluación
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indicadores</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95.2%</div>
            <p className="text-xs text-muted-foreground">
              Cumplimiento general
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluaciones</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mejoras</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              Desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificaciones</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Certificaciones activas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Indicadores de Calidad */}
        <Card>
          <CardHeader>
            <CardTitle>Indicadores de Calidad</CardTitle>
            <CardDescription>
              Principales indicadores de calidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Satisfacción del Paciente', value: 94.5, target: 90, status: 'Excelente' },
                { name: 'Tiempo de Espera', value: 87.2, target: 85, status: 'Bueno' },
                { name: 'Precisión Diagnóstica', value: 96.8, target: 95, status: 'Excelente' },
                { name: 'Cumplimiento Protocolos', value: 92.1, target: 90, status: 'Bueno' },
                { name: 'Seguridad del Paciente', value: 98.3, target: 95, status: 'Excelente' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.value >= item.target ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Target className={`w-4 h-4 ${
                        item.value >= item.target ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Meta: {item.target}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.value}%</p>
                    <Badge variant={item.value >= item.target ? 'default' : 'destructive'}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Evaluaciones Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluaciones Recientes</CardTitle>
            <CardDescription>
              Últimas evaluaciones de calidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { area: 'Atención al Paciente', score: 95, evaluator: 'Dr. García', date: '2024-01-15' },
                { area: 'Procedimientos Médicos', score: 92, evaluator: 'Dra. López', date: '2024-01-14' },
                { area: 'Documentación', score: 88, evaluator: 'Dr. Martínez', date: '2024-01-13' },
                { area: 'Seguridad', score: 97, evaluator: 'Dra. Rodríguez', date: '2024-01-12' },
                { area: 'Equipos Médicos', score: 94, evaluator: 'Dr. Pérez', date: '2024-01-11' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.score >= 90 ? 'bg-green-100' : 
                      item.score >= 80 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Star className={`w-4 h-4 ${
                        item.score >= 90 ? 'text-green-600' : 
                        item.score >= 80 ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{item.area}</p>
                      <p className="text-sm text-gray-500">{item.evaluator} • {item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.score}/100</p>
                    <Badge variant={item.score >= 90 ? 'default' : 
                                  item.score >= 80 ? 'secondary' : 'destructive'}>
                      {item.score >= 90 ? 'Excelente' : 
                       item.score >= 80 ? 'Bueno' : 'Necesita Mejora'}
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
            Acciones frecuentes del módulo de calidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Star className="w-6 h-6 mb-2" />
              <span>Nueva Evaluación</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Target className="w-6 h-6 mb-2" />
              <span>Indicadores</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Award className="w-6 h-6 mb-2" />
              <span>Certificaciones</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CheckCircle className="w-6 h-6 mb-2" />
              <span>Reportes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 