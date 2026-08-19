'use client';

import { useState } from 'react';
import Link from 'next/link';
import { List } from 'lucide-react';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createPatient, type PatientFormData } from '@/lib/actions/patients';

function calcAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return Math.max(0, age);
}

function mapSexoToGender(sexo: string): string {
  if (sexo === 'M') return 'masculino';
  if (sexo === 'F') return 'femenino';
  if (sexo === 'I' || sexo === 'N') return 'no definido';
  return 'no definido';
}

export default function FacturacionPacientesPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Información básica
    numeroIdentificacion: '',
    tipoDocumento: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    sexo: '',
    estadoCivil: '',

    // Dirección / Ubicación
    direccion: '',
    telefono: '',
    departamento: '',
    ciudad: '',
    zonaResidencial: '',
    email: '',

    // Afiliación
    tipoPaciente: '',
    tipoAfiliacion: '',
    entidad: '',

    // Otros
    estado: 'Activo',
    discapacidad: 'NINGUNA',
    ocupacion: '',
    grupoEtnico: 'Ninguno',
    nivelEducativo: '',
    grupoPaciente: '',
    observaciones: '',

    // Enfoque diferencial
    orientacionSexual: 'NO REFIERE',
    religion: 'NO REFIERE',
    consumoSpa: 'No',
    gestacion: 'No',
    habitanteCalle: 'NO',
    resguardoIndigena: 'NO REFIERE',
    victimaConflicto: 'No',
    minasAntipersona: 'NO REFIERE',
    minasMunicionSinExplotar: 'NO REFIERE',
    desplazado: 'No',
    ruv: 'No',
    victimaMaltrato: 'No',
    abandonoSocial: 'No',
    carcelario: 'No',
    poblacionLgbti: 'No',
    desempleado: 'No',
    mujerConNinoMenorUnAnio: 'No',
    adultoMayor: 'No',
    migrante: 'No',
    desescolarizado: 'No',
    trabajadoraSexual: 'No',
  });

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    const doc = formData.numeroIdentificacion.trim();
    if (!doc || !formData.tipoDocumento || !formData.primerNombre.trim() || !formData.primerApellido.trim() || !formData.fechaNacimiento || !formData.sexo) {
      toast({
        title: 'Datos incompletos',
        description: 'Complete identificación, nombres, fecha de nacimiento y sexo.',
        variant: 'destructive',
      });
      return;
    }

    const firstName = [formData.primerNombre, formData.segundoNombre]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(' ');

    const extras = [
      formData.zonaResidencial && `Zona: ${formData.zonaResidencial}`,
      formData.tipoPaciente && `Tipo paciente: ${formData.tipoPaciente}`,
      formData.discapacidad && formData.discapacidad !== 'NINGUNA' && `Discapacidad: ${formData.discapacidad}`,
      formData.grupoEtnico && formData.grupoEtnico !== 'Ninguno' && `Grupo étnico: ${formData.grupoEtnico}`,
      formData.nivelEducativo && `Nivel educativo: ${formData.nivelEducativo}`,
      formData.grupoPaciente && `Grupo paciente: ${formData.grupoPaciente}`,
      formData.observaciones && formData.observaciones,
    ]
      .filter(Boolean)
      .join('\n');

    const payload: PatientFormData = {
      documentType: formData.tipoDocumento,
      documentNumber: doc,
      countryOfIssue: 'CO',
      firstName,
      lastName: formData.primerApellido.trim(),
      secondLastName: formData.segundoApellido.trim() || undefined,
      dateOfBirth: formData.fechaNacimiento,
      age: calcAge(formData.fechaNacimiento),
      gender: mapSexoToGender(formData.sexo),
      maritalStatus: formData.estadoCivil || undefined,
      occupation: formData.ocupacion || undefined,
      mobilePhone: formData.telefono || undefined,
      email: formData.email || undefined,
      address: formData.direccion || undefined,
      city: formData.ciudad || undefined,
      department: formData.departamento || undefined,
      country: 'Colombia',
      insuranceProvider: formData.entidad || undefined,
      insuranceNumber: formData.tipoAfiliacion || undefined,
      initialObservations: extras || undefined,
      notificationsConsent: true,
      createAdmission: false,
      dataProcessingConsent: true,
      medicalConsent: false,
      privacyConsent: false,
      communicationConsent: false,
      // Enfoque diferencial → columnas propias en BD
      orientacionSexual: formData.orientacionSexual,
      religion: formData.religion,
      consumoSpa: formData.consumoSpa,
      gestacion: formData.gestacion,
      habitanteCalle: formData.habitanteCalle,
      resguardoIndigena: formData.resguardoIndigena,
      victimaConflicto: formData.victimaConflicto,
      minasAntipersona: formData.minasAntipersona,
      minasMunicionSinExplotar: formData.minasMunicionSinExplotar,
      desplazado: formData.desplazado,
      ruv: formData.ruv,
      victimaMaltrato: formData.victimaMaltrato,
      abandonoSocial: formData.abandonoSocial,
      carcelario: formData.carcelario,
      poblacionLgbti: formData.poblacionLgbti,
      desempleado: formData.desempleado,
      mujerConNinoMenorUnAnio: formData.mujerConNinoMenorUnAnio,
      adultoMayor: formData.adultoMayor,
      migrante: formData.migrante,
      desescolarizado: formData.desescolarizado,
      trabajadoraSexual: formData.trabajadoraSexual,
    };

    setSaving(true);
    try {
      const result = await Promise.race([
        createPatient(payload),
        new Promise<{ success: false; error: string }>((resolve) =>
          setTimeout(
            () =>
              resolve({
                success: false,
                error:
                  'Tiempo de espera agotado. Recargue, inicie sesión de nuevo e intente guardar.',
              }),
            25000
          )
        ),
      ]);
      if (!result.success) {
        toast({
          title: 'No se pudo guardar',
          description: result.error || 'Error al crear el paciente',
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Paciente guardado',
        description: 'El paciente quedó registrado en la base de datos de la institución.',
      });
      setFormData((prev) => ({
        ...prev,
        numeroIdentificacion: '',
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        fechaNacimiento: '',
        sexo: '',
        direccion: '',
        telefono: '',
        email: '',
        observaciones: '',
      }));
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Error inesperado al guardar',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModulePageLayout
      title="Facturación - Pacientes"
      description="Registro de pacientes"
      maxWidth="7xl"
      showBackButton
      actions={
        <Button asChild variant="outline">
          <Link href="/facturacion/administracion/pacientes/lista">
            <List className="mr-2 h-4 w-4" />
            Lista
          </Link>
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <Label>Número identificación</Label>
                <Input value={formData.numeroIdentificacion} onChange={(e) => handleChange('numeroIdentificacion', e.target.value)} required />
              </div>
              <div>
                <Label>Tipo de documento</Label>
                <Select value={formData.tipoDocumento} onValueChange={(v) => handleChange('tipoDocumento', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CC">Cédula</SelectItem>
                    <SelectItem value="TI">Tarjeta Identidad</SelectItem>
                    <SelectItem value="CE">Cédula Extranjería</SelectItem>
                    <SelectItem value="RC">Registro Civil</SelectItem>
                    <SelectItem value="PA">Pasaporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Primer nombre</Label>
                <Input value={formData.primerNombre} onChange={(e) => handleChange('primerNombre', e.target.value)} required />
              </div>
              <div>
                <Label>Segundo nombre</Label>
                <Input value={formData.segundoNombre} onChange={(e) => handleChange('segundoNombre', e.target.value)} />
              </div>
              <div>
                <Label>Primer apellido</Label>
                <Input value={formData.primerApellido} onChange={(e) => handleChange('primerApellido', e.target.value)} required />
              </div>
              <div>
                <Label>Segundo apellido</Label>
                <Input value={formData.segundoApellido} onChange={(e) => handleChange('segundoApellido', e.target.value)} />
              </div>
              <div>
                <Label>Fecha de nacimiento</Label>
                <Input type="date" value={formData.fechaNacimiento} onChange={(e) => handleChange('fechaNacimiento', e.target.value)} required />
              </div>
              <div>
                <Label>Sexo</Label>
                <Select value={formData.sexo} onValueChange={(v) => handleChange('sexo', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Femenino</SelectItem>
                    <SelectItem value="I">Intersexual</SelectItem>
                    <SelectItem value="N">No especifica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estado civil</Label>
                <Select value={formData.estadoCivil} onValueChange={(v) => handleChange('estadoCivil', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soltero">Soltero(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="union">Unión libre</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viudo">Viudo(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dirección / Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle>Dirección / Ubicación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <Label>Dirección</Label>
                <Input value={formData.direccion} onChange={(e) => handleChange('direccion', e.target.value)} required />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input value={formData.telefono} onChange={(e) => handleChange('telefono', e.target.value)} />
              </div>
              <div>
                <Label>Departamento</Label>
                <Input value={formData.departamento} onChange={(e) => handleChange('departamento', e.target.value)} />
              </div>
              <div>
                <Label>Ciudad</Label>
                <Input value={formData.ciudad} onChange={(e) => handleChange('ciudad', e.target.value)} />
              </div>
              <div>
                <Label>Zona residencial</Label>
                <Select value={formData.zonaResidencial} onValueChange={(v) => handleChange('zonaResidencial', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urbana">Urbana</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="lg:col-span-2">
                <Label>Correo electrónico</Label>
                <Input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Afiliación */}
        <Card>
          <CardHeader>
            <CardTitle>Afiliación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Tipo de Paciente</Label>
                <Select value={formData.tipoPaciente} onValueChange={(v) => handleChange('tipoPaciente', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="particular">Particular</SelectItem>
                    <SelectItem value="asegurado">Asegurado</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipo de Afiliación</Label>
                <Select value={formData.tipoAfiliacion} onValueChange={(v) => handleChange('tipoAfiliacion', v)}>
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
                <Label>Entidad</Label>
                <Input value={formData.entidad} onChange={(e) => handleChange('entidad', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Otros */}
        <Card>
          <CardHeader>
            <CardTitle>Otros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label>Estado</Label>
                <Select value={formData.estado} onValueChange={(v) => handleChange('estado', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Discapacidad</Label>
                <Select value={formData.discapacidad} onValueChange={(v) => handleChange('discapacidad', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NINGUNA">Ninguna</SelectItem>
                    <SelectItem value="FISICA">Física</SelectItem>
                    <SelectItem value="VISUAL">Visual</SelectItem>
                    <SelectItem value="AUDITIVA">Auditiva</SelectItem>
                    <SelectItem value="COGNITIVA">Cognitiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ocupación</Label>
                <Input value={formData.ocupacion} onChange={(e) => handleChange('ocupacion', e.target.value)} />
              </div>
              <div>
                <Label>Grupo étnico</Label>
                <Select value={formData.grupoEtnico} onValueChange={(v) => handleChange('grupoEtnico', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ninguno">Ninguno de los anteriores</SelectItem>
                    <SelectItem value="Indigena">Indígena</SelectItem>
                    <SelectItem value="Afrodescendiente">Afrodescendiente</SelectItem>
                    <SelectItem value="ROM">Pueblo Rrom</SelectItem>
                    <SelectItem value="Raizal">Raizal</SelectItem>
                    <SelectItem value="Palenquero">Palenquero</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nivel educativo</Label>
                <Input value={formData.nivelEducativo} onChange={(e) => handleChange('nivelEducativo', e.target.value)} />
              </div>
              <div className="lg:col-span-2">
                <Label>Grupo Paciente</Label>
                <Input value={formData.grupoPaciente} onChange={(e) => handleChange('grupoPaciente', e.target.value)} />
              </div>
              <div className="lg:col-span-2">
                <Label>Observaciones</Label>
                <Textarea value={formData.observaciones} onChange={(e) => handleChange('observaciones', e.target.value)} rows={3} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enfoque diferencial */}
        <Card>
          <CardHeader>
            <CardTitle>Enfoque Diferencial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label>Orientación sexual</Label>
                <Input value={formData.orientacionSexual} onChange={(e) => handleChange('orientacionSexual', e.target.value)} />
              </div>
              <div>
                <Label>Religión</Label>
                <Input value={formData.religion} onChange={(e) => handleChange('religion', e.target.value)} />
              </div>
              <div>
                <Label>Consumo de spa</Label>
                <Select value={formData.consumoSpa} onValueChange={(v) => handleChange('consumoSpa', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Gestación</Label>
                <Select value={formData.gestacion} onValueChange={(v) => handleChange('gestacion', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Habitante de calle</Label>
                <Select value={formData.habitanteCalle} onValueChange={(v) => handleChange('habitanteCalle', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NO">No</SelectItem>
                    <SelectItem value="SI">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Resguardo indígena</Label>
                <Input value={formData.resguardoIndigena} onChange={(e) => handleChange('resguardoIndigena', e.target.value)} />
              </div>
              <div>
                <Label>Víctima conflicto armado</Label>
                <Select value={formData.victimaConflicto} onValueChange={(v) => handleChange('victimaConflicto', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Minas antipersona</Label>
                <Input value={formData.minasAntipersona} onChange={(e) => handleChange('minasAntipersona', e.target.value)} />
              </div>
              <div>
                <Label>Munición sin explotar</Label>
                <Input value={formData.minasMunicionSinExplotar} onChange={(e) => handleChange('minasMunicionSinExplotar', e.target.value)} />
              </div>
              <div>
                <Label>Desplazado</Label>
                <Select value={formData.desplazado} onValueChange={(v) => handleChange('desplazado', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>RUV - registro único de víctima</Label>
                <Select value={formData.ruv} onValueChange={(v) => handleChange('ruv', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Víctima de maltrato</Label>
                <Select value={formData.victimaMaltrato} onValueChange={(v) => handleChange('victimaMaltrato', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Abandono social</Label>
                <Select value={formData.abandonoSocial} onValueChange={(v) => handleChange('abandonoSocial', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Carcelario</Label>
                <Select value={formData.carcelario} onValueChange={(v) => handleChange('carcelario', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Población LGBTI+</Label>
                <Select value={formData.poblacionLgbti} onValueChange={(v) => handleChange('poblacionLgbti', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Desempleado</Label>
                <Select value={formData.desempleado} onValueChange={(v) => handleChange('desempleado', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Mujer con niño menor a un año</Label>
                <Select value={formData.mujerConNinoMenorUnAnio} onValueChange={(v) => handleChange('mujerConNinoMenorUnAnio', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Adulto mayor</Label>
                <Select value={formData.adultoMayor} onValueChange={(v) => handleChange('adultoMayor', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Migrante</Label>
                <Select value={formData.migrante} onValueChange={(v) => handleChange('migrante', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Desescolarizado</Label>
                <Select value={formData.desescolarizado} onValueChange={(v) => handleChange('desescolarizado', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Trabajadora sexual</Label>
                <Select value={formData.trabajadoraSexual} onValueChange={(v) => handleChange('trabajadoraSexual', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Si">Sí</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      </form>
    </ModulePageLayout>
  );
}


