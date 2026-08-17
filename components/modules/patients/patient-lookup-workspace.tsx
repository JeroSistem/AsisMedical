'use client';

import { useMemo, useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { PatientFormSimple } from '@/components/modules/patients/patient-form-simple';
import {
  getPatientById,
  searchPatientByQuery,
  type PatientFormData,
  type PatientRecord,
} from '@/lib/actions/patients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

const emptyForm: Partial<PatientFormData> = {
  documentType: '',
  documentNumber: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  age: 0,
  gender: '',
  mobilePhone: '',
  email: '',
  address: '',
  city: '',
  department: '',
  country: 'Colombia',
  dataProcessingConsent: false,
  medicalConsent: false,
  privacyConsent: false,
  communicationConsent: false,
  notificationsConsent: true,
  createAdmission: false,
};

export function PatientLookupWorkspace() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    'Escriba documento o nombre y busque. Si no existe, complete el formulario y guarde.'
  );
  const [statusTone, setStatusTone] = useState<'muted' | 'ok' | 'warn' | 'error'>('muted');
  const [patientId, setPatientId] = useState<string | undefined>(undefined);
  const [formKey, setFormKey] = useState(0);
  const [initialData, setInitialData] = useState<Partial<PatientFormData>>(emptyForm);

  const statusClass = useMemo(() => {
    if (statusTone === 'ok') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
    if (statusTone === 'warn') return 'border-amber-200 bg-amber-50 text-amber-950';
    if (statusTone === 'error') return 'border-red-200 bg-red-50 text-red-800';
    return 'border-slate-200 bg-slate-50 text-slate-600';
  }, [statusTone]);

  const applyPatient = (patient: PatientRecord) => {
    setPatientId(patient.id);
    setInitialData(patient);
    setFormKey((k) => k + 1);
    setStatusTone('ok');
    setStatusMessage('Paciente encontrado. Se cargaron los campos principales del formulario.');
  };

  const applyBlankForCreate = (searchText: string) => {
    const looksLikeDocument = /^[0-9A-Za-z.-]{4,}$/.test(searchText) && !/\s/.test(searchText);
    setPatientId(undefined);
    setInitialData({
      ...emptyForm,
      documentNumber: looksLikeDocument ? searchText : '',
      firstName: !looksLikeDocument ? searchText : '',
    });
    setFormKey((k) => k + 1);
    setStatusTone('warn');
    setStatusMessage(
      'El paciente no está creado. Complete los campos y guarde para registrarlo.'
    );
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = query.trim();
    if (!text) {
      setStatusTone('error');
      setStatusMessage('Escriba un número de documento o un nombre para buscar.');
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchPatientByQuery(text);
      if (result.error) {
        setStatusTone('error');
        setStatusMessage(result.error);
        return;
      }

      if (result.found && result.patient) {
        applyPatient(result.patient);
        return;
      }

      applyBlankForCreate(text);
    } catch {
      setStatusTone('error');
      setStatusMessage('No se pudo consultar. Intente de nuevo.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <ModulePageLayout
      title="Listado de pacientes"
      description="Busque por documento o nombre; si existe se cargan los datos, si no complete y guarde"
      maxWidth="7xl"
    >
      <ModuleCard className="p-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1 space-y-1">
            <Label htmlFor="patient-search">Buscar paciente</Label>
            <Input
              id="patient-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Número de documento o nombre..."
              autoFocus
            />
          </div>
          <Button type="submit" disabled={isSearching} className="sm:w-40">
            {isSearching ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </>
            )}
          </Button>
        </form>
      </ModuleCard>

      <div className={`rounded-lg border px-4 py-3 text-sm ${statusClass}`}>{statusMessage}</div>

      <PatientFormSimple
        key={formKey}
        initialData={initialData}
        isEditing={Boolean(patientId)}
        patientId={patientId}
        onSaved={async (savedId) => {
          const saved = await getPatientById(savedId);
          if (saved) {
            applyPatient(saved as PatientRecord);
            setQuery(saved.documentNumber || `${saved.firstName} ${saved.lastName}`);
            setStatusTone('ok');
            setStatusMessage(
              'Paciente guardado en la base de datos. Ya puedes usarlo en triage y el resto del desarrollo.'
            );
          }
        }}
      />
    </ModulePageLayout>
  );
}
