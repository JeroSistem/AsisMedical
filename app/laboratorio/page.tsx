"use client";

import { useState } from 'react';
import { AppLayout } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, TestTube, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// Datos de ejemplo para laboratorio
const mockExams = [
  {
    id: 1,
    patientName: "Juan Pérez",
    examType: "Hemograma Completo",
    doctorName: "Dr. Ana Martínez",
    date: "2024-01-15",
    status: "completed",
    result: "Normal",
    priority: "normal"
  },
  {
    id: 2,
    patientName: "María García",
    examType: "Glicemia en Ayunas",
    doctorName: "Dr. Carlos Rodríguez",
    date: "2024-01-15",
    status: "in_progress",
    result: "Pendiente",
    priority: "urgent"
  },
  {
    id: 3,
    patientName: "Carlos López",
    examType: "Perfil Lipídico",
    doctorName: "Dr. Ana Martínez",
    date: "2024-01-14",
    status: "pending",
    result: "Pendiente",
    priority: "normal"
  }
];

const statusColors = {
  completed: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800"
};

const statusLabels = {
  completed: "Completado",
  in_progress: "En Proceso",
  pending: "Pendiente",
  cancelled: "Cancelado"
};

const priorityColors = {
  urgent: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  normal: "bg-green-100 text-green-800",
  low: "bg-gray-100 text-gray-800"
};

const priorityLabels = {
  urgent: "Urgente",
  high: "Alta",
  normal: "Normal",
  low: "Baja"
};

export default function LaboratorioPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExams = mockExams.filter(exam =>
    exam.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.examType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExams = mockExams.length;
  const completedExams = mockExams.filter(e => e.status === 'completed').length;
  const pendingExams = mockExams.filter(e => e.status === 'pending').length;
  const urgentExams = mockExams.filter(e => e.priority === 'urgent').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laboratorio</h1>
            <p className="text-gray-600 mt-1">Gestión de exámenes y resultados</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Ver Reportes
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Examen
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TestTube className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Exámenes</p>
                  <p className="text-2xl font-bold text-gray-900">{totalExams}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Completados</p>
                  <p className="text-2xl font-bold text-gray-900">{completedExams}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingExams}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Urgentes</p>
                  <p className="text-2xl font-bold text-gray-900">{urgentExams}</p>
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
                  placeholder="Buscar exámenes por paciente, tipo o doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          </CardContent>
        </Card>

        {/* Exams List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Exámenes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <TestTube className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{exam.patientName}</h3>
                        <Badge className={statusColors[exam.status as keyof typeof statusColors]}>
                          {statusLabels[exam.status as keyof typeof statusLabels]}
                        </Badge>
                        <Badge className={priorityColors[exam.priority as keyof typeof priorityColors]}>
                          {priorityLabels[exam.priority as keyof typeof priorityLabels]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{exam.examType}</p>
                      <p className="text-sm text-gray-500">
                        Doctor: {exam.doctorName} | Fecha: {exam.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Resultado</p>
                      <p className="text-sm font-medium text-gray-900">{exam.result}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredExams.length === 0 && (
                <div className="text-center py-8">
                  <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron exámenes</h3>
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