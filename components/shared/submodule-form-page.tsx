'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Save, RotateCcw, FileText, Trash2, Pencil, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getNavigationRoute } from '@/lib/navigation-routes';
import {
  buildSubmoduleFormConfig,
  type SubmoduleFormField,
} from '@/lib/submodule-form-config';
import {
  deleteModuleFormRecord,
  listModuleFormRecords,
  saveModuleFormRecord,
  type ModuleFormRecordDTO,
} from '@/lib/actions/module-form-records';
import { NoDataMessage } from '@/components/shared/no-data-message';

type FormValues = Record<string, string | boolean>;

function buildInitialValues(fields: SubmoduleFormField[]): FormValues {
  return fields.reduce<FormValues>((acc, field) => {
    if (field.type === 'switch') {
      acc[field.name] = field.defaultValue === true;
    } else {
      acc[field.name] = typeof field.defaultValue === 'string' ? field.defaultValue : '';
    }
    return acc;
  }, {});
}

function payloadToFormValues(
  fields: SubmoduleFormField[],
  payload: Record<string, unknown>
): FormValues {
  const base = buildInitialValues(fields);
  for (const field of fields) {
    const raw = payload[field.name];
    if (raw === undefined || raw === null) continue;
    if (field.type === 'switch') {
      base[field.name] = Boolean(raw);
    } else {
      base[field.name] = String(raw);
    }
  }
  return base;
}

function formatDate(iso: string, mounted: boolean) {
  if (!mounted) {
    return iso.slice(0, 16).replace('T', ' ');
  }
  try {
    return new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type SubmoduleFormPageProps = {
  href: string;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  embedded?: boolean;
};

export function SubmoduleFormPage({
  href,
  title,
  description,
  showBackButton = false,
  embedded = false,
}: SubmoduleFormPageProps) {
  const { toast } = useToast();
  const navRoute = getNavigationRoute(href);

  const config = useMemo(
    () =>
      buildSubmoduleFormConfig(
        href,
        title ?? navRoute?.title ?? 'Formulario',
        description ?? navRoute?.description
      ),
    [href, title, description, navRoute?.title, navRoute?.description]
  );

  const [values, setValues] = useState<FormValues>(() =>
    buildInitialValues(config.fields)
  );
  const [records, setRecords] = useState<ModuleFormRecordDTO[]>([]);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const loadRecords = useCallback(async () => {
    setIsLoadingRecords(true);
    const result = await listModuleFormRecords(href, 20);
    if (result.success && result.data) {
      setRecords(result.data);
    } else if (result.error) {
      toast({
        title: 'No se pudieron cargar registros',
        description: result.error,
        variant: 'destructive',
      });
    }
    setIsLoadingRecords(false);
  }, [href, toast]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  const setFieldValue = (name: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setValues(buildInitialValues(config.fields));
    setEditingRecordId(null);
    toast({
      title: 'Formulario limpiado',
      description: 'Los campos fueron restablecidos.',
    });
  };

  const handleEdit = (record: ModuleFormRecordDTO) => {
    setEditingRecordId(record.id);
    setValues(payloadToFormValues(config.fields, record.payload));
  };

  const handleDelete = async (recordId: string) => {
    setIsLoading(true);
    const result = await deleteModuleFormRecord(recordId, href);
    if (result.success) {
      toast({ title: 'Registro eliminado' });
      if (editingRecordId === recordId) {
        handleReset();
      }
      await loadRecords();
    } else {
      toast({
        title: 'Error al eliminar',
        description: result.error,
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const missing = config.fields.filter(
      (field) =>
        field.required &&
        field.type !== 'switch' &&
        !String(values[field.name] ?? '').trim()
    );

    if (missing.length > 0) {
      toast({
        title: 'Campos requeridos',
        description: `Complete: ${missing.map((field) => field.label).join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await saveModuleFormRecord({
        modulePath: href,
        mode: config.mode,
        values,
        recordId: editingRecordId ?? undefined,
      });

      if (!result.success) {
        toast({
          title: 'Error al guardar',
          description: result.error ?? 'Intente nuevamente',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: editingRecordId ? 'Registro actualizado' : 'Registro guardado',
        description: `${config.title} — datos guardados en MySQL.`,
      });

      setEditingRecordId(null);
      setValues(buildInitialValues(config.fields));
      await loadRecords();
    } finally {
      setIsLoading(false);
    }
  };

  const formBody = (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {editingRecordId ? (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-900">
            Editando registro existente. Guarde para actualizar o limpie para crear uno nuevo.
          </div>
        ) : null}

        <ModuleCard title="Datos del formulario" description={config.description}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {config.fields.map((field) => (
              <div
                key={field.name}
                className={cn('space-y-2', field.span === 2 && 'md:col-span-2')}
              >
                {field.type === 'switch' ? (
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Switch
                      id={field.name}
                      checked={Boolean(values[field.name])}
                      onCheckedChange={(checked) => setFieldValue(field.name, checked)}
                    />
                  </div>
                ) : (
                  <>
                    <Label htmlFor={field.name}>
                      {field.label}
                      {field.required ? ' *' : ''}
                    </Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        id={field.name}
                        value={String(values[field.name] ?? '')}
                        onChange={(event) => setFieldValue(field.name, event.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                      />
                    ) : field.type === 'select' ? (
                      <Select
                        value={String(values[field.name] ?? '')}
                        onValueChange={(value) => setFieldValue(field.name, value)}
                      >
                        <SelectTrigger id={field.name}>
                          <SelectValue placeholder={field.placeholder ?? 'Seleccionar'} />
                        </SelectTrigger>
                        <SelectContent>
                          {(field.options ?? []).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={field.name}
                        type={
                          field.type === 'number'
                            ? 'number'
                            : field.type === 'date'
                              ? 'date'
                              : field.type === 'email'
                                ? 'email'
                                : 'text'
                        }
                        value={String(values[field.name] ?? '')}
                        onChange={(event) => setFieldValue(field.name, event.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </ModuleCard>

        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {config.resetLabel}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : config.mode === 'report' ? (
              <FileText className="mr-2 h-4 w-4" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isLoading
              ? 'Guardando...'
              : editingRecordId
                ? 'Actualizar registro'
                : config.submitLabel}
          </Button>
        </div>
      </form>

      <ModuleCard
        title="Registros guardados"
        description="Datos persistidos en la base de datos de la institución"
      >
        {isLoadingRecords ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Cargando registros...
          </div>
        ) : records.length === 0 ? (
          <NoDataMessage title="Sin registros guardados" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.codigo ?? '—'}</TableCell>
                    <TableCell className="max-w-[220px] truncate">
                      {record.nombre ?? '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.estado ?? 'activo'}</Badge>
                    </TableCell>
                    <TableCell>{record.createdByName ?? '—'}</TableCell>
                    <TableCell>{formatDate(record.createdAt, hasMounted)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(record)}
                          disabled={isLoading}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => void handleDelete(record.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </ModuleCard>
    </div>
  );

  if (embedded) {
    return formBody;
  }

  return (
    <ModulePageLayout
      title={config.title}
      description={config.description}
      showBackButton={showBackButton}
      maxWidth="7xl"
    >
      {formBody}
    </ModulePageLayout>
  );
}
