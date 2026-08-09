'use client';

import { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function FacturacionGruposEtareosPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombreGrupo: '',
    edadMin: '',
    edadMax: '',
    descripcion: '',
  });

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Grupo etáreo guardado', description: 'Se registró la configuración del grupo etáreo.' });
  };

  return (
    <ModulePageLayout title="Facturación - Grupos etareos" description="Configuración de grupos etáreos" maxWidth="5xl" showBackButton>
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Grupo Etáreo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Nombre del grupo</Label>
              <Input value={formData.nombreGrupo} onChange={(e) => handleChange('nombreGrupo', e.target.value)} required />
            </div>
            <div>
              <Label>Edad mínima</Label>
              <Input type="number" value={formData.edadMin} onChange={(e) => handleChange('edadMin', e.target.value)} required />
            </div>
            <div>
              <Label>Edad máxima</Label>
              <Input type="number" value={formData.edadMax} onChange={(e) => handleChange('edadMax', e.target.value)} required />
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


