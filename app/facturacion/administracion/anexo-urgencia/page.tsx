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

export default function FacturacionAnexoUrgenciaPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    numeroAnexo: '',
    fecha: '',
    pacienteDocumento: '',
    pacienteNombre: '',
    entidad: '',
    triage: '',
    destinoPaciente: '',
    dxIngreso: '',
    dxSalida: '',
    descripcionAtencion: '',
  });

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Anexo urgencia guardado', description: 'Se registró el informe de atención de urgencias.' });
  };

  return (
    <ModulePageLayout title="Anexo técnico Informe urgencia" description="Informe de atención por urgencias" maxWidth="7xl" showBackButton>
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Anexo de Urgencia</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Número anexo</Label>
              <Input value={formData.numeroAnexo} onChange={(e) => handleChange('numeroAnexo', e.target.value)} required />
            </div>
            <div>
              <Label>Fecha</Label>
              <Input type="date" value={formData.fecha} onChange={(e) => handleChange('fecha', e.target.value)} required />
            </div>
            <div>
              <Label>Documento paciente</Label>
              <Input value={formData.pacienteDocumento} onChange={(e) => handleChange('pacienteDocumento', e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <Label>Nombre paciente</Label>
              <Input value={formData.pacienteNombre} onChange={(e) => handleChange('pacienteNombre', e.target.value)} />
            </div>
            <div>
              <Label>Entidad</Label>
              <Input value={formData.entidad} onChange={(e) => handleChange('entidad', e.target.value)} />
            </div>
            <div>
              <Label>Triage</Label>
              <Select value={formData.triage} onValueChange={(v) => handleChange('triage', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="I">I</SelectItem>
                  <SelectItem value="II">II</SelectItem>
                  <SelectItem value="III">III</SelectItem>
                  <SelectItem value="IV">IV</SelectItem>
                  <SelectItem value="V">V</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Destino del paciente</Label>
              <Select value={formData.destinoPaciente} onValueChange={(v) => handleChange('destinoPaciente', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="egreso">Egreso</SelectItem>
                  <SelectItem value="hospitalizacion">Hospitalización</SelectItem>
                  <SelectItem value="remision">Remisión</SelectItem>
                  <SelectItem value="observacion">Observación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Dx Ingreso (CIE10)</Label>
              <Input value={formData.dxIngreso} onChange={(e) => handleChange('dxIngreso', e.target.value)} />
            </div>
            <div>
              <Label>Dx Salida (CIE10)</Label>
              <Input value={formData.dxSalida} onChange={(e) => handleChange('dxSalida', e.target.value)} />
            </div>
            <div className="md:col-span-3">
              <Label>Descripción de la atención</Label>
              <Textarea value={formData.descripcionAtencion} onChange={(e) => handleChange('descripcionAtencion', e.target.value)} rows={3} />
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


