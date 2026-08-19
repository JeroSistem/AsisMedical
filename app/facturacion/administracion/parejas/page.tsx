'use client';

import { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function FacturacionParejasPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    documentoTitular: '',
    nombreTitular: '',
    documentoPareja: '',
    nombrePareja: '',
    relacion: '',
    estado: 'Activa',
  });

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Pareja registrada', description: 'Relación de pareja asociada.' });
  };

  return (
    <ModulePageLayout title="Facturación - Parejas" description="Relación de parejas para procesos" maxWidth="5xl" showBackButton>
      <Card>
        <CardHeader>
          <CardTitle>Nueva Pareja</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Documento titular</Label>
              <Input value={formData.documentoTitular} onChange={(e) => handleChange('documentoTitular', e.target.value)} required />
            </div>
            <div>
              <Label>Nombre titular</Label>
              <Input value={formData.nombreTitular} onChange={(e) => handleChange('nombreTitular', e.target.value)} />
            </div>
            <div>
              <Label>Documento pareja</Label>
              <Input value={formData.documentoPareja} onChange={(e) => handleChange('documentoPareja', e.target.value)} required />
            </div>
            <div>
              <Label>Nombre pareja</Label>
              <Input value={formData.nombrePareja} onChange={(e) => handleChange('nombrePareja', e.target.value)} />
            </div>
            <div>
              <Label>Relación</Label>
              <Select value={formData.relacion} onValueChange={(v) => handleChange('relacion', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conyuge">Cónyuge</SelectItem>
                  <SelectItem value="compañero">Compañero(a) permanente</SelectItem>
                  <SelectItem value="pareja">Pareja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estado</Label>
              <Select value={formData.estado} onValueChange={(v) => handleChange('estado', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activa">Activa</SelectItem>
                  <SelectItem value="Inactiva">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ModulePageLayout>
  );
}


