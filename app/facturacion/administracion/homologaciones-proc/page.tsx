'use client';

import { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function FacturacionHomologacionesPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    codigoOrigen: '',
    codigoDestino: '',
    descripcion: '',
  });

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Homologación guardada', description: 'Relación de códigos creada/actualizada.' });
  };

  return (
    <ModulePageLayout title="Facturación - Homologaciones proc" description="Relación de códigos (origen/destino)" maxWidth="5xl" showBackButton>
      <Card>
        <CardHeader>
          <CardTitle>Nueva Homologación</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Código origen</Label>
              <Input value={formData.codigoOrigen} onChange={(e) => handleChange('codigoOrigen', e.target.value)} required />
            </div>
            <div>
              <Label>Código destino</Label>
              <Input value={formData.codigoDestino} onChange={(e) => handleChange('codigoDestino', e.target.value)} required />
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


