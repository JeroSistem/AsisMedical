'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, RefreshCw, Search, X } from 'lucide-react';
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
import { getPatients } from '@/lib/actions/patients';
import { useToast } from '@/hooks/use-toast';
import { genderLabelEs } from '@/lib/gender';

type PatientRow = {
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
};

function genderLabel(gender: string) {
  return genderLabelEs(gender);
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export default function FacturacionPacientesListaPage() {
  const { toast } = useToast();
  const [rows, setRows] = useState<PatientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await getPatients();
      setRows(data as PatientRow[]);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'No se pudo cargar la lista de pacientes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return rows;
    return rows.filter((p) => {
      const haystack = normalize(
        [
          p.documentType,
          p.documentNumber,
          p.name,
          p.contact,
          p.status,
          String(p.age ?? ''),
        ].join(' ')
      );
      return haystack.includes(q);
    });
  }, [rows, query]);

  return (
    <ModulePageLayout
      title="Lista de pacientes"
      description="Pacientes registrados en la institución"
      maxWidth="7xl"
      showBackButton
      actions={
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button asChild>
            <Link href="/facturacion/administracion/pacientes">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo
            </Link>
          </Button>
        </div>
      }
    >
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle>
            {loading
              ? 'Cargando…'
              : query.trim()
                ? `${filtered.length} de ${rows.length} paciente${rows.length === 1 ? '' : 's'}`
                : `${rows.length} paciente${rows.length === 1 ? '' : 's'}`}
          </CardTitle>
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por documento, nombre o contacto…"
              className="pl-9 pr-9"
              aria-label="Buscar pacientes"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Cargando pacientes…</p>
          ) : rows.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-sm text-muted-foreground">Aún no hay pacientes registrados.</p>
              <Button asChild>
                <Link href="/facturacion/administracion/pacientes">Registrar paciente</Link>
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                No se encontraron pacientes para “{query.trim()}”.
              </p>
              <Button type="button" variant="outline" onClick={() => setQuery('')}>
                Limpiar búsqueda
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead>Sexo</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Creado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="whitespace-nowrap">
                        {p.documentType ? `${p.documentType} ` : ''}
                        {p.documentNumber}
                      </TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.age ?? '—'}</TableCell>
                      <TableCell>{genderLabel(p.gender)}</TableCell>
                      <TableCell>{p.contact || '—'}</TableCell>
                      <TableCell>{p.status || '—'}</TableCell>
                      <TableCell>{p.creationDate || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </ModulePageLayout>
  );
}
