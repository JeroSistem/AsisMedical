
'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserPlus, Search, Eye, Filter } from 'lucide-react';
import { getPatientById, searchPatientsAdvanced, AdvancedSearchFilters } from '@/lib/actions/patients';

const PatientViewModal = dynamic(
  () => import('./patient-view-modal').then((m) => m.PatientViewModal),
  { ssr: false }
);

const AdvancedSearchModal = dynamic(
  () => import('./advanced-search-modal').then((m) => m.AdvancedSearchModal),
  { ssr: false }
);

interface Patient {
  id: string;
  name: string;
  documentNumber: string;
  documentType: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  contact: string;
  status: string;
  creationDate: string;
}

interface PatientListProps {
  users?: Patient[];
  initialPatients?: Patient[];
  showAdvancedSearch?: boolean;
}

export function PatientList({ users = [], initialPatients, showAdvancedSearch = true }: PatientListProps) {
  const [search, setSearch] = React.useState('');
  const [selectedPatient, setSelectedPatient] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = React.useState(false);
  const [isAdvancedSearchLoading, setIsAdvancedSearchLoading] = React.useState(false);
  const [filteredPatients, setFilteredPatients] = React.useState<Patient[]>(initialPatients || users);
  const router = useRouter();

  // Búsqueda básica
  const basicFilteredPatients = filteredPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.documentNumber.includes(search) ||
      patient.contact.toLowerCase().includes(search.toLowerCase())
  );

  const handleRowClick = (patientId: string) => {
    router.push(`/patients/${patientId}`);
  };

  const handleViewPatient = async (patientId: string) => {
    setIsLoading(true);
    try {
      const patient = await getPatientById(patientId);
      if (patient) {
        setSelectedPatient(patient);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const handleAdvancedSearch = async (filters: AdvancedSearchFilters) => {
    setIsAdvancedSearchLoading(true);
    try {
      const results = await searchPatientsAdvanced(filters);
      setFilteredPatients(results);
    } catch (error) {
      console.error('Error in advanced search:', error);
    } finally {
      setIsAdvancedSearchLoading(false);
    }
  };

  const resetSearch = () => {
    setFilteredPatients(initialPatients || users);
    setSearch('');
  };

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y botones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex flex-1 gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, documento o contacto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {showAdvancedSearch && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsAdvancedSearchOpen(true)}
              className="flex-shrink-0"
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {(filteredPatients.length !== (initialPatients || users).length || search) && (
            <Button variant="outline" onClick={resetSearch}>
              Limpiar Filtros
            </Button>
          )}
          <Button asChild>
            <Link href="/patients/nuevo">
              <UserPlus className="mr-2 h-4 w-4" /> Nuevo Paciente
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabla de pacientes */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700 px-6 py-4">Nombre Completo</TableHead>
                <TableHead className="font-semibold text-gray-700 px-6 py-4">Documento</TableHead>
                <TableHead className="font-semibold text-gray-700 px-6 py-4">Edad</TableHead>
                <TableHead className="font-semibold text-gray-700 px-6 py-4">Género</TableHead>
                <TableHead className="font-semibold text-gray-700 px-6 py-4">Contacto</TableHead>
                <TableHead className="font-semibold text-gray-700 px-6 py-4">Estado</TableHead>
                <TableHead className="font-semibold text-gray-700 px-6 py-4 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {basicFilteredPatients.map((patient, index) => (
                <TableRow
                  key={patient.id}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <TableCell className="font-medium px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">Registrado: {patient.creationDate}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{patient.documentNumber}</div>
                      <div className="text-sm text-gray-500">{patient.documentType}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className="text-xs">
                      {patient.age} años
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className="text-xs">
                      {patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Femenino' : patient.gender}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-600">{patient.contact}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'}>
                      {patient.status === 'Active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewPatient(patient.id);
                      }}
                      disabled={isLoading}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      {isLoading ? 'Cargando...' : 'Ver'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mensaje cuando no hay resultados */}
      {basicFilteredPatients.length === 0 && (
        <div className="text-center p-12 bg-white rounded-lg border shadow-sm">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pacientes</h3>
          <p className="text-gray-600">
            {search ? 'Intenta con otros términos de búsqueda' : 'No hay pacientes registrados en el sistema'}
          </p>
        </div>
      )}

      {/* Información de resultados */}
      {basicFilteredPatients.length > 0 && (
        <div className="text-sm text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
          Mostrando {basicFilteredPatients.length} de {filteredPatients.length} pacientes
          {filteredPatients.length !== users.length && ` (filtrados de ${users.length} total)`}
        </div>
      )}

      {/* Modal de vista de paciente */}
      <PatientViewModal
        patient={selectedPatient}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Modal de búsqueda avanzada */}
      <AdvancedSearchModal
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onSearch={handleAdvancedSearch}
        isLoading={isAdvancedSearchLoading}
      />
    </div>
  );
}
