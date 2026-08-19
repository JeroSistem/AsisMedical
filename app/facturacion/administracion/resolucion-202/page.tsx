'use client';

import { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function FacturacionResolucion202Page() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    numeroResolucion: '',
    fechaResolucion: '',
    fechaVigencia: '',
    fechaVencimiento: '',
    tipoResolucion: '',
    descripcion: '',
    entidad: '',
  });

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Resolución registrada', description: 'Resolución 202 creada/actualizada.' });
  };

  return (
    <ModulePageLayout title="Resolución 202" description="Gestión de resolución 202 para facturación" maxWidth="5xl" showBackButton>
      <Card>
        <CardHeader>
          <CardTitle>Nueva Resolución 202</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Número de Resolución</Label>
              <Input value={formData.numeroResolucion} onChange={(e) => handleChange('numeroResolucion', e.target.value)} required />
            </div>
            <div>
              <Label>Fecha de Resolución</Label>
              <Input type="date" value={formData.fechaResolucion} onChange={(e) => handleChange('fechaResolucion', e.target.value)} required />
            </div>
            <div>
              <Label>Fecha Vigencia</Label>
              <Input type="date" value={formData.fechaVigencia} onChange={(e) => handleChange('fechaVigencia', e.target.value)} required />
            </div>
            <div>
              <Label>Fecha Vencimiento</Label>
              <Input type="date" value={formData.fechaVencimiento} onChange={(e) => handleChange('fechaVencimiento', e.target.value)} required />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={formData.tipoResolucion} onValueChange={(v) => handleChange('tipoResolucion', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tarifas">Tarifas</SelectItem>
                  <SelectItem value="procedimientos">Procedimientos</SelectItem>
                  <SelectItem value="medicamentos">Medicamentos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Entidad</Label>
              <Input value={formData.entidad} onChange={(e) => handleChange('entidad', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Descripción</Label>
              <Textarea value={formData.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} rows={3} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ModulePageLayout>
  );
}


