'use client';

import React, { useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Save, 
  Printer, 
  Heart, 
  Activity, 
  Thermometer, 
  Droplet,
  User,
  Clock,
  AlertCircle,
  TrendingUp,
  Baby,
  Stethoscope
} from 'lucide-react';

interface PartogramaData {
  // Datos de identificación
  pacienteId: string;
  nombrePaciente: string;
  edad: string;
  numeroHistoria: string;
  fecha: string;
  horaIngreso: string;
  
  // Datos obstétricos
  gravidez: string;
  paridad: string;
  abortos: string;
  cesareas: string;
  fum: string;
  fpp: string;
  edadGestacional: string;
  
  // Datos del trabajo de parto
  horaInicioTrabajoParto: string;
  horaRupturaMembrana: string;
  caracteristicasLiquido: string;
  
  // Dilatación cervical (registros cada hora)
  dilataciones: Array<{
    hora: string;
    dilatacion: string;
    borramiento: string;
    posicion: string;
    consistencia: string;
    altura: string;
  }>;
  
  // Frecuencia cardíaca fetal
  frecuenciasCardiacas: Array<{
    hora: string;
    fcf: string;
  }>;
  
  // Contracciones uterinas
  contracciones: Array<{
    hora: string;
    frecuencia: string;
    duracion: string;
    intensidad: string;
  }>;
  
  // Signos vitales maternos
  signosVitales: Array<{
    hora: string;
    presionArterial: string;
    pulso: string;
    temperatura: string;
    frecuenciaRespiratoria: string;
  }>;
  
  // Medicamentos y procedimientos
  medicamentos: Array<{
    hora: string;
    medicamento: string;
    dosis: string;
    via: string;
  }>;
  
  // Observaciones
  observaciones: string;
  complicaciones: string;
  
  // Resultados del parto
  tipoParto: string;
  horaExpulsivo: string;
  horaNacimiento: string;
  sexoRN: string;
  pesoRN: string;
  tallaRN: string;
  apgar1: string;
  apgar5: string;
  apgar10: string;
  
  // Personal
  medicoResponsable: string;
  enfermera: string;
}

