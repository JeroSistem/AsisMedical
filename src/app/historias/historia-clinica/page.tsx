
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

export default function HistoriaClinicaPage() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Crear Nueva Historia Clínica</h2>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Datos del Paciente</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre-completo">Nombre completo</Label>
                <Input id="nombre-completo" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edad">Edad</Label>
                <Input id="edad" placeholder="38" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genero">Género</Label>
                <Input id="genero" placeholder="Masculino" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identificacion">Número de identificación</Label>
                <Input id="identificacion" placeholder="123456789" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" placeholder="Calle Falsa 123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" placeholder="+57 300 1234567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ocupacion">Ocupación</Label>
                <Input id="ocupacion" placeholder="Ingeniero de Software" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aseguradora">Aseguradora</Label>
                <Input id="aseguradora" placeholder="Seguros Médicos ABC" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Motivo de Consulta (MC)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Describa el motivo principal de la consulta..." />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Antecedentes Personales y Familiares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="antecedentes-medicos" className="font-semibold">Antecedentes médicos (enfermedades previas)</Label>
                <Textarea id="antecedentes-medicos" placeholder="Diabetes, hipertensión, alergias, etc." />
              </div>
              <div>
                <Label htmlFor="antecedentes-quirurgicos" className="font-semibold">Antecedentes quirúrgicos</Label>
                <Textarea id="antecedentes-quirurgicos" placeholder="Cirugías anteriores" />
              </div>
              <div>
                <Label htmlFor="antecedentes-familiares" className="font-semibold">Antecedentes familiares</Label>
                <Textarea id="antecedentes-familiares" placeholder="Enfermedades relevantes en familiares directos" />
              </div>
              <div>
                <Label htmlFor="habitos" className="font-semibold">Hábitos</Label>
                <Textarea id="habitos" placeholder="Tabaco, alcohol, drogas, dieta, ejercicio" />
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>4. Historia de la Enfermedad Actual (HEA)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Cronología detallada de los síntomas: cuándo empezaron, cómo evolucionaron, tratamientos previos, etc." />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Examen Físico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="tension-arterial">Tensión arterial</Label>
                        <Input id="tension-arterial" placeholder="120/80 mmHg"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="frecuencia-cardiaca">Frecuencia cardíaca</Label>
                        <Input id="frecuencia-cardiaca" placeholder="75 lpm"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="temperatura">Temperatura</Label>
                        <Input id="temperatura" placeholder="36.5 °C"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="saturacion">Saturación de O₂</Label>
                        <Input id="saturacion" placeholder="98%"/>
                    </div>
               </div>
               <Separator />
               <div>
                <Label htmlFor="examen-sistemas" className="font-semibold">Examen por sistemas</Label>
                <Textarea id="examen-sistemas" placeholder="Cabeza y cuello, Cardiopulmonar, Abdomen, Extremidades, Neurológico, Piel, etc." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Diagnóstico Presuntivo o Definitivo</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Hipótesis o conclusión médica basada en los datos recogidos." />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Plan de Tratamiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                <Label htmlFor="medicamentos" className="font-semibold">Medicamentos recetados</Label>
                <Textarea id="medicamentos" placeholder="Nombre, dosis, frecuencia..." />
              </div>
               <div>
                <Label htmlFor="estudios" className="font-semibold">Estudios complementarios solicitados</Label>
                <Textarea id="estudios" placeholder="Laboratorio, rayos X, etc." />
              </div>
               <div>
                <Label htmlFor="recomendaciones" className="font-semibold">Recomendaciones</Label>
                <Textarea id="recomendaciones" placeholder="Reposo, dieta, seguimiento..." />
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>8. Evolución y Notas Adicionales</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Registro de visitas posteriores, cambios en el tratamiento o evolución del paciente." />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Firma del Profesional</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="nombre-profesional">Nombre del profesional</Label>
                    <Input id="nombre-profesional" placeholder="Dr. Juan Pérez" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="licencia-profesional">Número de licencia</Label>
                    <Input id="licencia-profesional" placeholder="12345" />
                </div>
                 <div className="space-y-2 col-span-full">
                    <Label htmlFor="firma-profesional">Firma</Label>
                    <div className="border bg-slate-100 rounded-md h-32">
                        {/* Signature Pad Component would go here */}
                    </div>
                 </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button size="lg">Guardar Historia Clínica</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
