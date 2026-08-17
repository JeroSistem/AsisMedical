'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ListPlus, RefreshCw, Search, X } from 'lucide-react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getAllMedicalRecords,
  searchMedicalRecordsByAdmissionOrDocument,
} from '@/lib/actions/medical-records';
import { genderLabelEs } from '@/lib/gender';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

type HistoryRow = {
  id: string;
  clinicalHistoryNumber: string;
  admissionNumber: string;
  patientName: string;
  patientIdentification: string;
  patientGender: string;
  patientAge: number;
  diagnosis: string;
  professionalName: string;
  consultationReason: string;
  createdAt: string | null;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    documentNumber: string;
  } | null;
};

function formatDate(value?: string | null) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('es-CO');
}

export default function ListadoHistoriasPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isSearchResult, setIsSearchResult] = useState(false);

  const load = async () => {
    setLoading(true);
    setIsSearchResult(false);
    setAppliedQuery('');
    try {
      const data = await getAllMedicalRecords();
      setRows((data || []) as HistoryRow[]);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'No se pudo cargar el listado de historias',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = query.trim();
    if (!text) {
      toast({
        title: 'Búsqueda',
        description: 'Escriba el número de admisión o el número de documento.',
      });
      return;
    }

    setSearching(true);
    setAppliedQuery(text);
    try {
      const res = await searchMedicalRecordsByAdmissionOrDocument(text);
      if (!res.success) {
        toast({
          title: 'Error',
          description: res.error || 'No se pudo buscar',
          variant: 'destructive',
        });
        return;
      }
      setRows((res.data || []) as HistoryRow[]);
      setIsSearchResult(true);
      if (!res.data?.length) {
        toast({
          title: 'Sin resultados',
          description: `No hay historias con admisión o documento “${text}”.`,
        });
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Error al buscar historias',
        variant: 'destructive',
      });
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setAppliedQuery('');
    void load();
  };

  return (
    <ModulePageLayout
      title="Listado de historias"
      description="Historias clínicas registradas en la institución"
      maxWidth="7xl"
      showBackButton
      actions={
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button asChild>
            <Link href="/historias/historia-clinica">
              <ListPlus className="mr-2 h-4 w-4" />
              Nueva historia
            </Link>
          </Button>
        </div>
      }
    >
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle>
            {loading || searching
              ? 'Cargando…'
              : isSearchResult
                ? `${rows.length} resultado${rows.length === 1 ? '' : 's'} para “${appliedQuery}”`
                : `${rows.length} historia${rows.length === 1 ? '' : 's'}`}
          </CardTitle>
          <form
            onSubmit={(e) => void handleSearch(e)}
            className="flex flex-col gap-2 max-w-3xl"
          >
            <Label htmlFor="hc-search">
              Buscar por número de admisión o número de documento
            </Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="hc-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ej. 1  ·  o documento del paciente"
                  className="pl-9 pr-9"
                  aria-label="Número de admisión o documento"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
              <Button type="submit" disabled={loading || searching}>
                <Search className="mr-2 h-4 w-4" />
                {searching ? 'Buscando…' : 'Buscar'}
              </Button>
            </div>
          </form>
        </CardHeader>
        <CardContent>
          {loading || searching ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {searching ? 'Buscando…' : 'Cargando historias clínicas…'}
            </p>
          ) : rows.length === 0 ? (
            <div className="space-y-3 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                {isSearchResult
                  ? `No se encontraron historias con admisión o documento “${appliedQuery}”.`
                  : 'Aún no hay historias clínicas registradas.'}
              </p>
              {isSearchResult ? (
                <Button type="button" variant="outline" onClick={clearSearch}>
                  Ver todas
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/historias/historia-clinica">Crear historia clínica</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>HC</TableHead>
                    <TableHead>Admisión</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Género</TableHead>
                    <TableHead>Diagnóstico</TableHead>
                    <TableHead>Profesional</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => {
                    const name =
                      r.patientName ||
                      `${r.patient?.firstName || ''} ${r.patient?.lastName || ''}`.trim() ||
                      '—';
                    const doc =
                      r.patientIdentification || r.patient?.documentNumber || '—';
                    const openHref = `/historias/historia-clinica?id=${encodeURIComponent(r.id)}`;
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono font-medium">
                          {r.clinicalHistoryNumber ? (
                            <Link
                              href={openHref}
                              className="text-primary underline-offset-4 hover:underline"
                              title="Abrir historia clínica"
                            >
                              {r.clinicalHistoryNumber}
                            </Link>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell className="font-mono">
                          {r.admissionNumber ? (
                            <Link
                              href={openHref}
                              className="text-primary underline-offset-4 hover:underline"
                              title="Abrir historia clínica"
                            >
                              {r.admissionNumber}
                            </Link>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>{name}</TableCell>
                        <TableCell>{doc}</TableCell>
                        <TableCell>{genderLabelEs(r.patientGender)}</TableCell>
                        <TableCell className="max-w-[220px] truncate" title={r.diagnosis}>
                          {r.diagnosis || '—'}
                        </TableCell>
                        <TableCell>{r.professionalName || '—'}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(r.createdAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </ModulePageLayout>
  );
}
