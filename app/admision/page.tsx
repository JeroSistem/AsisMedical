"use client";

import { useState } from 'react';
import { AppLayout } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Bed, User, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

// Datos de ejemplo para admisión
const mockAdmissions = [
  {
    id: 1,
    patientName: "Juan Pérez",
    roomNumber: "101",
    bedNumber: "A",
    admissionDate: "2024-01-15",
    dischargeDate: null,
    status: "admitted",
    doctorName: "Dr. Ana Martínez",
    diagnosis: "Neumonía"
  },
  {
    id: 2,
    patientName: "María García",
    roomNumber: "205",
    bedNumber: "B",
    admissionDate: "2024-01-14",
    dischargeDate: "2024-01-16",
    status: "discharged",
    doctorName: "Dr. Carlos Rodríguez",
    diagnosis: "Apendicitis"
  },
  {
    id: 3,
    patientName: "Carlos López",
    roomNumber: "103",
    bedNumber: "A",
    admissionDate: "2024-01-15",
    dischargeDate: null,
    status: "pending",
    doctorName: "Dr. Ana Martínez",
    diagnosis: "Fractura de fémur"
  }
];

const statusColors = {
  admitted: "bg-blue-100 text-blue-800",
  discharged: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  transferred: "bg-purple-100 text-purple-800"
};

const statusLabels = {
  admitted: "Admitido",
  discharged: "Dado de Alta",
  pending: "Pendiente",
  transferred: "Transferido"
};

export default function AdmisionPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAdmissions = mockAdmissions.filter(admission =>
    admission.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admission.roomNumber.includes(searchTerm) ||
    admission.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAdmissions = mockAdmissions.length;
  const currentAdmissions = mockAdmissions.filter(a => a.status === 'admitted').length;
  const pendingAdmissions = mockAdmissions.filter(a => a.status === 'pending').length;
  const dischargedToday = mockAdmissions.filter(a => 
    a.status === 'discharged' && a.dischargeDate === new Date().toISOString().split('T')[0]
  ).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admisión</h1>
            <p className="text-gray-600 mt-1">Gestión de admisiones y camas</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Bed className="h-4 w-4" />
              Ver Camas
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Admisión
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Admisiones</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAdmissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bed className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Actualmente Admitidos</p>
                  <p className="text-2xl font-bold text-gray-900">{currentAdmissions}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{pendingAdmissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Altas Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">{dischargedToday}</p>
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
                  placeholder="Buscar admisiones por paciente, habitación o doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          </CardContent>
        </Card>

        {/* Admissions List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Admisiones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAdmissions.map((admission) => (
                <div
                  key={admission.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bed className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{admission.patientName}</h3>
                        <Badge className={statusColors[admission.status as keyof typeof statusColors]}>
                          {statusLabels[admission.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Habitación: {admission.roomNumber} - Cama: {admission.bedNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Doctor: {admission.doctorName} | Diagnóstico: {admission.diagnosis}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Admisión</p>
                      <p className="text-sm font-medium text-gray-900">{admission.admissionDate}</p>
                      {admission.dischargeDate && (
                        <>
                          <p className="text-sm text-gray-600">Alta</p>
                          <p className="text-sm font-medium text-gray-900">{admission.dischargeDate}</p>
                        </>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredAdmissions.length === 0 && (
                <div className="text-center py-8">
                  <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron admisiones</h3>
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