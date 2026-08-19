"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Bed, User, CheckCircle, Clock } from 'lucide-react';
import { getPatientAdmissions } from '@/lib/actions/patient-admissions';

type AdmissionRow = {
  id: string;
  admissionNumber: number;
  patientName: string;
  documentNumber: string;
  admissionDate: string;
  admissionTime: string | null;
  status: string;
  priorityAttention: string | null;
  observation: string | null;
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-blue-100 text-blue-800',
  admitted: 'bg-blue-100 text-blue-800',
  DISCHARGED: 'bg-green-100 text-green-800',
  discharged: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

const statusLabels: Record<string, string> = {
  ACTIVE: 'Activa',
  admitted: 'Admitido',
  DISCHARGED: 'Dado de Alta',
  discharged: 'Dado de Alta',
  PENDING: 'Pendiente',
  pending: 'Pendiente',
};

function formatDate(value: Date | string | null | undefined) {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toISOString().slice(0, 10);
}

function patientFullName(patient: any) {
  if (!patient) return 'Paciente';
  return `${patient.firstName || ''} ${patient.lastName || ''} ${patient.secondLastName || ''}`.trim();
}

export default function AdmisionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [admissions, setAdmissions] = useState<AdmissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const rows = await getPatientAdmissions();
        if (cancelled) return;
        setAdmissions(
          (rows || []).map((a: any) => ({
            id: a.id,
            admissionNumber: a.admissionNumber,
            patientName: patientFullName(a.patient),
            documentNumber: a.patient?.documentNumber || '—',
            admissionDate: formatDate(a.admissionDate),
            admissionTime: a.admissionTime || null,
            status: a.status || 'ACTIVE',
            priorityAttention: a.priorityAttention || null,
            observation: a.observation || null,
          }))
        );
      } catch {
        if (!cancelled) setAdmissions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredAdmissions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return admissions;
    return admissions.filter(
      (admission) =>
        admission.patientName.toLowerCase().includes(q) ||
        admission.documentNumber.toLowerCase().includes(q) ||
        String(admission.admissionNumber).includes(q) ||
        (admission.observation || '').toLowerCase().includes(q)
    );
  }, [admissions, searchTerm]);

  const totalAdmissions = admissions.length;
  const currentAdmissions = admissions.filter((a) =>
    ['ACTIVE', 'admitted'].includes(a.status)
  ).length;
  const pendingAdmissions = admissions.filter((a) =>
    ['PENDING', 'pending'].includes(a.status)
  ).length;
  const today = new Date().toISOString().slice(0, 10);
  const admittedToday = admissions.filter((a) => a.admissionDate === today).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admisión</h1>
            <p className="text-gray-600 mt-1">Gestión de admisiones</p>
          </div>
          <div className="flex space-x-2">
            <Button asChild className="flex items-center gap-2">
              <Link href="/admision/nueva">
                <Plus className="h-4 w-4" />
                Nueva Admisión
              </Link>
            </Button>
          </div>
        </div>

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
                  <p className="text-sm font-medium text-gray-600">Ingresos Hoy</p>
                  <p className="text-2xl font-bold text-gray-900">{admittedToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por paciente, documento o número de admisión..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Admisiones</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-gray-600">Cargando admisiones…</div>
            ) : (
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
                          <h3 className="font-semibold text-gray-900">
                            #{admission.admissionNumber} · {admission.patientName}
                          </h3>
                          <Badge
                            className={
                              statusColors[admission.status] || 'bg-gray-100 text-gray-800'
                            }
                          >
                            {statusLabels[admission.status] || admission.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Documento: {admission.documentNumber}
                        </p>
                        {admission.observation && (
                          <p className="text-sm text-gray-500">{admission.observation}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Admisión</p>
                        <p className="text-sm font-medium text-gray-900">
                          {admission.admissionDate}
                          {admission.admissionTime ? ` · ${admission.admissionTime}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredAdmissions.length === 0 && (
                  <div className="text-center py-8 space-y-4">
                    <Bed className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No hay admisiones
                      </h3>
                      <p className="text-gray-600">
                        {searchTerm.trim()
                          ? 'No hay coincidencias con la búsqueda.'
                          : 'Esta institución aún no tiene ingresos registrados'}
                      </p>
                    </div>
                    {!searchTerm.trim() && (
                      <Button asChild>
                        <Link href="/admision/nueva">
                          <Plus className="h-4 w-4 mr-2" />
                          Nueva Admisión
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
