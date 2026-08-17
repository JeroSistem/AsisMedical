"use client";

import { useCallback, useEffect, useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  Stethoscope,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getPatientAdmissions, searchAdmissionsByQuery } from '@/lib/actions/patient-admissions';

const priorityColors: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const priorityLabels: Record<string, string> = {
  low: 'Normal',
  medium: 'Urgente',
  high: 'Emergencia',
  critical: 'Crítica',
};

const statusColors: Record<string, string> = {
  waiting: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

const statusLabels: Record<string, string> = {
  waiting: 'En cola',
  in_progress: 'En proceso',
  completed: 'Completado',
};

type TriageItem = {
  id: string;
  admissionNumber?: number | null;
  patientId?: string;
  patientName: string;
  documentNumber?: string;
  documentType?: string;
  age?: number | null;
  priority: string;
  symptoms: string;
  vitalSigns: string;
  status: string;
  createdAt: string;
  admissionDate?: string;
  admissionTime?: string;
  observations?: string;
};

export default function TriagePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<TriageItem[]>([]);
  const [canWrite, setCanWrite] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const mapAdmission = (a: any): TriageItem => ({
    id: a.id,
    admissionNumber: a.admissionNumber ?? null,
    patientId: a.patientId,
    patientName: a.patient
      ? `${a.patient.firstName || ''} ${a.patient.lastName || ''}`.trim()
      : 'Paciente',
    documentNumber: a.patient?.documentNumber || '',
    documentType: a.patient?.documentType || '',
    age: a.patient?.age ?? null,
    priority:
      a.priorityAttention === 'critical'
        ? 'critical'
        : a.priorityAttention === 'emergency'
          ? 'high'
          : a.priorityAttention === 'urgent'
            ? 'medium'
            : 'low',
    symptoms: a.observation || '',
    vitalSigns: [
      a.bloodPressure ? `TA ${a.bloodPressure}` : null,
      a.heartRate ? `FC ${a.heartRate}` : null,
      a.temperature ? `T ${a.temperature}` : null,
      a.oxygenSaturation ? `Sat ${a.oxygenSaturation}%` : null,
    ]
      .filter(Boolean)
      .join(' · '),
    status: a.status === 'ACTIVE' ? 'waiting' : 'completed',
    createdAt: a.createdAt ? new Date(a.createdAt).toLocaleString('es-CO') : '',
    admissionDate: a.admissionDate
      ? new Date(a.admissionDate).toLocaleDateString('es-CO')
      : '',
    admissionTime: a.admissionTime || '',
    observations: a.observation || '',
  });

  const loadItems = useCallback(async (q = '') => {
    setLoading(true);
    try {
      if (q) {
        const result = await searchAdmissionsByQuery(q);
        setItems((result.admissions || []).map(mapAdmission));
      } else {
        const admissions = await getPatientAdmissions();
        setItems((admissions || []).map(mapAdmission));
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/navigation/permissions?module=triage');
        const j = await r.json();
        if (j?.success) setCanWrite((j.data || []).includes('write'));
        else setCanWrite(true);
      } catch {
        setCanWrite(true);
      }
    })();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await loadItems(searchTerm.trim());
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'critical' || priority === 'high') {
      return <AlertTriangle className="h-4 w-4" />;
    }
    if (priority === 'medium') return <Clock className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const actions = (
    <>
      <Button onClick={() => router.push('/triage/ingreso-paciente')} variant="outline">
        <UserPlus className="mr-2 h-4 w-4" />
        Ingreso Paciente
      </Button>
      <Button onClick={() => router.push('/triage/valoracion')} variant="outline">
        <Stethoscope className="mr-2 h-4 w-4" />
        Valoración Triage
      </Button>
      {canWrite && (
        <Button onClick={() => router.push('/triage/ingreso-paciente')}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo ingreso
        </Button>
      )}
    </>
  );

  return (
    <ModulePageLayout
      title="Cola de triage y clasificación"
      description="Ingresos de urgencias — búsqueda por documento o nombre"
      actions={actions}
      maxWidth="7xl"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total ingresos</p>
                <p className="text-2xl font-bold text-gray-900">{items.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">En cola</p>
                <p className="text-2xl font-bold text-gray-900">
                  {items.filter((t) => t.status === 'waiting').length}
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
                <p className="text-sm font-medium text-gray-600">Críticos / Emergencia</p>
                <p className="text-2xl font-bold text-gray-900">
                  {items.filter((t) => t.priority === 'critical' || t.priority === 'high').length}
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
                  {items.filter((t) => t.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por documento o nombre del paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={loading} className="sm:w-40">
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSearchTerm('');
            void loadItems('');
          }}
        >
          Ver todos
        </Button>
      </form>

      <div className="space-y-3">
        {!loading && items.length === 0 && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No hay ingresos registrados. Crea uno en <strong>Ingreso Paciente</strong>.
            </CardContent>
          </Card>
        )}

        {items.map((triage) => (
          <Card key={triage.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">{triage.patientName}</h3>
                    <Badge className={priorityColors[triage.priority] || priorityColors.low}>
                      <span className="mr-1 inline-flex">{getPriorityIcon(triage.priority)}</span>
                      {priorityLabels[triage.priority] || triage.priority}
                    </Badge>
                    <Badge className={statusColors[triage.status] || statusColors.waiting}>
                      {statusLabels[triage.status] || triage.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {triage.admissionNumber != null ? `Admisión ${triage.admissionNumber} · ` : ''}
                    {triage.documentType || 'Doc'}: {triage.documentNumber || '—'}
                    {triage.age != null ? ` · ${triage.age} años` : ''}
                    {triage.admissionDate
                      ? ` · Ingreso ${triage.admissionDate} ${triage.admissionTime || ''}`
                      : ` · ${triage.createdAt}`}
                  </p>
                  {triage.symptoms && (
                    <p className="text-sm">
                      <span className="font-medium">Observación:</span> {triage.symptoms}
                    </p>
                  )}
                  {triage.vitalSigns && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Signos:</span> {triage.vitalSigns}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/triage/valoracion?patientId=${encodeURIComponent(triage.patientId || '')}&admissionId=${encodeURIComponent(triage.id)}`
                      )
                    }
                  >
                    Valoración
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/historias/historia-clinica?patientId=${encodeURIComponent(triage.patientId || '')}&admissionId=${encodeURIComponent(triage.id)}`
                      )
                    }
                  >
                    Historia urgencias
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ModulePageLayout>
  );
}
