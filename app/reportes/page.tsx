"use client";

import { useState } from 'react';
import { AppLayout } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, BarChart3, PieChart, TrendingUp, Calendar, Users, DollarSign } from 'lucide-react';

// Datos de ejemplo para reportes
const mockReports = [
  {
    id: 1,
    name: "Reporte de Pacientes - Enero 2024",
    type: "Pacientes",
    date: "2024-01-15",
    status: "completed",
    size: "2.5 MB",
    downloads: 15
  },
  {
    id: 2,
    name: "Reporte Financiero - Diciembre 2023",
    type: "Financiero",
    date: "2024-01-10",
    status: "completed",
    size: "1.8 MB",
    downloads: 8
  },
  {
    id: 3,
    name: "Reporte de Triage - Semana 2",
    type: "Triage",
    date: "2024-01-14",
    status: "generating",
    size: "0.5 MB",
    downloads: 3
  }
];

const typeColors = {
  "Pacientes": "bg-blue-100 text-blue-800",
  "Financiero": "bg-green-100 text-green-800",
  "Triage": "bg-orange-100 text-orange-800",
  "Laboratorio": "bg-purple-100 text-purple-800",
  "Admisión": "bg-red-100 text-red-800"
};

const statusColors = {
  completed: "bg-green-100 text-green-800",
  generating: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800"
};

const statusLabels = {
  completed: "Completado",
  generating: "Generando",
  failed: "Fallido"
};

export default function ReportesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = mockReports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalReports = mockReports.length;
  const completedReports = mockReports.filter(r => r.status === 'completed').length;
  const generatingReports = mockReports.filter(r => r.status === 'generating').length;
  const totalDownloads = mockReports.reduce((sum, report) => sum + report.downloads, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
            <p className="text-gray-600 mt-1">Generación y gestión de reportes</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Ver Estadísticas
            </Button>
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Nuevo Reporte
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reportes</p>
                  <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Download className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Descargas</p>
                  <p className="text-2xl font-bold text-gray-900">{totalDownloads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Completados</p>
                  <p className="text-2xl font-bold text-gray-900">{completedReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Generando</p>
                  <p className="text-2xl font-bold text-gray-900">{generatingReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Reports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Reporte de Pacientes</h3>
              <p className="text-gray-600 mb-4">Estadísticas detalladas de pacientes</p>
              <Button variant="outline" size="sm">
                Generar
              </Button>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Reporte Financiero</h3>
              <p className="text-gray-600 mb-4">Análisis de ingresos y gastos</p>
              <Button variant="outline" size="sm">
                Generar
              </Button>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Reporte de Citas</h3>
              <p className="text-gray-600 mb-4">Programación y asistencia</p>
              <Button variant="outline" size="sm">
                Generar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar reportes por nombre o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>Reportes Generados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{report.name}</h3>
                        <Badge className={typeColors[report.type as keyof typeof typeColors]}>
                          {report.type}
                        </Badge>
                        <Badge className={statusColors[report.status as keyof typeof statusColors]}>
                          {statusLabels[report.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        Fecha: {report.date} | Tamaño: {report.size} | Descargas: {report.downloads}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredReports.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron reportes</h3>
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