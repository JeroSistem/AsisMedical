'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image, Camera, FileText, Clock, CheckCircle } from 'lucide-react';

export default function ImagenesDiagnosticasPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Imágenes Diagnósticas</h1>
          <p className="text-gray-600 mt-2">Gestión de imágenes médicas</p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Camera className="w-4 h-4 mr-2" />
          Nueva Imagen
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imágenes Hoy</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Imágenes capturadas hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <p className="text-xs text-muted-foreground">
              Esperando interpretación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">15</div>
            <p className="text-xs text-muted-foreground">
              Interpretadas hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reportes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Reportes generados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Imágenes Pendientes */}
        <Card>
          <CardHeader>
            <CardTitle>Imágenes Pendientes</CardTitle>
            <CardDescription>
              Imágenes esperando interpretación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { patient: 'María González', type: 'Radiografía de Tórax', time: '09:30 AM', priority: 'Alta' },
                { patient: 'Juan Pérez', type: 'Ecografía Abdominal', time: '10:15 AM', priority: 'Media' },
                { patient: 'Ana López', type: 'Tomografía Cerebral', time: '11:00 AM', priority: 'Alta' },
                { patient: 'Carlos Ruiz', type: 'Resonancia Magnética', time: '11:45 AM', priority: 'Baja' },
                { patient: 'Laura Torres', type: 'Mamografía', time: '12:30 PM', priority: 'Media' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.priority === 'Alta' ? 'bg-red-100' : 
                      item.priority === 'Media' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <Image className={`w-4 h-4 ${
                        item.priority === 'Alta' ? 'text-red-600' : 
                        item.priority === 'Media' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{item.patient}</p>
                      <p className="text-sm text-gray-500">{item.type} • {item.time}</p>
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

        {/* Tipos de Estudios */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Estudios</CardTitle>
            <CardDescription>
              Distribución por tipo de estudio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Radiografía', count: 45, percentage: 35 },
                { type: 'Ecografía', count: 32, percentage: 25 },
                { type: 'Tomografía', count: 28, percentage: 22 },
                { type: 'Resonancia', count: 15, percentage: 12 },
                { type: 'Mamografía', count: 8, percentage: 6 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                      <Camera className="w-4 h-4 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-medium">{item.type}</p>
                      <p className="text-sm text-gray-500">{item.count} estudios</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.percentage}%</p>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-pink-500 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
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
            Acciones frecuentes del módulo de imágenes diagnósticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Camera className="w-6 h-6 mb-2" />
              <span>Nueva Imagen</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="w-6 h-6 mb-2" />
              <span>Interpretar</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Image className="w-6 h-6 mb-2" />
              <span>Ver Imágenes</span>
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