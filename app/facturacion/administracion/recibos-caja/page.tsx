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

export default function FacturacionRecibosCajaPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    numeroRecibo: '',
    fecha: '',
    caja: '',
    terceroDocumento: '',
    terceroNombre: '',
    valor: '',
    formaPago: '',
    banco: '',
    numeroComprobante: '',
    concepto: '',
    observaciones: '',
  });

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Recibo registrado', description: 'Recibo de caja guardado correctamente.' });
  };

  return (
    <ModulePageLayout title="Facturación - Recibos de caja" description="Registro de pagos/cobros" maxWidth="7xl" showBackButton>
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Recibo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Número de recibo</Label>
              <Input value={formData.numeroRecibo} onChange={(e) => handleChange('numeroRecibo', e.target.value)} required />
            </div>
            <div>
              <Label>Fecha</Label>
              <Input type="date" value={formData.fecha} onChange={(e) => handleChange('fecha', e.target.value)} required />
            </div>
            <div>
              <Label>Caja</Label>
              <Input value={formData.caja} onChange={(e) => handleChange('caja', e.target.value)} placeholder="Principal / Auxiliar" />
            </div>
            <div>
              <Label>Documento tercero</Label>
              <Input value={formData.terceroDocumento} onChange={(e) => handleChange('terceroDocumento', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Nombre tercero</Label>
              <Input value={formData.terceroNombre} onChange={(e) => handleChange('terceroNombre', e.target.value)} />
            </div>
            <div>
              <Label>Valor</Label>
              <Input type="number" value={formData.valor} onChange={(e) => handleChange('valor', e.target.value)} required />
            </div>
            <div>
              <Label>Forma de pago</Label>
              <Select value={formData.formaPago} onValueChange={(v) => handleChange('formaPago', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Banco</Label>
              <Input value={formData.banco} onChange={(e) => handleChange('banco', e.target.value)} />
            </div>
            <div>
              <Label>N° comprobante</Label>
              <Input value={formData.numeroComprobante} onChange={(e) => handleChange('numeroComprobante', e.target.value)} />
            </div>
            <div className="md:col-span-3">
              <Label>Concepto</Label>
              <Input value={formData.concepto} onChange={(e) => handleChange('concepto', e.target.value)} />
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