export default function PartogramaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PartogramaData>({
    pacienteId: '',
    nombrePaciente: '',
    edad: '',
    numeroHistoria: '',
    fecha: new Date().toISOString().split('T')[0],
    horaIngreso: '',
    gravidez: '',
    paridad: '',
    abortos: '0',
    cesareas: '0',
    fum: '',
    fpp: '',
    edadGestacional: '',
    horaInicioTrabajoParto: '',
    horaRupturaMembrana: '',
    caracteristicasLiquido: '',
    dilataciones: [],
    frecuenciasCardiacas: [],
    contracciones: [],
    signosVitales: [],
    medicamentos: [],
    observaciones: '',
    complicaciones: '',
    tipoParto: '',
    horaExpulsivo: '',
    horaNacimiento: '',
    sexoRN: '',
    pesoRN: '',
    tallaRN: '',
    apgar1: '',
    apgar5: '',
    apgar10: '',
    medicoResponsable: '',
    enfermera: ''
  });

  const handleInputChange = (field: keyof PartogramaData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const agregarDilatacion = () => {
    const nuevaDilatacion = {
      hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      dilatacion: '',
      borramiento: '',
      posicion: '',
      consistencia: '',
      altura: ''
    };
    setFormData(prev => ({
      ...prev,
      dilataciones: [...prev.dilataciones, nuevaDilatacion]
    }));
  };

  const agregarFrecuenciaCardiaca = () => {
    const nuevaFC = {
      hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      fcf: ''
    };
    setFormData(prev => ({
      ...prev,
      frecuenciasCardiacas: [...prev.frecuenciasCardiacas, nuevaFC]
    }));
  };

  const agregarContraccion = () => {
    const nuevaContraccion = {
      hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      frecuencia: '',
      duracion: '',
      intensidad: ''
    };
    setFormData(prev => ({
      ...prev,
      contracciones: [...prev.contracciones, nuevaContraccion]
    }));
  };

  const agregarSignosVitales = () => {
    const nuevoSigno = {
      hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      presionArterial: '',
      pulso: '',
      temperatura: '',
      frecuenciaRespiratoria: ''
    };
    setFormData(prev => ({
      ...prev,
      signosVitales: [...prev.signosVitales, nuevoSigno]
    }));
  };

  const agregarMedicamento = () => {
    const nuevoMedicamento = {
      hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      medicamento: '',
      dosis: '',
      via: ''
    };
    setFormData(prev => ({
      ...prev,
      medicamentos: [...prev.medicamentos, nuevoMedicamento]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar campos obligatorios
      if (!formData.nombrePaciente || !formData.edad || !formData.numeroHistoria) {
        toast.error('Por favor complete los campos obligatorios');
        return;
      }

      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Partograma guardado exitosamente');
      console.log('Partograma guardado:', formData);
    } catch (error) {
      toast.error('Error al guardar el partograma');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Preparando impresión del partograma');
  };

  const actions = (
    <>
      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        Imprimir
      </Button>
      <Button size="sm" onClick={handleSubmit} disabled={isLoading}>
        <Save className="mr-2 h-4 w-4" />
        {isLoading ? 'Guardando...' : 'Guardar'}
      </Button>
    </>
  );

  return (
    <ModulePageLayout
      title="Partograma"
      description="Registro gráfico del trabajo de parto y parto"
      actions={actions}
      maxWidth="7xl"
      showBackButton={true}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos de Identificación */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Datos de Identificación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombrePaciente">Nombre Completo*</Label>
                <Input
                  id="nombrePaciente"
                  value={formData.nombrePaciente}
                  onChange={(e) => handleInputChange('nombrePaciente', e.target.value)}
                  placeholder="Nombre completo de la paciente"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edad">Edad*</Label>
                <Input
                  id="edad"
                  type="number"
                  value={formData.edad}
                  onChange={(e) => handleInputChange('edad', e.target.value)}
                  placeholder="Años"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroHistoria">No. Historia Clínica*</Label>
                <Input
                  id="numeroHistoria"
                  value={formData.numeroHistoria}
                  onChange={(e) => handleInputChange('numeroHistoria', e.target.value)}
                  placeholder="Número de historia"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange('fecha', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaIngreso">Hora de Ingreso</Label>
                <Input
                  id="horaIngreso"
                  type="time"
                  value={formData.horaIngreso}
                  onChange={(e) => handleInputChange('horaIngreso', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Datos Obstétricos */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5" />
              Datos Obstétricos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gravidez">Gravidez (G)</Label>
                <Input
                  id="gravidez"
                  type="number"
                  value={formData.gravidez}
                  onChange={(e) => handleInputChange('gravidez', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paridad">Paridad (P)</Label>
                <Input
                  id="paridad"
                  type="number"
                  value={formData.paridad}
                  onChange={(e) => handleInputChange('paridad', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abortos">Abortos (A)</Label>
                <Input
                  id="abortos"
                  type="number"
                  value={formData.abortos}
                  onChange={(e) => handleInputChange('abortos', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cesareas">Cesáreas (C)</Label>
                <Input
                  id="cesareas"
                  type="number"
                  value={formData.cesareas}
                  onChange={(e) => handleInputChange('cesareas', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fum">FUM (Fecha Última Menstruación)</Label>
                <Input
                  id="fum"
                  type="date"
                  value={formData.fum}
                  onChange={(e) => handleInputChange('fum', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fpp">FPP (Fecha Probable de Parto)</Label>
                <Input
                  id="fpp"
                  type="date"
                  value={formData.fpp}
                  onChange={(e) => handleInputChange('fpp', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edadGestacional">Edad Gestacional</Label>
                <Input
                  id="edadGestacional"
                  value={formData.edadGestacional}
                  onChange={(e) => handleInputChange('edadGestacional', e.target.value)}
                  placeholder="Semanas + Días (ej: 39+2)"
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Trabajo de Parto */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Inicio del Trabajo de Parto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horaInicioTrabajoParto">Hora Inicio Trabajo de Parto</Label>
                <Input
                  id="horaInicioTrabajoParto"
                  type="time"
                  value={formData.horaInicioTrabajoParto}
                  onChange={(e) => handleInputChange('horaInicioTrabajoParto', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaRupturaMembrana">Hora Ruptura de Membrana</Label>
                <Input
                  id="horaRupturaMembrana"
                  type="time"
                  value={formData.horaRupturaMembrana}
                  onChange={(e) => handleInputChange('horaRupturaMembrana', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="caracteristicasLiquido">Características del Líquido Amniótico</Label>
              <Select value={formData.caracteristicasLiquido} onValueChange={(value) => handleInputChange('caracteristicasLiquido', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar características" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claro">Claro</SelectItem>
                  <SelectItem value="meconial">Meconial</SelectItem>
                  <SelectItem value="sanguinolento">Sanguinolento</SelectItem>
                  <SelectItem value="purulento">Purulento</SelectItem>
                  <SelectItem value="fetido">Fétido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Tabs para Monitoreo */}
        <Tabs defaultValue="dilatacion" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dilatacion">Dilatación</TabsTrigger>
            <TabsTrigger value="fcf">FCF</TabsTrigger>
            <TabsTrigger value="contracciones">Contracciones</TabsTrigger>
            <TabsTrigger value="signos">Signos Vitales</TabsTrigger>
            <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
          </TabsList>

          {/* Dilatación Cervical */}
          <TabsContent value="dilatacion">
            <ModuleCard>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Dilatación y Borramiento Cervical
                </CardTitle>
                <Button type="button" size="sm" onClick={agregarDilatacion}>
                  Agregar Registro
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.dilataciones.map((dil, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                          <div className="space-y-2">
                            <Label>Hora</Label>
                            <Input
                              type="time"
                              value={dil.hora}
                              onChange={(e) => {
                                const newDilataciones = [...formData.dilataciones];
                                newDilataciones[index].hora = e.target.value;
                                setFormData(prev => ({ ...prev, dilataciones: newDilataciones }));
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Dilatación (cm)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              value={dil.dilatacion}
                              onChange={(e) => {
                                const newDilataciones = [...formData.dilataciones];
                                newDilataciones[index].dilatacion = e.target.value;
                                setFormData(prev => ({ ...prev, dilataciones: newDilataciones }));
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Borramiento (%)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={dil.borramiento}
                              onChange={(e) => {
                                const newDilataciones = [...formData.dilataciones];
                                newDilataciones[index].borramiento = e.target.value;
                                setFormData(prev => ({ ...prev, dilataciones: newDilataciones }));
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Posición</Label>
                            <Select
                              value={dil.posicion}
                              onValueChange={(value) => {
                                const newDilataciones = [...formData.dilataciones];
                                newDilataciones[index].posicion = value;
                                setFormData(prev => ({ ...prev, dilataciones: newDilataciones }));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Posición" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="posterior">Posterior</SelectItem>
                                <SelectItem value="central">Central</SelectItem>
                                <SelectItem value="anterior">Anterior</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Consistencia</Label>
                            <Select
                              value={dil.consistencia}
                              onValueChange={(value) => {
                                const newDilataciones = [...formData.dilataciones];
                                newDilataciones[index].consistencia = value;
                                setFormData(prev => ({ ...prev, dilataciones: newDilataciones }));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Consistencia" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="firme">Firme</SelectItem>
                                <SelectItem value="media">Media</SelectItem>
                                <SelectItem value="blanda">Blanda</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Altura</Label>
                            <Select
                              value={dil.altura}
                              onValueChange={(value) => {
                                const newDilataciones = [...formData.dilataciones];
                                newDilataciones[index].altura = value;
                                setFormData(prev => ({ ...prev, dilataciones: newDilataciones }));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Altura" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="-3">-3</SelectItem>
                                <SelectItem value="-2">-2</SelectItem>
                                <SelectItem value="-1">-1</SelectItem>
                                <SelectItem value="0">0</SelectItem>
                                <SelectItem value="+1">+1</SelectItem>
                                <SelectItem value="+2">+2</SelectItem>
                                <SelectItem value="+3">+3</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {formData.dilataciones.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay registros de dilatación. Haga clic en "Agregar Registro" para comenzar.
                    </div>
                  )}
                </div>
              </CardContent>
            </ModuleCard>
          </TabsContent>

          {/* Frecuencia Cardíaca Fetal */}
          <TabsContent value="fcf">
            <ModuleCard>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Frecuencia Cardíaca Fetal
                </CardTitle>
                <Button type="button" size="sm" onClick={agregarFrecuenciaCardiaca}>
                  Agregar Registro
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.frecuenciasCardiacas.map((fc, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Hora</Label>
                        <Input
                          type="time"
                          value={fc.hora}
                          onChange={(e) => {
                            const newFC = [...formData.frecuenciasCardiacas];
                            newFC[index].hora = e.target.value;
                            setFormData(prev => ({ ...prev, frecuenciasCardiacas: newFC }));
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>FCF (lat/min)</Label>
                        <Input
                          type="number"
                          min="60"
                          max="200"
                          value={fc.fcf}
                          onChange={(e) => {
                            const newFC = [...formData.frecuenciasCardiacas];
                            newFC[index].fcf = e.target.value;
                            setFormData(prev => ({ ...prev, frecuenciasCardiacas: newFC }));
                          }}
                          placeholder="120-160"
                        />
                      </div>
                    </div>
                  ))}
                  {formData.frecuenciasCardiacas.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay registros de FCF. Haga clic en "Agregar Registro" para comenzar.
                    </div>
                  )}
                </div>
              </CardContent>
            </ModuleCard>
          </TabsContent>

          {/* Contracciones */}
          <TabsContent value="contracciones">
            <ModuleCard>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Contracciones Uterinas
                </CardTitle>
                <Button type="button" size="sm" onClick={agregarContraccion}>
                  Agregar Registro
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.contracciones.map((cont, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Hora</Label>
                            <Input
                              type="time"
                              value={cont.hora}
                              onChange={(e) => {
                                const newContracciones = [...formData.contracciones];
                                newContracciones[index].hora = e.target.value;
                                setFormData(prev => ({ ...prev, contracciones: newContracciones }));
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Frecuencia (cada 10 min)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              value={cont.frecuencia}
                              onChange={(e) => {
                                const newContracciones = [...formData.contracciones];
                                newContracciones[index].frecuencia = e.target.value;
                                setFormData(prev => ({ ...prev, contracciones: newContracciones }));
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Duración (seg)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="120"
                              value={cont.duracion}
                              onChange={(e) => {
                                const newContracciones = [...formData.contracciones];
                                newContracciones[index].duracion = e.target.value;
                                setFormData(prev => ({ ...prev, contracciones: newContracciones }));
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Intensidad</Label>
                            <Select
                              value={cont.intensidad}
                              onValueChange={(value) => {
                                const newContracciones = [...formData.contracciones];
                                newContracciones[index].intensidad = value;
                                setFormData(prev => ({ ...prev, contracciones: newContracciones }));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Intensidad" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="leve">Leve</SelectItem>
                                <SelectItem value="moderada">Moderada</SelectItem>
                                <SelectItem value="fuerte">Fuerte</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {formData.contracciones.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay registros de contracciones. Haga clic en "Agregar Registro" para comenzar.
                    </div>
                  )}
                </div>
              </CardContent>
            </ModuleCard>
          </TabsContent>

          {/* Signos Vitales */}
          <TabsContent value="signos">
            <ModuleCard>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Signos Vitales Maternos
                </CardTitle>
                <Button type="button" size="sm" onClick={agregarSignosVitales}>
                  Agregar Registro
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.signosVitales.map((sv, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div className="space-y-2">
                            <Label>Hora</Label>
                            <Input
                              type="time"
                              value={sv.hora}
                              onChange={(e) => {
                                const newSV = [...formData.signosVitales];
                                newSV[index].hora = e.target.value;
                                setFormData(prev => ({ ...prev, signosVitales: newSV }));
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>P/A (mmHg)</Label>
                            <Input
                              value={sv.presionArterial}
                              onChange={(e) => {
                                const newSV = [...formData.signosVitales];
                                newSV[index].presionArterial = e.target.value;
                                setFormData(prev => ({ ...prev, signosVitales: newSV }));
                              }}
                              placeholder="120/80"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Pulso (lat/min)</Label>
                            <Input
                              type="number"
                              value={sv.pulso}
                              onChange={(e) => {
                                const newSV = [...formData.signosVitales];
                                newSV[index].pulso = e.target.value;
                                setFormData(prev => ({ ...prev, signosVitales: newSV }));
                              }}
                              placeholder="60-100"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Temperatura (°C)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={sv.temperatura}
                              onChange={(e) => {
                                const newSV = [...formData.signosVitales];
                                newSV[index].temperatura = e.target.value;
                                setFormData(prev => ({ ...prev, signosVitales: newSV }));
                              }}
                              placeholder="36.5"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>FR (resp/min)</Label>
                            <Input
                              type="number"
                              value={sv.frecuenciaRespiratoria}
                              onChange={(e) => {
                                const newSV = [...formData.signosVitales];
                                newSV[index].frecuenciaRespiratoria = e.target.value;
                                setFormData(prev => ({ ...prev, signosVitales: newSV }));
                              }}
                              placeholder="12-20"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {formData.signosVitales.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay registros de signos vitales. Haga clic en "Agregar Registro" para comenzar.
                    </div>
                  )}
                </div>
              </CardContent>
            </ModuleCard>
          </TabsContent>

          {/* Medicamentos */}
          <TabsContent value="medicamentos">
            <ModuleCard>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5" />
                  Medicamentos y Líquidos
                </CardTitle>
                <Button type="button" size="sm" onClick={agregarMedicamento}>
                  Agregar Medicamento
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.medicamentos.map((med, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label>Hora</Label>
                            <Input
                              type="time"
                              value={med.hora}
                              onChange={(e) => {
                                const newMed = [...formData.medicamentos];
                                newMed[index].hora = e.target.value;
                                setFormData(prev => ({ ...prev, medicamentos: newMed }));
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Medicamento</Label>
                            <Input
                              value={med.medicamento}
                              onChange={(e) => {
                                const newMed = [...formData.medicamentos];
                                newMed[index].medicamento = e.target.value;
                                setFormData(prev => ({ ...prev, medicamentos: newMed }));
                              }}
                              placeholder="Nombre del medicamento"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Dosis</Label>
                            <Input
                              value={med.dosis}
                              onChange={(e) => {
                                const newMed = [...formData.medicamentos];
                                newMed[index].dosis = e.target.value;
                                setFormData(prev => ({ ...prev, medicamentos: newMed }));
                              }}
                              placeholder="Dosis"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Vía</Label>
                            <Select
                              value={med.via}
                              onValueChange={(value) => {
                                const newMed = [...formData.medicamentos];
                                newMed[index].via = value;
                                setFormData(prev => ({ ...prev, medicamentos: newMed }));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Vía" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="iv">IV</SelectItem>
                                <SelectItem value="im">IM</SelectItem>
                                <SelectItem value="oral">Oral</SelectItem>
                                <SelectItem value="sublingual">Sublingual</SelectItem>
                                <SelectItem value="topica">Tópica</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {formData.medicamentos.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay medicamentos registrados. Haga clic en "Agregar Medicamento" para comenzar.
                    </div>
                  )}
                </div>
              </CardContent>
            </ModuleCard>
          </TabsContent>
        </Tabs>

        {/* Observaciones y Complicaciones */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Observaciones y Complicaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                placeholder="Observaciones generales del trabajo de parto..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complicaciones">Complicaciones</Label>
              <Textarea
                id="complicaciones"
                value={formData.complicaciones}
                onChange={(e) => handleInputChange('complicaciones', e.target.value)}
                placeholder="Registre cualquier complicación o evento adverso..."
                rows={4}
              />
            </div>
          </CardContent>
        </ModuleCard>

        {/* Resultados del Parto */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5" />
              Resultados del Parto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoParto">Tipo de Parto</Label>
                <Select value={formData.tipoParto} onValueChange={(value) => handleInputChange('tipoParto', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eutocico">Eutócico (Normal)</SelectItem>
                    <SelectItem value="forceps">Fórceps</SelectItem>
                    <SelectItem value="vacuum">Vacuum</SelectItem>
                    <SelectItem value="cesarea">Cesárea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaExpulsivo">Hora Período Expulsivo</Label>
                <Input
                  id="horaExpulsivo"
                  type="time"
                  value={formData.horaExpulsivo}
                  onChange={(e) => handleInputChange('horaExpulsivo', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaNacimiento">Hora de Nacimiento</Label>
                <Input
                  id="horaNacimiento"
                  type="time"
                  value={formData.horaNacimiento}
                  onChange={(e) => handleInputChange('horaNacimiento', e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sexoRN">Sexo del Recién Nacido</Label>
                <Select value={formData.sexoRN} onValueChange={(value) => handleInputChange('sexoRN', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="indeterminado">Indeterminado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pesoRN">Peso (gramos)</Label>
                <Input
                  id="pesoRN"
                  type="number"
                  value={formData.pesoRN}
                  onChange={(e) => handleInputChange('pesoRN', e.target.value)}
                  placeholder="3500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tallaRN">Talla (cm)</Label>
                <Input
                  id="tallaRN"
                  type="number"
                  value={formData.tallaRN}
                  onChange={(e) => handleInputChange('tallaRN', e.target.value)}
                  placeholder="50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apgar1">APGAR 1 min</Label>
                <Input
                  id="apgar1"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.apgar1}
                  onChange={(e) => handleInputChange('apgar1', e.target.value)}
                  placeholder="0-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apgar5">APGAR 5 min</Label>
                <Input
                  id="apgar5"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.apgar5}
                  onChange={(e) => handleInputChange('apgar5', e.target.value)}
                  placeholder="0-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apgar10">APGAR 10 min</Label>
                <Input
                  id="apgar10"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.apgar10}
                  onChange={(e) => handleInputChange('apgar10', e.target.value)}
                  placeholder="0-10"
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Personal Responsable */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Personal Responsable
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicoResponsable">Médico Responsable</Label>
                <Input
                  id="medicoResponsable"
                  value={formData.medicoResponsable}
                  onChange={(e) => handleInputChange('medicoResponsable', e.target.value)}
                  placeholder="Nombre del médico"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enfermera">Enfermera</Label>
                <Input
                  id="enfermera"
                  value={formData.enfermera}
                  onChange={(e) => handleInputChange('enfermera', e.target.value)}
                  placeholder="Nombre de la enfermera"
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>
      </form>
    </ModulePageLayout>
  );
}
