"use client";

import { useState } from 'react';
import { AppLayout } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { TriageForm } from '@/components/shared/modal-form';
import { useModalForm } from '@/hooks/use-modal-form';

// Datos de ejemplo para triage
const mockTriage = [
  {
    id: 1,
    patientName: "Juan Pérez",
    priority: "high",
    symptoms: "Dolor de pecho, dificultad para respirar",
    vitalSigns: "T: 38.5°C, P: 120/min, PA: 140/90",
    status: "waiting",
    createdAt: "2024-01-15 14:30",
    observations: "Paciente presenta dolor agudo en el pecho"
  },
  {
    id: 2,
    patientName: "María García",
    priority: "medium",
    symptoms: "Fiebre, dolor de cabeza",
    vitalSigns: "T: 37.8°C, P: 85/min, PA: 120/80",
    status: "in_progress",
    createdAt: "2024-01-15 13:45",
    observations: "Síntomas gripales, sin complicaciones"
  },
  {
    id: 3,
    patientName: "Carlos López",
    priority: "critical",
    symptoms: "Pérdida de consciencia, convulsiones",
    vitalSigns: "T: 36.2°C, P: 140/min, PA: 180/110",
    status: "completed",
    createdAt: "2024-01-15 12:15",
    observations: "Crisis epiléptica, requiere atención inmediata"
  }
];

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800"
};

const priorityLabels = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  critical: "Crítica"
};

const statusColors = {
  waiting: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800"
};

const statusLabels = {
  waiting: "Esperando",
  in_progress: "En Proceso",
  completed: "Completado"
};

export default function TriagePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, formData, openModal, closeModal, handleSubmit } = useModalForm();

  const filteredTriage = mockTriage.filter(triage =>
    triage.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    triage.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTriage = async (formData: FormData) => {
    try {
      const data = Object.fromEntries(formData.entries());
      console.log('Nuevo triage:', data);
      // Aquí puedes hacer la llamada a la API para crear el triage
      closeModal();
      // Recargar la lista de triage
    } catch (error) {
      console.error('Error al crear triage:', error);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Clock className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Triage</h1>
            <p className="text-gray-600 mt-1">Gestiona la priorización de pacientes</p>
          </div>
          <Button onClick={() => openModal()} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Triage
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Triage</p>
                  <p className="text-2xl font-bold text-gray-900">{mockTriage.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">En Espera</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockTriage.filter(t => t.status === 'waiting').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Críticos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockTriage.filter(t => t.priority === 'critical').length}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {mockTriage.filter(t => t.status === 'completed').length}
                  </p>
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
                  placeholder="Buscar por paciente o síntomas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          </CardContent>
        </Card>

        {/* Triage List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Triage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTriage.map((triage) => (
                <div
                  key={triage.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{triage.patientName}</h3>
                        <Badge className={priorityColors[triage.priority as keyof typeof priorityColors]}>
                          {getPriorityIcon(triage.priority)}
                          {priorityLabels[triage.priority as keyof typeof priorityLabels]}
                        </Badge>
                        <Badge className={statusColors[triage.status as keyof typeof statusColors]}>
                          {statusLabels[triage.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Síntomas:</strong> {triage.symptoms}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Signos Vitales:</strong> {triage.vitalSigns}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Creado</p>
                      <p className="text-sm font-medium text-gray-900">{triage.createdAt}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredTriage.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron registros de triage</h3>
                  <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Form */}
      <TriageForm
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleCreateTriage}
        triage={formData}
      />
    </AppLayout>
  );
}
