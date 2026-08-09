import { Suspense } from 'react';
import { AppLayout } from '@/components/shared';
import { PatientList } from '@/components/modules/patients';
import { searchPatientsAdvanced, AdvancedSearchFilters } from '@/lib/actions/patients';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function SearchResults({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Convertir los parámetros de búsqueda a filtros
  const filters: AdvancedSearchFilters = {};
  
  if (searchParams.name && typeof searchParams.name === 'string') {
    filters.name = searchParams.name;
  }
  
  if (searchParams.documentNumber && typeof searchParams.documentNumber === 'string') {
    filters.documentNumber = searchParams.documentNumber;
  }
  
  if (searchParams.documentType && typeof searchParams.documentType === 'string') {
    filters.documentType = searchParams.documentType;
  }
  
  if (searchParams.gender && typeof searchParams.gender === 'string') {
    filters.gender = searchParams.gender;
  }
  
  if (searchParams.bloodType && typeof searchParams.bloodType === 'string') {
    filters.bloodType = searchParams.bloodType;
  }
  
  if (searchParams.maritalStatus && typeof searchParams.maritalStatus === 'string') {
    filters.maritalStatus = searchParams.maritalStatus;
  }
  
  if (searchParams.phone && typeof searchParams.phone === 'string') {
    filters.phone = searchParams.phone;
  }
  
  if (searchParams.email && typeof searchParams.email === 'string') {
    filters.email = searchParams.email;
  }
  
  if (searchParams.city && typeof searchParams.city === 'string') {
    filters.city = searchParams.city;
  }
  
  if (searchParams.department && typeof searchParams.department === 'string') {
    filters.department = searchParams.department;
  }
  
  if (searchParams.insuranceProvider && typeof searchParams.insuranceProvider === 'string') {
    filters.insuranceProvider = searchParams.insuranceProvider;
  }
  
  if (searchParams.status && typeof searchParams.status === 'string') {
    filters.status = searchParams.status;
  }
  
  // Rango de edad
  if (searchParams.ageMin || searchParams.ageMax) {
    filters.ageRange = {};
    if (searchParams.ageMin && typeof searchParams.ageMin === 'string') {
      filters.ageRange.min = parseInt(searchParams.ageMin);
    }
    if (searchParams.ageMax && typeof searchParams.ageMax === 'string') {
      filters.ageRange.max = parseInt(searchParams.ageMax);
    }
  }
  
  // Rango de fechas
  if (searchParams.dateFrom || searchParams.dateTo) {
    filters.registrationDateRange = {};
    if (searchParams.dateFrom && typeof searchParams.dateFrom === 'string') {
      filters.registrationDateRange.from = searchParams.dateFrom;
    }
    if (searchParams.dateTo && typeof searchParams.dateTo === 'string') {
      filters.registrationDateRange.to = searchParams.dateTo;
    }
  }
  
  // Filtros booleanos
  if (searchParams.hasAllergies === 'true') {
    filters.hasAllergies = true;
  }
  
  if (searchParams.hasActiveProblems === 'true') {
    filters.hasActiveProblems = true;
  }

  // Realizar la búsqueda
  const patients = await searchPatientsAdvanced(filters);

  return (
    <div className="space-y-6">
      {/* Header con información de búsqueda */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Resultados de Búsqueda
          </h1>
          <p className="text-gray-600 mt-1">
            {patients.length} paciente{patients.length !== 1 ? 's' : ''} encontrado{patients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/patients">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la lista
          </Link>
        </Button>
      </div>

      {/* Mostrar filtros activos */}
      {Object.keys(filters).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Filtros aplicados:</h3>
          <div className="flex flex-wrap gap-2">
            {filters.name && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Nombre: {filters.name}
              </span>
            )}
            {filters.documentNumber && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Documento: {filters.documentNumber}
              </span>
            )}
            {filters.gender && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Género: {filters.gender}
              </span>
            )}
            {filters.ageRange && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Edad: {filters.ageRange.min || 0} - {filters.ageRange.max || '∞'}
              </span>
            )}
            {filters.city && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Ciudad: {filters.city}
              </span>
            )}
            {filters.hasAllergies && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Con alergias
              </span>
            )}
            {filters.hasActiveProblems && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Con problemas activos
              </span>
            )}
          </div>
        </div>
      )}

      {/* Lista de pacientes */}
      <PatientList initialPatients={patients} showAdvancedSearch={false} />
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <SearchResults searchParams={params} />
        </Suspense>
      </div>
    </AppLayout>
  );
}
