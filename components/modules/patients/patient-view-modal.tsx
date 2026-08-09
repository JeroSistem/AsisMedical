'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  Heart,
  Shield,
  Users,
  Building,
  X
} from 'lucide-react';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  secondLastName?: string;
  documentNumber: string;
  documentType: string;
  dateOfBirth: Date;
  age: number;
  gender: string;
  maritalStatus?: string;
  bloodType?: string;
  occupation?: string;
  allergies?: string;
  activeProblems?: string;
  mobilePhone?: string;
  landlinePhone?: string;
  email?: string;
  address?: string;
  city?: string;
  department?: string;
  country?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  legalRepresentativeName?: string;
  legalRepresentativeDocument?: string;
  legalRepresentativePhone?: string;
  legalRepresentativeRelationship?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  status: string;
  createdAt: Date;
}

interface PatientViewModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PatientViewModal({ patient, isOpen, onClose }: PatientViewModalProps) {
  const router = useRouter();
  
  if (!patient) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'M': return 'Masculino';
      case 'F': return 'Femenino';
      default: return gender;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE' ? (
      <Badge variant="default" className="bg-green-100 text-green-800">Activo</Badge>
    ) : (
      <Badge variant="secondary">Inactivo</Badge>
    );
  };

  const handleEditPatient = () => {
    onClose();
    router.push(`/patients/editar/${patient.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              Información del Paciente
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                  <p className="text-lg font-semibold">
                    {patient.firstName} {patient.lastName} {patient.secondLastName || ''}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Documento</label>
                  <p className="text-lg">
                    {patient.documentNumber} {patient.documentType}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
                  <p className="text-lg flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(patient.dateOfBirth)} ({patient.age} años)
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Género</label>
                  <p className="text-lg">{getGenderText(patient.gender)}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Estado Civil</label>
                  <p className="text-lg">{patient.maritalStatus || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de Sangre</label>
                  <p className="text-lg">{patient.bloodType || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ocupación</label>
                  <p className="text-lg">{patient.occupation || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Estado</label>
                  <div className="mt-1">{getStatusBadge(patient.status)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono Móvil</label>
                  <p className="text-lg flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {patient.mobilePhone || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono Fijo</label>
                  <p className="text-lg flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {patient.landlinePhone || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Correo Electrónico</label>
                  <p className="text-lg flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {patient.email || 'No especificado'}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Dirección</label>
                  <p className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {patient.address || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ciudad</label>
                  <p className="text-lg">{patient.city || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Departamento</label>
                  <p className="text-lg">{patient.department || 'No especificado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Médica */}
          {(patient.allergies || patient.activeProblems) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Información Médica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {patient.allergies && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Alergias</label>
                    <p className="text-lg">{patient.allergies}</p>
                  </div>
                )}
                {patient.activeProblems && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Problemas Activos</label>
                    <p className="text-lg">{patient.activeProblems}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Contacto de Emergencia */}
          {patient.emergencyContactName && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contacto de Emergencia
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-lg">{patient.emergencyContactName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono</label>
                  <p className="text-lg">{patient.emergencyContactPhone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Relación</label>
                  <p className="text-lg">{patient.emergencyContactRelationship}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Representante Legal */}
          {patient.legalRepresentativeName && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Representante Legal
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-lg">{patient.legalRepresentativeName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Documento</label>
                  <p className="text-lg">{patient.legalRepresentativeDocument}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono</label>
                  <p className="text-lg">{patient.legalRepresentativePhone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Relación</label>
                  <p className="text-lg">{patient.legalRepresentativeRelationship}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información de Seguro */}
          {patient.insuranceProvider && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Información de Seguro
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Aseguradora</label>
                  <p className="text-lg">{patient.insuranceProvider}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Número de Póliza</label>
                  <p className="text-lg">{patient.insuranceNumber}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información del Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID del Paciente</label>
                <p className="text-lg font-mono">{patient.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Registro</label>
                <p className="text-lg">{formatDate(patient.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={handleEditPatient}>
            Editar Paciente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
