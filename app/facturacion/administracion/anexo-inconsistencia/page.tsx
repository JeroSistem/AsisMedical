'use client';

import { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function FacturacionAnexoInconsistenciaPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Encabezado
    paciente: '',
    numeroAnexo: '',
    fechaReporte: '',
    horaReporte: '',

    // Variable que presenta la inconsistencia
    docNumero: '',
    tipoDocumento: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',

    // Informado por
    informadoPor: '',
    cargo: '',
    telefono: '',
    celular: '',

    // Detalle
    descripcion: '',
  });
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/facturacion/anexo-inconsistencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(async (r) => {
        const j = await r.json();
        if (!j.success) throw new Error(j.error || 'Error');
        toast({ title: 'Guardado', description: 'Inconsistencia registrada.' });
        loadData();
      })
      .catch((e) => toast({ title: 'Error', description: String(e), variant: 'destructive' }));
  };

  const loadData = () => {
    setLoading(true);
    const url = `/api/facturacion/anexo-inconsistencia?q=${encodeURIComponent(q)}&page=1&pageSize=10`;
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setRows(j.data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ModulePageLayout title="Anexo técnico Inconsistencia" description="Registro de inconsistencias de datos para gestión" maxWidth="7xl" showBackButton>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Paciente / Encabezado */}
        <Card>
          <CardHeader>
            <CardTitle>Paciente / Encabezado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-3">
                <Label>Paciente</Label>
                <Input value={formData.paciente} onChange={(e) => handleChange('paciente', e.target.value)} placeholder="Buscar/ingresar paciente" />
              </div>
              <div>
                <Label>Ingreso #</Label>
                <Input value={formData.numeroAnexo} onChange={(e) => handleChange('numeroAnexo', e.target.value)} />
              </div>
              <div>
                <Label>Fecha</Label>
                <Input type="date" value={formData.fechaReporte} onChange={(e) => handleChange('fechaReporte', e.target.value)} required />
              </div>
              <div>
                <Label>Hora</Label>
                <Input type="time" value={formData.horaReporte} onChange={(e) => handleChange('horaReporte', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variable que presenta la inconsistencia */}
        <Card>
          <CardHeader>
            <CardTitle>Variable que presenta la inconsistencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label>Número de documento</Label>
                <Input value={formData.docNumero} onChange={(e) => handleChange('docNumero', e.target.value)} />
              </div>
              <div>
                <Label>Tipo de documento</Label>
                <Select value={formData.tipoDocumento} onValueChange={(v) => handleChange('tipoDocumento', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CC">Cédula</SelectItem>
                    <SelectItem value="TI">Tarjeta Identidad</SelectItem>
                    <SelectItem value="CE">Cédula Extranjería</SelectItem>
                    <SelectItem value="RC">Registro Civil</SelectItem>
                    <SelectItem value="PA">Pasaporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Primer nombre</Label>
                <Input value={formData.primerNombre} onChange={(e) => handleChange('primerNombre', e.target.value)} />
              </div>
              <div>
                <Label>Segundo nombre</Label>
                <Input value={formData.segundoNombre} onChange={(e) => handleChange('segundoNombre', e.target.value)} />
              </div>
              <div>
                <Label>Primer apellido</Label>
                <Input value={formData.primerApellido} onChange={(e) => handleChange('primerApellido', e.target.value)} />
              </div>
              <div>
                <Label>Segundo apellido</Label>
                <Input value={formData.segundoApellido} onChange={(e) => handleChange('segundoApellido', e.target.value)} />
              </div>
              <div>
                <Label>Nacimiento</Label>
                <Input type="date" value={formData.fechaNacimiento} onChange={(e) => handleChange('fechaNacimiento', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informado por */}
        <Card>
          <CardHeader>
            <CardTitle>Informado por</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <Label>Nombres</Label>
                <Input value={formData.informadoPor} onChange={(e) => handleChange('informadoPor', e.target.value)} />
              </div>
              <div>
                <Label>Cargo</Label>
                <Input value={formData.cargo} onChange={(e) => handleChange('cargo', e.target.value)} />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input value={formData.telefono} onChange={(e) => handleChange('telefono', e.target.value)} />
              </div>
              <div>
                <Label>Celular</Label>
                <Input value={formData.celular} onChange={(e) => handleChange('celular', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Observaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={formData.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} rows={4} />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Guardar</Button>
        </div>
      </form>

      {/* Tabla de inconsistencias */}
      <Card>
        <CardHeader>
          <CardTitle>Inconsistencias registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex items-center gap-2">
            <Input placeholder="Buscar por número, paciente, documento..." value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="button" onClick={loadData} disabled={loading}>Buscar</Button>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Número</th>
                  <th className="p-2">Paciente</th>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Hora</th>
                  <th className="p-2">Doc</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td className="p-2 text-muted-foreground" colSpan={5}>No hay registros</td>
                  </tr>
                )}
                {rows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{r.numeroAnexo || '-'}</td>
                    <td className="p-2">{r.paciente}</td>
                    <td className="p-2">{new Date(r.fechaReporte).toLocaleDateString()}</td>
                    <td className="p-2">{r.horaReporte || '-'}</td>
                    <td className="p-2">{r.docNumero || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </ModulePageLayout>
  );
}


