
'use client';

import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function InstitutionPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombreInstitucion: 'ASIS medical Plus',
    nit: '900.123.456-7',
    direccion: 'Calle Falsa 123',
    departamento: 'Antioquia',
    ciudad: 'Medellín',
    telefono: '+57 4 1234567',
    email: 'contacto@asismedical.com',
    codigoIps: '0500112345',
    logo: '',
    nombreRepresentante: 'Dr. Juan Pérez',
    tratamientoRepresentante: 'Doctor',
    firmaRepresentante: '',
    ccUrgencias: '',
    ccRecibosDebito: '',
    ccRecibosCredito: '',
    ccCopagos: '',
    ccCuotaModeradora: '',
    ccDescuentos: '',
    ccIvaCompras: '',
    costosUrgencias: '',
    serviciosUrgencias: '',
    costosOdontologia: '',
    serviciosOdontologia: '',
    docRecibosCaja: '',
    docFacturasRadicadas: '',
    docFacturasSinRadicar: '',
    docCompras: '',
    docIngresoInventario: '',
    docSalidaInventario: '',
    docEntregaInventario: '',
    rubroPresupuesto: '',
    horasBloqueo: 24,
    ifPagoEgreso: false,
    ifPym202: false,
    ifPagoObligatorias: false,
    ifRecordatorioCita: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'number' ? parseInt(value) : value
    }));
  };
  
  const handleSwitchChange = (id: string, checked: boolean) => {
     setFormData(prev => ({ ...prev, [id]: checked }));
  }

  const handleSave = () => {
    console.log('Datos guardados:', formData);
    toast({
        title: "Cambios Guardados",
        description: "La información de la institución ha sido actualizada.",
    })
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Configuración de la Institución</h2>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombreInstitucion">Nombre de la Institución</Label>
                <Input id="nombreInstitucion" value={formData.nombreInstitucion} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nit">NIT</Label>
                <Input id="nit" value={formData.nit} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" value={formData.direccion} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento</Label>
                <Input id="departamento" value={formData.departamento} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input id="ciudad" value={formData.ciudad} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" value={formData.telefono} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigoIps">Código IPS</Label>
                <Input id="codigoIps" value={formData.codigoIps} onChange={handleChange} />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-4">
                  <Input id="logo" type="file" className="max-w-xs" />
                  <Button variant="outline" size="icon"><Upload className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Representante Legal</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombreRepresentante">Nombre del Representante</Label>
                <Input id="nombreRepresentante" value={formData.nombreRepresentante} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tratamientoRepresentante">Tratamiento</Label>
                <Input id="tratamientoRepresentante" value={formData.tratamientoRepresentante} onChange={handleChange} />
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="firmaRepresentante">Firma</Label>
                 <div className="flex items-center gap-4">
                  <Input id="firmaRepresentante" type="file" className="max-w-xs" />
                  <Button variant="outline" size="icon"><Upload className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cuentas Contables</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="ccUrgencias">Cuenta Contable Urgencias</Label>
                <Input id="ccUrgencias" value={formData.ccUrgencias} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ccRecibosDebito">Cuenta Contable Recibos de Caja (Débito)</Label>
                <Input id="ccRecibosDebito" value={formData.ccRecibosDebito} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ccRecibosCredito">Cuenta Contable Recibos de Caja (Crédito)</Label>
                <Input id="ccRecibosCredito" value={formData.ccRecibosCredito} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ccCopagos">Cuenta Contable Copagos</Label>
                <Input id="ccCopagos" value={formData.ccCopagos} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ccCuotaModeradora">Cuenta Contable Cuota Moderadora</Label>
                <Input id="ccCuotaModeradora" value={formData.ccCuotaModeradora} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ccDescuentos">Cuenta Contable Descuentos</Label>
                <Input id="ccDescuentos" value={formData.ccDescuentos} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ccIvaCompras">Cuenta Contable IVA Compras</Label>
                <Input id="ccIvaCompras" value={formData.ccIvaCompras} onChange={handleChange} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestión de Centros Operativos y de Costos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="costosUrgencias">Centro de Costos Urgencias</Label>
                <Input id="costosUrgencias" value={formData.costosUrgencias} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviciosUrgencias">Centro de Servicios Urgencias</Label>
                <Input id="serviciosUrgencias" value={formData.serviciosUrgencias} onChange={handleChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="costosOdontologia">Centro de Costos Odontología</Label>
                <Input id="costosOdontologia" value={formData.costosOdontologia} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviciosOdontologia">Centro de Servicios Odontología</Label>
                <Input id="serviciosOdontologia" value={formData.serviciosOdontologia} onChange={handleChange} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentos Contables</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label htmlFor="docRecibosCaja">Recibos de Caja</Label><Input id="docRecibosCaja" value={formData.docRecibosCaja} onChange={handleChange} /></div>
              <div className="space-y-2"><Label htmlFor="docFacturasRadicadas">Facturas Radicadas</Label><Input id="docFacturasRadicadas" value={formData.docFacturasRadicadas} onChange={handleChange} /></div>
              <div className="space-y-2"><Label htmlFor="docFacturasSinRadicar">Facturas sin Radicar</Label><Input id="docFacturasSinRadicar" value={formData.docFacturasSinRadicar} onChange={handleChange} /></div>
              <div className="space-y-2"><Label htmlFor="docCompras">Compras</Label><Input id="docCompras" value={formData.docCompras} onChange={handleChange} /></div>
              <div className="space-y-2"><Label htmlFor="docIngresoInventario">Notas Ingreso Inventario</Label><Input id="docIngresoInventario" value={formData.docIngresoInventario} onChange={handleChange} /></div>
              <div className="space-y-2"><Label htmlFor="docSalidaInventario">Notas Salida Inventario</Label><Input id="docSalidaInventario" value={formData.docSalidaInventario} onChange={handleChange} /></div>
              <div className="space-y-2"><Label htmlFor="docEntregaInventario">Entrega Ambulatoria Inventario</Label><Input id="docEntregaInventario" value={formData.docEntregaInventario} onChange={handleChange} /></div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Otras Parametrizaciones</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label htmlFor="rubroPresupuesto">Rubro de Presupuesto Recibos de Caja</Label><Input id="rubroPresupuesto" value={formData.rubroPresupuesto} onChange={handleChange} /></div>
                <div className="space-y-2"><Label htmlFor="horasBloqueo">Horas Espera Bloquear Documentos Médicos</Label><Input id="horasBloqueo" type="number" value={formData.horasBloqueo} onChange={handleChange} /></div>
                <div className="flex items-center space-x-4 rounded-md border p-4 col-span-1">
                    <div className="flex-1 space-y-1"><p className="text-sm font-medium leading-none">Interface Ordenes de Pago Egreso</p></div>
                    <Switch id="ifPagoEgreso" checked={formData.ifPagoEgreso} onCheckedChange={(checked) => handleSwitchChange('ifPagoEgreso', checked)} />
                </div>
                 <div className="flex items-center space-x-4 rounded-md border p-4 col-span-1">
                    <div className="flex-1 space-y-1"><p className="text-sm font-medium leading-none">Interface PYM 202</p></div>
                    <Switch id="ifPym202" checked={formData.ifPym202} onCheckedChange={(checked) => handleSwitchChange('ifPym202', checked)} />
                </div>
                 <div className="flex items-center space-x-4 rounded-md border p-4 col-span-1">
                    <div className="flex-1 space-y-1"><p className="text-sm font-medium leading-none">Ordenes Pago Cuentas Contables Obligatorias</p></div>
                    <Switch id="ifPagoObligatorias" checked={formData.ifPagoObligatorias} onCheckedChange={(checked) => handleSwitchChange('ifPagoObligatorias', checked)} />
                </div>
                 <div className="flex items-center space-x-4 rounded-md border p-4 col-span-1">
                    <div className="flex-1 space-y-1"><p className="text-sm font-medium leading-none">Enviar Recordatorio Cita</p></div>
                    <Switch id="ifRecordatorioCita" checked={formData.ifRecordatorioCita} onCheckedChange={(checked) => handleSwitchChange('ifRecordatorioCita', checked)} />
                </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button size="lg" onClick={handleSave}>Guardar Cambios</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

