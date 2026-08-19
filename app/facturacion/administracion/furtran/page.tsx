'use client';

import { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function FacturacionFurtranPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    numero: '',
    fecha: '',
    empresaTransporte: '',
    descripcion: '',
  });

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Furtran guardado', description: 'Registro FURTRAN creado/actualizado.' });
  };

  return (
    <ModulePageLayout title="Facturación - Furtran" description="Registro FURTRAN" maxWidth="5xl" showBackButton>
      <Card>
        <CardHeader>
          <CardTitle>Nuevo FURTRAN</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Número</Label>
              <Input value={formData.numero} onChange={(e) => handleChange('numero', e.target.value)} required />
            </div>
            <div>
              <Label>Fecha</Label>
              <Input type="date" value={formData.fecha} onChange={(e) => handleChange('fecha', e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <Label>Empresa de transporte</Label>
              <Input value={formData.empresaTransporte} onChange={(e) => handleChange('empresaTransporte', e.target.value)} />
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


