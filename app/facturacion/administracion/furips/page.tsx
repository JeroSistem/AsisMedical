'use client';

import { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function FacturacionFuripsPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    numero: '',
    fecha: '',
    aseguradora: '',
    placa: '',
    tipoSiniestro: '',
    conductor: '',
    pacienteDocumento: '',
    descripcion: '',
  });

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Furips guardado', description: 'Registro Furips creado/actualizado.' });
  };

  return (
    <ModulePageLayout title="Facturación - Furips" description="Registro FURIPS" maxWidth="7xl" showBackButton>
      <Card>
        <CardHeader>
          <CardTitle>Nuevo FURIPS</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Número</Label>
              <Input value={formData.numero} onChange={(e) => handleChange('numero', e.target.value)} required />
            </div>
            <div>
              <Label>Fecha</Label>
              <Input type="date" value={formData.fecha} onChange={(e) => handleChange('fecha', e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <Label>Aseguradora</Label>
              <Input value={formData.aseguradora} onChange={(e) => handleChange('aseguradora', e.target.value)} />
            </div>
            <div>
              <Label>Placa</Label>
              <Input value={formData.placa} onChange={(e) => handleChange('placa', e.target.value)} />
            </div>
            <div>
              <Label>Tipo de siniestro</Label>
              <Select value={formData.tipoSiniestro} onValueChange={(v) => handleChange('tipoSiniestro', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="at">Accidente de tránsito</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Conductor</Label>
              <Input value={formData.conductor} onChange={(e) => handleChange('conductor', e.target.value)} />
            </div>
            <div>
              <Label>Documento paciente</Label>
              <Input value={formData.pacienteDocumento} onChange={(e) => handleChange('pacienteDocumento', e.target.value)} />
            </div>
            <div className="md:col-span-3">
              <Label>Descripción</Label>
              <Textarea value={formData.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} rows={3} />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2">
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ModulePageLayout>
  );
}


