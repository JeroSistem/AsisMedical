'use client';

import React, { useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Save, 
  Printer, 
  User,
  Stethoscope,
  FileText,
  Pill,
  Calendar,
  AlertCircle,
  Activity,
  ClipboardList,
  ThermometerSun,
  Heart
} from 'lucide-react';

interface EvolucionAmbulatoriaData {
  // Datos de identificación
  pacienteId: string;
  nombrePaciente: string;
  edad: string;
  numeroHistoria: string;
  fecha: string;
  hora: string;
  
  // Datos de la consulta
  motivoConsulta: string;
  enfermedadActual: string;
  
  // Revisión por sistemas
  sistemaNervioso: string;
  sistemaCardiovascular: string;
  sistemaRespiratorio: string;
  sistemaDigestivo: string;
  sistemaUrinario: string;
  sistemaMusculoEsqueletico: string;
  sistemaDermico: string;
  
  // Examen físico
  estadoGeneral: string;
  
  // Signos vitales
  presionArterial: string;
  frecuenciaCardiaca: string;
  frecuenciaRespiratoria: string;
  temperatura: string;
  saturacionOxigeno: string;
  peso: string;
  talla: string;
  imc: string;
  
  // Examen físico por sistemas
  cabezaCuello: string;
  torax: string;
  abdomen: string;
  extremidades: string;
  neurologico: string;
  piel: string;
  
  // Diagnósticos
  diagnosticoPrincipal: string;
  codigoCIE10Principal: string;
  diagnosticosSecundarios: Array<{
    diagnostico: string;
    codigo: string;
  }>;
  
  // Análisis y plan
  analisis: string;
  planManejo: string;
  
  // Medicamentos
  medicamentos: Array<{
    medicamento: string;
    dosis: string;
    via: string;
    frecuencia: string;
    duracion: string;
  }>;
  
  // Exámenes solicitados
  examenes: string;
  
  // Interconsultas
  interconsultas: string;
  
  // Recomendaciones y educación
  recomendaciones: string;
  educacion: string;
  
  // Seguimiento
  proximaCita: string;
  motivoProximaCita: string;
  
  // Observaciones
  observaciones: string;
  
  // Personal
  medicoTratante: string;
  especialidad: string;
  registroMedico: string;
}

export default function EvolucionAmbulatoriaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EvolucionAmbulatoriaData>({
    pacienteId: '',
    nombrePaciente: '',
    edad: '',
    numeroHistoria: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    motivoConsulta: '',
    enfermedadActual: '',
    sistemaNervioso: 'Sin alteraciones',
    sistemaCardiovascular: 'Sin alteraciones',
    sistemaRespiratorio: 'Sin alteraciones',
    sistemaDigestivo: 'Sin alteraciones',
    sistemaUrinario: 'Sin alteraciones',
    sistemaMusculoEsqueletico: 'Sin alteraciones',
    sistemaDermico: 'Sin alteraciones',
    estadoGeneral: '',
    presionArterial: '',
    frecuenciaCardiaca: '',
    frecuenciaRespiratoria: '',
    temperatura: '',
    saturacionOxigeno: '',
    peso: '',
    talla: '',
    imc: '',
    cabezaCuello: '',
    torax: '',
    abdomen: '',
    extremidades: '',
    neurologico: '',
    piel: '',
    diagnosticoPrincipal: '',
    codigoCIE10Principal: '',
    diagnosticosSecundarios: [],
    analisis: '',
    planManejo: '',
    medicamentos: [],
    examenes: '',
    interconsultas: '',
    recomendaciones: '',
    educacion: '',
    proximaCita: '',
    motivoProximaCita: '',
    observaciones: '',
    medicoTratante: '',
    especialidad: '',
    registroMedico: ''
  });

  const handleInputChange = (field: keyof EvolucionAmbulatoriaData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calcular IMC automáticamente
  const calcularIMC = (peso: string, talla: string) => {
    const pesoNum = parseFloat(peso);
    const tallaNum = parseFloat(talla) / 100; // Convertir cm a metros
    
    if (pesoNum > 0 && tallaNum > 0) {
      const imc = (pesoNum / (tallaNum * tallaNum)).toFixed(2);
      setFormData(prev => ({ ...prev, imc }));
    }
  };

  const handlePesoChange = (value: string) => {
    handleInputChange('peso', value);
    if (formData.talla) {
      calcularIMC(value, formData.talla);
    }
  };

  const handleTallaChange = (value: string) => {
    handleInputChange('talla', value);
    if (formData.peso) {
      calcularIMC(formData.peso, value);
    }
  };

  const agregarDiagnosticoSecundario = () => {
    const nuevoDiagnostico = {
      diagnostico: '',
      codigo: ''
    };
    setFormData(prev => ({
      ...prev,
      diagnosticosSecundarios: [...prev.diagnosticosSecundarios, nuevoDiagnostico]
    }));
  };

  const agregarMedicamento = () => {
    const nuevoMedicamento = {
      medicamento: '',
      dosis: '',
      via: '',
      frecuencia: '',
      duracion: ''
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
      if (!formData.nombrePaciente || !formData.numeroHistoria || !formData.motivoConsulta) {
        toast.error('Por favor complete los campos obligatorios');
        return;
      }

      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Evolución ambulatoria guardada exitosamente');
      console.log('Evolución guardada:', formData);
    } catch (error) {
      toast.error('Error al guardar la evolución ambulatoria');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success('Preparando impresión de la evolución ambulatoria');
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
      title="Evolución Ambulatoria"
      description="Registro de consulta y seguimiento ambulatorio"
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
                  placeholder="Nombre completo del paciente"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edad">Edad*</Label>
                <Input
                  id="edad"
                  value={formData.edad}
                  onChange={(e) => handleInputChange('edad', e.target.value)}
                  placeholder="Edad del paciente"
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
                <Label htmlFor="fecha">Fecha de Consulta</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange('fecha', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora">Hora de Consulta</Label>
                <Input
                  id="hora"
                  type="time"
                  value={formData.hora}
                  onChange={(e) => handleInputChange('hora', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Motivo de Consulta y Enfermedad Actual */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Motivo de Consulta y Enfermedad Actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motivoConsulta">Motivo de Consulta*</Label>
              <Textarea
                id="motivoConsulta"
                value={formData.motivoConsulta}
                onChange={(e) => handleInputChange('motivoConsulta', e.target.value)}
                placeholder="Describa el motivo principal de la consulta..."
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enfermedadActual">Enfermedad Actual</Label>
              <Textarea
                id="enfermedadActual"
                value={formData.enfermedadActual}
                onChange={(e) => handleInputChange('enfermedadActual', e.target.value)}
                placeholder="Historia detallada de la enfermedad actual..."
                rows={5}
              />
            </div>
          </CardContent>
        </ModuleCard>

        {/* Revisión por Sistemas */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Revisión por Sistemas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sistemaNervioso">Sistema Nervioso</Label>
                <Input
                  id="sistemaNervioso"
                  value={formData.sistemaNervioso}
                  onChange={(e) => handleInputChange('sistemaNervioso', e.target.value)}
                  placeholder="Sin alteraciones"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sistemaCardiovascular">Sistema Cardiovascular</Label>
                <Input
                  id="sistemaCardiovascular"
                  value={formData.sistemaCardiovascular}
                  onChange={(e) => handleInputChange('sistemaCardiovascular', e.target.value)}
                  placeholder="Sin alteraciones"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sistemaRespiratorio">Sistema Respiratorio</Label>
                <Input
                  id="sistemaRespiratorio"
                  value={formData.sistemaRespiratorio}
                  onChange={(e) => handleInputChange('sistemaRespiratorio', e.target.value)}
                  placeholder="Sin alteraciones"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sistemaDigestivo">Sistema Digestivo</Label>
                <Input
                  id="sistemaDigestivo"
                  value={formData.sistemaDigestivo}
                  onChange={(e) => handleInputChange('sistemaDigestivo', e.target.value)}
                  placeholder="Sin alteraciones"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sistemaUrinario">Sistema Urinario</Label>
                <Input
                  id="sistemaUrinario"
                  value={formData.sistemaUrinario}
                  onChange={(e) => handleInputChange('sistemaUrinario', e.target.value)}
                  placeholder="Sin alteraciones"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sistemaMusculoEsqueletico">Sistema Músculo-Esquelético</Label>
                <Input
                  id="sistemaMusculoEsqueletico"
                  value={formData.sistemaMusculoEsqueletico}
                  onChange={(e) => handleInputChange('sistemaMusculoEsqueletico', e.target.value)}
                  placeholder="Sin alteraciones"
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Signos Vitales */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Signos Vitales y Antropometría
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="estadoGeneral">Estado General</Label>
              <Select value={formData.estadoGeneral} onValueChange={(value) => handleInputChange('estadoGeneral', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado general" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bueno">Bueno</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="malo">Malo</SelectItem>
                  <SelectItem value="critico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="presionArterial">P/A (mmHg)</Label>
                <Input
                  id="presionArterial"
                  value={formData.presionArterial}
                  onChange={(e) => handleInputChange('presionArterial', e.target.value)}
                  placeholder="120/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frecuenciaCardiaca">FC (lat/min)</Label>
                <Input
                  id="frecuenciaCardiaca"
                  type="number"
                  value={formData.frecuenciaCardiaca}
                  onChange={(e) => handleInputChange('frecuenciaCardiaca', e.target.value)}
                  placeholder="70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frecuenciaRespiratoria">FR (resp/min)</Label>
                <Input
                  id="frecuenciaRespiratoria"
                  type="number"
                  value={formData.frecuenciaRespiratoria}
                  onChange={(e) => handleInputChange('frecuenciaRespiratoria', e.target.value)}
                  placeholder="16"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperatura">Temperatura (°C)</Label>
                <Input
                  id="temperatura"
                  type="number"
                  step="0.1"
                  value={formData.temperatura}
                  onChange={(e) => handleInputChange('temperatura', e.target.value)}
                  placeholder="36.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="saturacionOxigeno">SpO2 (%)</Label>
                <Input
                  id="saturacionOxigeno"
                  type="number"
                  value={formData.saturacionOxigeno}
                  onChange={(e) => handleInputChange('saturacionOxigeno', e.target.value)}
                  placeholder="98"
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  value={formData.peso}
                  onChange={(e) => handlePesoChange(e.target.value)}
                  placeholder="70.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="talla">Talla (cm)</Label>
                <Input
                  id="talla"
                  type="number"
                  value={formData.talla}
                  onChange={(e) => handleTallaChange(e.target.value)}
                  placeholder="170"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imc">IMC (kg/m²)</Label>
                <Input
                  id="imc"
                  value={formData.imc}
                  readOnly
                  placeholder="Calculado automáticamente"
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Examen Físico */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Examen Físico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cabezaCuello">Cabeza y Cuello</Label>
                <Textarea
                  id="cabezaCuello"
                  value={formData.cabezaCuello}
                  onChange={(e) => handleInputChange('cabezaCuello', e.target.value)}
                  placeholder="Hallazgos del examen de cabeza y cuello..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="torax">Tórax</Label>
                <Textarea
                  id="torax"
                  value={formData.torax}
                  onChange={(e) => handleInputChange('torax', e.target.value)}
                  placeholder="Hallazgos del examen del tórax..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abdomen">Abdomen</Label>
                <Textarea
                  id="abdomen"
                  value={formData.abdomen}
                  onChange={(e) => handleInputChange('abdomen', e.target.value)}
                  placeholder="Hallazgos del examen del abdomen..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extremidades">Extremidades</Label>
                <Textarea
                  id="extremidades"
                  value={formData.extremidades}
                  onChange={(e) => handleInputChange('extremidades', e.target.value)}
                  placeholder="Hallazgos del examen de extremidades..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neurologico">Examen Neurológico</Label>
                <Textarea
                  id="neurologico"
                  value={formData.neurologico}
                  onChange={(e) => handleInputChange('neurologico', e.target.value)}
                  placeholder="Hallazgos del examen neurológico..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="piel">Piel y Faneras</Label>
                <Textarea
                  id="piel"
                  value={formData.piel}
                  onChange={(e) => handleInputChange('piel', e.target.value)}
                  placeholder="Hallazgos del examen de piel..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Diagnósticos */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Diagnósticos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosticoPrincipal">Diagnóstico Principal*</Label>
                <Textarea
                  id="diagnosticoPrincipal"
                  value={formData.diagnosticoPrincipal}
                  onChange={(e) => handleInputChange('diagnosticoPrincipal', e.target.value)}
                  placeholder="Diagnóstico principal..."
                  rows={2}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigoCIE10Principal">Código CIE-10*</Label>
                <Input
                  id="codigoCIE10Principal"
                  value={formData.codigoCIE10Principal}
                  onChange={(e) => handleInputChange('codigoCIE10Principal', e.target.value)}
                  placeholder="Ej: J00.0"
                  required
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label>Diagnósticos Secundarios</Label>
              <Button type="button" size="sm" variant="outline" onClick={agregarDiagnosticoSecundario}>
                Agregar Diagnóstico
              </Button>
            </div>

            {formData.diagnosticosSecundarios.map((diag, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Diagnóstico {index + 2}</Label>
                  <Textarea
                    value={diag.diagnostico}
                    onChange={(e) => {
                      const newDiag = [...formData.diagnosticosSecundarios];
                      newDiag[index].diagnostico = e.target.value;
                      setFormData(prev => ({ ...prev, diagnosticosSecundarios: newDiag }));
                    }}
                    placeholder="Descripción del diagnóstico..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Código CIE-10</Label>
                  <Input
                    value={diag.codigo}
                    onChange={(e) => {
                      const newDiag = [...formData.diagnosticosSecundarios];
                      newDiag[index].codigo = e.target.value;
                      setFormData(prev => ({ ...prev, diagnosticosSecundarios: newDiag }));
                    }}
                    placeholder="Código"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </ModuleCard>

        {/* Análisis y Plan */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Análisis y Plan de Manejo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="analisis">Análisis</Label>
              <Textarea
                id="analisis"
                value={formData.analisis}
                onChange={(e) => handleInputChange('analisis', e.target.value)}
                placeholder="Análisis del caso clínico..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="planManejo">Plan de Manejo</Label>
              <Textarea
                id="planManejo"
                value={formData.planManejo}
                onChange={(e) => handleInputChange('planManejo', e.target.value)}
                placeholder="Plan terapéutico y seguimiento..."
                rows={4}
              />
            </div>
          </CardContent>
        </ModuleCard>

        {/* Medicamentos */}
        <ModuleCard>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Medicamentos Formulados
            </CardTitle>
            <Button type="button" size="sm" variant="outline" onClick={agregarMedicamento}>
              Agregar Medicamento
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.medicamentos.map((med, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Label>Medicamento</Label>
                        <Input
                          value={med.medicamento}
                          onChange={(e) => {
                            const newMed = [...formData.medicamentos];
                            newMed[index].medicamento = e.target.value;
                            setFormData(prev => ({ ...prev, medicamentos: newMed }));
                          }}
                          placeholder="Nombre genérico"
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
                          placeholder="500 mg"
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
                            <SelectItem value="oral">Oral</SelectItem>
                            <SelectItem value="sublingual">Sublingual</SelectItem>
                            <SelectItem value="topica">Tópica</SelectItem>
                            <SelectItem value="oftálmica">Oftálmica</SelectItem>
                            <SelectItem value="otica">Ótica</SelectItem>
                            <SelectItem value="nasal">Nasal</SelectItem>
                            <SelectItem value="inhalatoria">Inhalatoria</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Frecuencia</Label>
                        <Input
                          value={med.frecuencia}
                          onChange={(e) => {
                            const newMed = [...formData.medicamentos];
                            newMed[index].frecuencia = e.target.value;
                            setFormData(prev => ({ ...prev, medicamentos: newMed }));
                          }}
                          placeholder="Cada 8 horas"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duración</Label>
                        <Input
                          value={med.duracion}
                          onChange={(e) => {
                            const newMed = [...formData.medicamentos];
                            newMed[index].duracion = e.target.value;
                            setFormData(prev => ({ ...prev, medicamentos: newMed }));
                          }}
                          placeholder="7 días"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {formData.medicamentos.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No hay medicamentos formulados. Haga clic en "Agregar Medicamento" para comenzar.
                </div>
              )}
            </div>
          </CardContent>
        </ModuleCard>

        {/* Exámenes e Interconsultas */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Exámenes e Interconsultas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="examenes">Exámenes Solicitados</Label>
              <Textarea
                id="examenes"
                value={formData.examenes}
                onChange={(e) => handleInputChange('examenes', e.target.value)}
                placeholder="Liste los exámenes de laboratorio, imágenes u otros estudios solicitados..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interconsultas">Interconsultas</Label>
              <Textarea
                id="interconsultas"
                value={formData.interconsultas}
                onChange={(e) => handleInputChange('interconsultas', e.target.value)}
                placeholder="Especialidades a las que se remite el paciente..."
                rows={3}
              />
            </div>
          </CardContent>
        </ModuleCard>

        {/* Recomendaciones y Educación */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recomendaciones y Educación al Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recomendaciones">Recomendaciones Generales</Label>
              <Textarea
                id="recomendaciones"
                value={formData.recomendaciones}
                onChange={(e) => handleInputChange('recomendaciones', e.target.value)}
                placeholder="Recomendaciones sobre estilo de vida, dieta, actividad física, etc..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="educacion">Educación al Paciente</Label>
              <Textarea
                id="educacion"
                value={formData.educacion}
                onChange={(e) => handleInputChange('educacion', e.target.value)}
                placeholder="Información educativa sobre su condición, signos de alarma, etc..."
                rows={4}
              />
            </div>
          </CardContent>
        </ModuleCard>

        {/* Seguimiento */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Seguimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proximaCita">Fecha Próxima Cita</Label>
                <Input
                  id="proximaCita"
                  type="date"
                  value={formData.proximaCita}
                  onChange={(e) => handleInputChange('proximaCita', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivoProximaCita">Motivo de Próxima Cita</Label>
                <Input
                  id="motivoProximaCita"
                  value={formData.motivoProximaCita}
                  onChange={(e) => handleInputChange('motivoProximaCita', e.target.value)}
                  placeholder="Control, resultados de exámenes, etc."
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>

        {/* Observaciones */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Observaciones Adicionales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                placeholder="Cualquier observación adicional relevante..."
                rows={4}
              />
            </div>
          </CardContent>
        </ModuleCard>

        {/* Personal Médico */}
        <ModuleCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Médico Tratante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicoTratante">Nombre del Médico</Label>
                <Input
                  id="medicoTratante"
                  value={formData.medicoTratante}
                  onChange={(e) => handleInputChange('medicoTratante', e.target.value)}
                  placeholder="Nombre completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="especialidad">Especialidad</Label>
                <Input
                  id="especialidad"
                  value={formData.especialidad}
                  onChange={(e) => handleInputChange('especialidad', e.target.value)}
                  placeholder="Especialidad médica"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registroMedico">Registro Médico</Label>
                <Input
                  id="registroMedico"
                  value={formData.registroMedico}
                  onChange={(e) => handleInputChange('registroMedico', e.target.value)}
                  placeholder="Número de registro"
                />
              </div>
            </div>
          </CardContent>
        </ModuleCard>
      </form>
    </ModulePageLayout>
  );
}
