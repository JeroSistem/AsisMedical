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

export default function FacturacionTrasladosPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    numeroTraslado: '',
    fecha: '',
    tipoTraslado: '',
    origen: '',
    destino: '',
    pacienteDocumento: '',
    motivo: '',
    horaSalida: '',
    horaLlegada: '',
    vehiculo: '',
    conductor: '',
    acompanante: '',
  });

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Traslado registrado', description: 'Traslado asociado para facturación.' });
  };

  return (
    <ModulePageLayout title="Facturación - Traslados" description="Registro de traslados facturables" maxWidth="7xl" showBackButton>
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Traslado</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Número de traslado</Label>
              <Input value={formData.numeroTraslado} onChange={(e) => handleChange('numeroTraslado', e.target.value)} required />
            </div>
            <div>
              <Label>Fecha</Label>
              <Input type="date" value={formData.fecha} onChange={(e) => handleChange('fecha', e.target.value)} required />
            </div>
            <div>
              <Label>Tipo de traslado</Label>
              <Select value={formData.tipoTraslado} onValueChange={(v) => handleChange('tipoTraslado', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                  <SelectItem value="intermunicipal">Intermunicipal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Origen</Label>
              <Input value={formData.origen} onChange={(e) => handleChange('origen', e.target.value)} required />
            </div>
            <div>
              <Label>Destino</Label>
              <Input value={formData.destino} onChange={(e) => handleChange('destino', e.target.value)} required />
            </div>
            <div>
              <Label>Documento paciente</Label>
              <Input value={formData.pacienteDocumento} onChange={(e) => handleChange('pacienteDocumento', e.target.value)} required />
            </div>
            <div>
              <Label>Hora salida</Label>
              <Input type="time" value={formData.horaSalida} onChange={(e) => handleChange('horaSalida', e.target.value)} />
            </div>
            <div>
              <Label>Hora llegada</Label>
              <Input type="time" value={formData.horaLlegada} onChange={(e) => handleChange('horaLlegada', e.target.value)} />
            </div>
            <div>
              <Label>Vehículo</Label>
              <Input value={formData.vehiculo} onChange={(e) => handleChange('vehiculo', e.target.value)} placeholder="Ambulancia / Placa" />
            </div>
            <div>
              <Label>Conductor</Label>
              <Input value={formData.conductor} onChange={(e) => handleChange('conductor', e.target.value)} />
            </div>
            <div>
              <Label>Acompañante</Label>
              <Input value={formData.acompanante} onChange={(e) => handleChange('acompanante', e.target.value)} />
            </div>
            <div className="md:col-span-3">
              <Label>Motivo</Label>
              <Textarea value={formData.motivo} onChange={(e) => handleChange('motivo', e.target.value)} rows={3} />
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


