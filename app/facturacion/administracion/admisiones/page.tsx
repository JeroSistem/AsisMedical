'use client';

import { useState } from 'react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function FacturacionAdmisionesPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Datos de la admisión
    numeroAdmision: '',
    fechaAdmision: '',
    fechaEgreso: '',
    tipoAdmision: '',
    viaIngreso: '',
    causaExterna: '',
    estadoAdmision: 'abierta',

    // Paciente y entidad
    pacienteDocumento: '',
    pacienteNombre: '',
    entidad: '',
    regimen: '',
    planBeneficios: '',

    // Ubicación / servicio
    servicio: '',
    especialidad: '',
    area: '',
    habitacion: '',
    cama: '',

    // Autorización / referencia
    requiereAutorizacion: false,
    numeroAutorizacion: '',
    numeroReferencia: '',

    // Diagnósticos
    dxIngreso: '',
    dxEgresoPrincipal: '',
    dxEgresoRelacionado: '',

    // Responsable
    medico: '',
    usuarioCreacion: '',

    // Observaciones
    observaciones: '',
  });

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Admisión registrada', description: 'Admisión asociada para procesos de facturación.' });
  };

  return (
    <ModulePageLayout title="Facturación - Admisiones" description="Registro y edición de admisiones" maxWidth="7xl" showBackButton>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos de la Admisión */}
        <Card>
          <CardHeader>
            <CardTitle>Datos de la Admisión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label>Número de admisión</Label>
                <Input value={formData.numeroAdmision} onChange={(e) => handleChange('numeroAdmision', e.target.value)} required />
              </div>
              <div>
                <Label>Fecha de admisión</Label>
                <Input type="date" value={formData.fechaAdmision} onChange={(e) => handleChange('fechaAdmision', e.target.value)} required />
              </div>
              <div>
                <Label>Fecha de egreso</Label>
                <Input type="date" value={formData.fechaEgreso} onChange={(e) => handleChange('fechaEgreso', e.target.value)} />
              </div>
              <div>
                <Label>Tipo de admisión</Label>
                <Select value={formData.tipoAdmision} onValueChange={(v) => handleChange('tipoAdmision', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgencias">Urgencias</SelectItem>
                    <SelectItem value="consulta">Consulta Externa</SelectItem>
                    <SelectItem value="hospitalizacion">Hospitalización</SelectItem>
                    <SelectItem value="quirurgica">Quirúrgica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Vía de ingreso</Label>
                <Select value={formData.viaIngreso} onValueChange={(v) => handleChange('viaIngreso', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="espontanea">Espontánea</SelectItem>
                    <SelectItem value="remitido">Remitido</SelectItem>
                    <SelectItem value="referencia">Referencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Causa externa</Label>
                <Select value={formData.causaExterna} onValueChange={(v) => handleChange('causaExterna', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accidenteTransito">Accidente de tránsito</SelectItem>
                    <SelectItem value="accidenteTrabajo">Accidente de trabajo</SelectItem>
                    <SelectItem value="eventoCatastrofico">Evento catastrófico</SelectItem>
                    <SelectItem value="otra">Otra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estado admisión</Label>
                <Select value={formData.estadoAdmision} onValueChange={(v) => handleChange('estadoAdmision', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abierta">Abierta</SelectItem>
                    <SelectItem value="cerrada">Cerrada</SelectItem>
                    <SelectItem value="anulada">Anulada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paciente y Entidad */}
        <Card>
          <CardHeader>
            <CardTitle>Paciente y Entidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label>Documento paciente</Label>
                <Input value={formData.pacienteDocumento} onChange={(e) => handleChange('pacienteDocumento', e.target.value)} required />
              </div>
              <div className="lg:col-span-2">
                <Label>Nombre paciente</Label>
                <Input value={formData.pacienteNombre} onChange={(e) => handleChange('pacienteNombre', e.target.value)} />
              </div>
              <div className="lg:col-span-2">
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
              <div>
                <Label>Plan de beneficios</Label>
                <Input value={formData.planBeneficios} onChange={(e) => handleChange('planBeneficios', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ubicación y Servicio */}
        <Card>
          <CardHeader>
            <CardTitle>Ubicación y Servicio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label>Servicio</Label>
                <Select value={formData.servicio} onValueChange={(v) => handleChange('servicio', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicinaInterna">Medicina Interna</SelectItem>
                    <SelectItem value="cirugia">Cirugía</SelectItem>
                    <SelectItem value="ginecologia">Ginecología</SelectItem>
                    <SelectItem value="pediatria">Pediatría</SelectItem>
                    <SelectItem value="trauma">Traumatología</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Especialidad</Label>
                <Input value={formData.especialidad} onChange={(e) => handleChange('especialidad', e.target.value)} />
              </div>
              <div>
                <Label>Área</Label>
                <Input value={formData.area} onChange={(e) => handleChange('area', e.target.value)} />
              </div>
              <div>
                <Label>Habitación</Label>
                <Input value={formData.habitacion} onChange={(e) => handleChange('habitacion', e.target.value)} />
              </div>
              <div>
                <Label>Cama</Label>
                <Input value={formData.cama} onChange={(e) => handleChange('cama', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Autorización y Referencia */}
        <Card>
          <CardHeader>
            <CardTitle>Autorización y Referencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
              <div className="flex items-center space-x-2">
                <Switch id="reqAuto" checked={formData.requiereAutorizacion} onCheckedChange={(v) => handleChange('requiereAutorizacion', v)} />
                <Label htmlFor="reqAuto">Requiere autorización</Label>
              </div>
              <div className="lg:col-span-2">
                <Label>Número de autorización</Label>
                <Input value={formData.numeroAutorizacion} onChange={(e) => handleChange('numeroAutorizacion', e.target.value)} disabled={!formData.requiereAutorizacion} />
              </div>
              <div className="lg:col-span-2">
                <Label>Número de referencia</Label>
                <Input value={formData.numeroReferencia} onChange={(e) => handleChange('numeroReferencia', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diagnósticos */}
        <Card>
          <CardHeader>
            <CardTitle>Diagnósticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Dx de ingreso (CIE10)</Label>
                <Input value={formData.dxIngreso} onChange={(e) => handleChange('dxIngreso', e.target.value)} />
              </div>
              <div>
                <Label>Dx egreso principal (CIE10)</Label>
                <Input value={formData.dxEgresoPrincipal} onChange={(e) => handleChange('dxEgresoPrincipal', e.target.value)} />
              </div>
              <div>
                <Label>Dx egreso relacionado (CIE10)</Label>
                <Input value={formData.dxEgresoRelacionado} onChange={(e) => handleChange('dxEgresoRelacionado', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsable y Observaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Responsable y Observaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Médico tratante</Label>
                <Input value={formData.medico} onChange={(e) => handleChange('medico', e.target.value)} />
              </div>
              <div>
                <Label>Usuario creación</Label>
                <Input value={formData.usuarioCreacion} onChange={(e) => handleChange('usuarioCreacion', e.target.value)} />
              </div>
              <div className="md:col-span-3">
                <Label>Observaciones</Label>
                <Textarea value={formData.observaciones} onChange={(e) => handleChange('observaciones', e.target.value)} rows={3} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </ModulePageLayout>
  );
}


