'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, CheckCircle, Search, Filter } from 'lucide-react';

interface AdmittedPatient {
  id: string;
  name: string;
  documentNumber: string;
  age: number;
  gender: string;
  admissionTime: string;
  urgencyLevel: 'ALTA' | 'MEDIA' | 'BAJA' | 'GENERAL';
  status: 'ADMITIDO' | 'EN_ATENCION' | 'ATENDIDO';
  triageCategory?: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
  };
}

export function PatientSelectionNoToast() {
  const [patients, setPatients] = useState<AdmittedPatient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<AdmittedPatient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('TODOS');
  const [isLoading, setIsLoading] = useState(false);

  // Sin datos hasta integración con API
  const mockPatients: AdmittedPatient[] = [];

  useEffect(() => {
    setPatients(mockPatients);
    setFilteredPatients(mockPatients);
  }, []);

  useEffect(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.documentNumber.includes(searchTerm)
      );
    }

    if (urgencyFilter !== 'TODOS') {
      filtered = filtered.filter(patient => patient.urgencyLevel === urgencyFilter);
    }

    setFilteredPatients(filtered);
  }, [searchTerm, urgencyFilter, patients]);

  const handleAttendPatient = async (patientId: string) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPatients(prev => prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, status: 'EN_ATENCION' as const }
          : patient
      ));

      // Redirigir a historia clínica
      window.location.href = `/historias/historia-clinica?patientId=${patientId}`;
    } catch (error) {
      console.error('Error al procesar la atención del paciente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'ALTA': return 'destructive';
      case 'MEDIA': return 'secondary';
      case 'BAJA': return 'outline';
      case 'GENERAL': return 'default';
      default: return 'outline';
    }
  };

  const getUrgencyBorderColor = (level: string) => {
    switch (level) {
      case 'ALTA': return 'border-l-red-500';
      case 'MEDIA': return 'border-l-yellow-500';
      case 'BAJA': return 'border-l-green-500';
      case 'GENERAL': return 'border-l-blue-500';
      default: return 'border-l-gray-500';
    }
  };

  const getUrgencyIconColor = (level: string) => {
    switch (level) {
      case 'ALTA': return 'text-red-600 bg-red-100';
      case 'MEDIA': return 'text-yellow-600 bg-yellow-100';
      case 'BAJA': return 'text-green-600 bg-green-100';
      case 'GENERAL': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros y Búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por urgencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos</SelectItem>
                  <SelectItem value="ALTA">Urgencia Alta</SelectItem>
                  <SelectItem value="MEDIA">Urgencia Media</SelectItem>
                  <SelectItem value="BAJA">Urgencia Baja</SelectItem>
                  <SelectItem value="GENERAL">Consulta General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pacientes */}
      <div className="space-y-3">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className={`border-l-4 ${getUrgencyBorderColor(patient.urgencyLevel)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getUrgencyIconColor(patient.urgencyLevel)}`}>
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{patient.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      CC: {patient.documentNumber} • {patient.age} años • {patient.gender === 'M' ? 'Masculino' : 'Femenino'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Admisión: {patient.admissionTime}
                      {patient.triageCategory && ` • Triage: ${patient.triageCategory}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getUrgencyColor(patient.urgencyLevel)}>
                    {patient.urgencyLevel === 'ALTA' ? 'Urgencia Alta' :
                     patient.urgencyLevel === 'MEDIA' ? 'Urgencia Media' :
                     patient.urgencyLevel === 'BAJA' ? 'Urgencia Baja' :
                     'Consulta General'}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAttendPatient(patient.id)}
                    disabled={isLoading}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Atender
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
