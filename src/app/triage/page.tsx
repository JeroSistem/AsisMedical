
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export default function TriagePage() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Formulario de Triage Médico</h2>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="centro-atencion">Centro de Atención / Hospital</Label>
                        <Input id="centro-atencion" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="fecha">Fecha</Label>
                        <Input id="fecha" type="date" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="hora-llegada">Hora de llegada</Label>
                        <Input id="hora-llegada" type="time" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre-paciente">Nombre del Paciente</Label>
                <Input id="nombre-paciente" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edad">Edad</Label>
                <Input id="edad" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                 <RadioGroup defaultValue="m" className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="m" id="sexo-m" />
                        <Label htmlFor="sexo-m">M</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="f" id="sexo-f" />
                        <Label htmlFor="sexo-f">F</Label>
                    </div>
                </RadioGroup>
              </div>
              <div className="space-y-2 col-span-full md:col-span-1">
                <Label htmlFor="identificacion">Identificación</Label>
                <Input id="identificacion" />
              </div>
            </CardContent>
          </Card>
        
          <Card>
            <CardHeader><CardTitle>1. Motivo de Consulta</CardTitle></CardHeader>
            <CardContent><Textarea placeholder="Describa el motivo de la consulta..." /></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>2. Signos Vitales</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className="space-y-2"><Label htmlFor="fc">Frecuencia Cardiaca (FC)</Label><Input id="fc" placeholder="lpm" /></div>
                <div className="space-y-2"><Label htmlFor="fr">Frecuencia Respiratoria (FR)</Label><Input id="fr" placeholder="rpm" /></div>
                <div className="space-y-2"><Label htmlFor="pa">Presión Arterial (PA)</Label><Input id="pa" placeholder="mmHg" /></div>
                <div className="space-y-2"><Label htmlFor="temp">Temperatura</Label><Input id="temp" placeholder="°C" /></div>
                <div className="space-y-2"><Label htmlFor="spo2">Saturación de Oxígeno (SpO₂)</Label><Input id="spo2" placeholder="%" /></div>
                <div className="space-y-2"><Label htmlFor="glucemia">Glucemia (si aplica)</Label><Input id="glucemia" placeholder="mg/dL" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>3. Nivel de Conciencia (Escala AVPU)</CardTitle></CardHeader>
            <CardContent>
                 <RadioGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="a" id="avpu-a" /><Label htmlFor="avpu-a">A - Alerta</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="v" id="avpu-v" /><Label htmlFor="avpu-v">V - Responde a Voz</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="p" id="avpu-p" /><Label htmlFor="avpu-p">P - Responde a Dolor</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="u" id="avpu-u" /><Label htmlFor="avpu-u">U - No responde</Label></div>
                </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>4. Dolor</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="flex items-center space-x-2">
                    <Checkbox id="no-dolor" />
                    <Label htmlFor="no-dolor">No hay dolor</Label>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="escala-dolor">Escala de dolor (0-10)</Label>
                    <Input id="escala-dolor" type="number" min="0" max="10" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="localizacion-dolor">Localización</Label>
                    <Input id="localizacion-dolor" />
                </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader><CardTitle>5. Clasificación de Triage</CardTitle></CardHeader>
            <CardContent>
                <RadioGroup className="grid grid-cols-1 gap-4">
                    <Label>Categoría asignada:</Label>
                    <div className="flex flex-wrap gap-4">
                        <TriageCategory color="bg-red-500" value="i" title="I - Rojo" description="Crítico, requiere atención inmediata" />
                        <TriageCategory color="bg-orange-500" value="ii" title="II - Naranja" description="Grave, pero estable" />
                        <TriageCategory color="bg-yellow-400" value="iii" title="III - Amarillo" description="Moderado" />
                        <TriageCategory color="bg-green-500" value="iv" title="IV - Verde" description="Leve" />
                        <TriageCategory color="bg-black" value="v" title="V - Negro" description="Fallecido / sin esperanza" />
                    </div>
                </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>6. Observaciones del Profesional de Triage</CardTitle></CardHeader>
            <CardContent><Textarea /></CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>7. Profesional que realiza el triage</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="nombre-profesional">Nombre</Label>
                    <Input id="nombre-profesional" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="cargo-profesional">Cargo</Label>
                    <Input id="cargo-profesional" />
                </div>
                 <div className="space-y-2 col-span-full">
                    <Label>Firma</Label>
                    <div className="border bg-slate-100 rounded-md h-32">
                        {/* Signature Pad Component would go here */}
                    </div>
                 </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button size="lg">Guardar Triage</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function TriageCategory({ color, value, title, description }: { color: string, value: string, title: string, description: string }) {
    return (
        <Label htmlFor={`triage-${value}`} className="flex items-center gap-4 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 has-[:checked]:bg-muted has-[:checked]:border-primary">
            <RadioGroupItem value={value} id={`triage-${value}`} />
            <div className="flex items-center gap-3">
                <span className={`h-8 w-8 rounded-full ${color}`}></span>
                <div>
                    <p className="font-bold">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
        </Label>
    )
}
