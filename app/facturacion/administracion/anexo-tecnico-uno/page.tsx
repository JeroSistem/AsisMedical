'use client';

import { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function FacturacionAnexoTecnicoUnoPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    numeroAnexo: '',
    fecha: '',
    entidad: '',
    pacienteDocumento: '',
    titulo: '',
    descripcion: '',
    version: '',
    anexosRelacionados: '',
  });

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Anexo Técnico Uno guardado', description: 'Se registró el anexo técnico.' });
  };

  return (
    <ModulePageLayout title="Anexo Técnico Uno" description="Registro de anexo técnico" maxWidth="7xl" showBackButton>
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Anexo Técnico</CardTitle>
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
              <Label>Entidad</Label>
              <Input value={formData.entidad} onChange={(e) => handleChange('entidad', e.target.value)} />
            </div>
            <div>
              <Label>Documento paciente</Label>
              <Input value={formData.pacienteDocumento} onChange={(e) => handleChange('pacienteDocumento', e.target.value)} />
            </div>
            <div className="md:col-span-3">
              <Label>Título</Label>
              <Input value={formData.titulo} onChange={(e) => handleChange('titulo', e.target.value)} />
            </div>
            <div className="md:col-span-3">
              <Label>Descripción</Label>
              <Textarea value={formData.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} rows={3} />
            </div>
            <div>
              <Label>Versión</Label>
              <Input value={formData.version} onChange={(e) => handleChange('version', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Anexos relacionados</Label>
              <Input value={formData.anexosRelacionados} onChange={(e) => handleChange('anexosRelacionados', e.target.value)} placeholder="IDs separados por coma" />
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


