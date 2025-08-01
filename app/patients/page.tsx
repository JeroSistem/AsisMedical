"use client";

import { useState } from 'react';
import { AppLayout } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users, UserPlus, Calendar, Phone, Mail } from 'lucide-react';
import { PatientForm } from '@/components/shared/modal-form';
import { useModalForm } from '@/hooks/use-modal-form';

// Datos de ejemplo para pacientes
const mockPatients = [
  {
    id: 1,
    name: "Juan Pérez",
    dni: "12345678",
    email: "juan.perez@email.com",
    phone: "+51 999 123 456",
    birthDate: "1985-03-15",
    gender: "male",
    address: "Av. Arequipa 123, Lima",
    lastVisit: "2024-01-15"
  },
  {
    id: 2,
    name: "María García",
    dni: "87654321",
    email: "maria.garcia@email.com",
    phone: "+51 999 654 321",
    birthDate: "1990-07-22",
    gender: "female",
    address: "Jr. Tacna 456, Lima",
    lastVisit: "2024-01-10"
  },
  {
    id: 3,
    name: "Carlos López",
    dni: "11223344",
    email: "carlos.lopez@email.com",
    phone: "+51 999 111 222",
    birthDate: "1978-11-08",
    gender: "male",
    address: "Av. Brasil 789, Lima",
    lastVisit: "2024-01-08"
  }
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, formData, openModal, closeModal, handleSubmit } = useModalForm();

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.dni.includes(searchTerm) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePatient = async (formData: FormData) => {
    try {
      const data = Object.fromEntries(formData.entries());
      console.log('Nuevo paciente:', data);
      // Aquí puedes hacer la llamada a la API para crear el paciente
      closeModal();
      // Recargar la lista de pacientes
    } catch (error) {
      console.error('Error al crear paciente:', error);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
            <p className="text-gray-600 mt-1">Gestiona la información de los pacientes</p>
          </div>
          <Button onClick={() => openModal()} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Nuevo Paciente
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pacientes</p>
                  <p className="text-2xl font-bold text-gray-900">{mockPatients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Visitas Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Citas Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Nuevos Registros</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
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
                  placeholder="Buscar pacientes por nombre, DNI o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">DNI: {patient.dni}</p>
                      <p className="text-sm text-gray-500">{patient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Última visita</p>
                      <p className="text-sm font-medium text-gray-900">{patient.lastVisit}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredPatients.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pacientes</h3>
                  <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Form */}
      <PatientForm
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleCreatePatient}
        patient={formData}
      />
    </AppLayout>
  );
} 