'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react';

export default function AuditoriaPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auditoría</h1>
          <p className="text-gray-600 mt-2">Auditoría y control de calidad</p>
        </div>
        <Button className="bg-violet-500 hover:bg-violet-600">
          <Search className="w-4 h-4 mr-2" />
          Nueva Auditoría
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auditorías Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">12</div>
            <p className="text-xs text-muted-foreground">
              Requieren revisión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auditorías Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">89</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hallazgos Críticos</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reportes Generados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              Reportes este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auditorías Pendientes */}
        <Card>
          <CardHeader>
            <CardTitle>Auditorías Pendientes</CardTitle>
            <CardDescription>
              Auditorías que requieren revisión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Auditoría de Historias Clínicas', area: 'Historias Clínicas', priority: 'Alta', date: '2024-01-20' },
                { title: 'Auditoría de Medicamentos', area: 'Farmacia', priority: 'Media', date: '2024-01-19' },
                { title: 'Auditoría de Procedimientos', area: 'Quirófano', priority: 'Alta', date: '2024-01-18' },
                { title: 'Auditoría de Documentación', area: 'Admisión', priority: 'Baja', date: '2024-01-17' },
                { title: 'Auditoría de Seguridad', area: 'General', priority: 'Alta', date: '2024-01-16' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.priority === 'Alta' ? 'bg-red-100' : 
                      item.priority === 'Media' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <Search className={`w-4 h-4 ${
                        item.priority === 'Alta' ? 'text-red-600' : 
                        item.priority === 'Media' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.area} • {item.date}</p>
                    </div>
                  </div>
                  <Badge variant={item.priority === 'Alta' ? 'destructive' : 
                                item.priority === 'Media' ? 'secondary' : 'outline'}>
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hallazgos Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Hallazgos Recientes</CardTitle>
            <CardDescription>
              Hallazgos de auditorías recientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Crítico', description: 'Documentación incompleta en historias clínicas', area: 'Historias Clínicas' },
                { type: 'Advertencia', description: 'Stock bajo en medicamentos críticos', area: 'Farmacia' },
                { type: 'Crítico', description: 'Procedimientos sin consentimiento informado', area: 'Quirófano' },
                { type: 'Info', description: 'Retraso en actualización de datos', area: 'Admisión' },
                { type: 'Advertencia', description: 'Equipos sin mantenimiento preventivo', area: 'Equipos' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.type === 'Crítico' ? 'bg-red-100' : 
                      item.type === 'Advertencia' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <AlertCircle className={`w-4 h-4 ${
                        item.type === 'Crítico' ? 'text-red-600' : 
                        item.type === 'Advertencia' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-gray-500">{item.area}</p>
                    </div>
                  </div>
                  <Badge variant={item.type === 'Crítico' ? 'destructive' : 
                                item.type === 'Advertencia' ? 'secondary' : 'outline'}>
                    {item.type}
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
            Acciones frecuentes del módulo de auditoría
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Search className="w-6 h-6 mb-2" />
              <span>Nueva Auditoría</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="w-6 h-6 mb-2" />
              <span>Generar Reporte</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertCircle className="w-6 h-6 mb-2" />
              <span>Ver Hallazgos</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CheckCircle className="w-6 h-6 mb-2" />
              <span>Completadas</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 