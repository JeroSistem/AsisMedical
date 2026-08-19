"use client";

import { useEffect, useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getPatientAdmissions, searchAdmissionsByQuery } from '@/lib/actions/patient-admissions';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ListadoIngresoPage() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const load = async (query = '') => {
    setLoading(true);
    try {
      if (query) {
        const result = await searchAdmissionsByQuery(query);
        setItems(result.admissions || []);
      } else {
        setItems(await getPatientAdmissions());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <ModulePageLayout
      title="Listado Ingreso Paciente"
      description="Ingresos de triage — búsqueda por documento o nombre"
      maxWidth="7xl"
      showBackButton
    >
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          void load(q.trim());
        }}
      >
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Documento o nombre..."
        />
        <Button type="submit" disabled={loading}>
          <Search className="mr-2 h-4 w-4" />
          Buscar
        </Button>
      </form>

      <div className="space-y-3">
        {items.map((item) => {
          const name = item.patient
            ? `${item.patient.firstName || ''} ${item.patient.lastName || ''}`.trim()
            : 'Paciente';
          const documentNumber = item.patient?.documentNumber || '';
          const documentType = item.patient?.documentType || 'Doc';
          return (
            <Card key={item.id}>
              <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.admissionNumber != null ? `Admisión ${item.admissionNumber} · ` : ''}
                    {documentType}: {documentNumber} ·{' '}
                    {item.admissionDate
                      ? new Date(item.admissionDate).toLocaleDateString('es-CO')
                      : ''}{' '}
                    {item.admissionTime || ''}
                  </p>
                  {(item.bloodPressure || item.heartRate || item.temperature) && (
                    <p className="text-sm text-muted-foreground">
                      {[
                        item.bloodPressure ? `TA ${item.bloodPressure}` : null,
                        item.heartRate ? `FC ${item.heartRate}` : null,
                        item.temperature ? `T ${item.temperature}` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/triage/valoracion?patientId=${item.patientId}&admissionId=${item.id}`
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
                        `/historias/historia-clinica?patientId=${item.patientId}&admissionId=${item.id}`
                      )
                    }
                  >
                    Historia urgencias
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {!loading && items.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay ingresos para mostrar.</p>
        )}
      </div>
    </ModulePageLayout>
  );
}
