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

export default function FacturacionAnexoAutorizacionesPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    numeroAutorizacion: '',
    fecha: '',
    pacienteDocumento: '',
    pacienteNombre: '',
    entidad: '',
    tipoServicio: '',
    items: [{ codigo: '', descripcion: '', cantidad: 1 }],
    observaciones: '',
  });

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Autorización registrada', description: 'Se registró el anexo de autorización.' });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const items = [...formData.items];
    // @ts-ignore
    items[index] = { ...items[index], [field]: value };
    handleChange('items', items);
  };

  const addItem = () => handleChange('items', [...formData.items, { codigo: '', descripcion: '', cantidad: 1 }]);
  const removeItem = (i: number) => handleChange('items', formData.items.filter((_, idx) => idx !== i));

  return (
    <ModulePageLayout title="Anexo técnico Autorizaciones" description="Registro de autorizaciones" maxWidth="7xl" showBackButton>
      <Card>
        <CardHeader>
          <CardTitle>Nueva Autorización</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Número autorización</Label>
              <Input value={formData.numeroAutorizacion} onChange={(e) => handleChange('numeroAutorizacion', e.target.value)} required />
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
              <Label>Tipo de servicio</Label>
              <Select value={formData.tipoServicio} onValueChange={(v) => handleChange('tipoServicio', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consulta">Consulta</SelectItem>
                  <SelectItem value="procedimiento">Procedimiento</SelectItem>
                  <SelectItem value="medicamento">Medicamento</SelectItem>
                  <SelectItem value="imagen">Imágenes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Label>Ítems autorizados</Label>
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                    <Input placeholder="Código" value={item.codigo} onChange={(e) => handleItemChange(index, 'codigo', e.target.value)} />
                    <Input placeholder="Descripción" value={item.descripcion} onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)} />
                    <Input type="number" placeholder="Cantidad" value={item.cantidad} onChange={(e) => handleItemChange(index, 'cantidad', Number(e.target.value))} />
                    {formData.items.length > 1 && (
                      <Button type="button" variant="outline" onClick={() => removeItem(index)}>Quitar</Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addItem}>Agregar Ítem</Button>
              </div>
            </div>
            <div className="md:col-span-3">
              <Label>Observaciones</Label>
              <Textarea value={formData.observaciones} onChange={(e) => handleChange('observaciones', e.target.value)} rows={3} />
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


