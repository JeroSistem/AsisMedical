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

export default function FacturacionResolucion4505Page() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    periodo: '',
    anio: '',
    entidad: '',
    regimen: '',
    responsable: '',
    observaciones: '',
  });

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Resolución 4505 configurada', description: 'Parámetros guardados.' });
  };

  return (
    <ModulePageLayout title="Resolución 4505" description="Parámetros para reporte 4505" maxWidth="6xl" showBackButton>
      <Card>
        <CardHeader>
          <CardTitle>Configuración 4505</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Periodo</Label>
              <Select value={formData.periodo} onValueChange={(v) => handleChange('periodo', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensual">Mensual</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="semestral">Semestral</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Año</Label>
              <Input type="number" value={formData.anio} onChange={(e) => handleChange('anio', e.target.value)} />
            </div>
            <div>
              <Label>Entidad</Label>
              <Input value={formData.entidad} onChange={(e) => handleChange('entidad', e.target.value)} />
            </div>
            <div>
              <Label>Régimen</Label>
              <Select value={formData.regimen} onValueChange={(v) => handleChange('regimen', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contributivo">Contributivo</SelectItem>
                  <SelectItem value="subsidiado">Subsidiado</SelectItem>
                  <SelectItem value="vinculado">Vinculado</SelectItem>
                  <SelectItem value="particular">Particular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Responsable</Label>
              <Input value={formData.responsable} onChange={(e) => handleChange('responsable', e.target.value)} />
            </div>
            <div className="md:col-span-3">
              <Label>Observaciones</Label>
              <Textarea value={formData.observaciones} onChange={(e) => handleChange('observaciones', e.target.value)} rows={3} />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ModulePageLayout>
  );
}


