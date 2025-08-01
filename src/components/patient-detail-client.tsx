'use client';
import { Patient, MedicalRecord } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from './ui/button';
import { FileText, HeartPulse, FlaskConical, Upload } from 'lucide-react';
import { AiSummary } from './ai-summary';

export function PatientDetailClient({
  patient,
  medicalRecord,
}: {
  patient: Patient;
  medicalRecord: MedicalRecord;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar className="h-20 w-20">
            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person" />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <CardTitle className="text-2xl">{patient.name}</CardTitle>
            <CardDescription>
              {patient.gender}, Fecha de Nac: {patient.dateOfBirth}
            </CardDescription>
            <p className="text-sm text-muted-foreground">{patient.address}</p>
            <p className="text-sm text-muted-foreground">Contacto: {patient.contact}</p>
          </div>
        </CardHeader>
      </Card>

      <AiSummary medicalRecord={medicalRecord} />

      <Tabs defaultValue="history">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">
            <HeartPulse className="mr-2 h-4 w-4" /> Historia Clínica
          </TabsTrigger>
          <TabsTrigger value="diagnostics">
            <FlaskConical className="mr-2 h-4 w-4" /> Diagnósticos y Tratamientos
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" /> Documentos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historia Clínica y Estado Actual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Antecedentes Médicos</h4>
                <p className="text-muted-foreground">{medicalRecord.medicalHistory}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Estado Actual</h4>
                <p className="text-muted-foreground">{medicalRecord.currentStatus}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="diagnostics">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Diagnósticos y Tratamientos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Diagnósticos</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Médico</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicalRecord.diagnoses.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell>{d.date}</TableCell>
                        <TableCell>{d.code}</TableCell>
                        <TableCell>{d.description}</TableCell>
                        <TableCell>{d.physician}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tratamientos</h4>
                <Table>
                   <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Procedimiento / Medicamento</TableHead>
                      <TableHead>Médico</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medicalRecord.treatments.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.date}</TableCell>
                        <TableCell>
                          <p>{t.procedure}</p>
                          {t.medication && <p className="text-xs text-muted-foreground">{t.medication} ({t.dosage})</p>}
                        </TableCell>
                        <TableCell>{t.physician}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Adjuntos</CardTitle>
              <CardDescription>
                Resultados de laboratorio, informes de imágenes y otros documentos médicos relevantes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>
                  <Upload className="mr-2 h-4 w-4" /> Subir Documento
                </Button>
              </div>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicalRecord.documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.title}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Ver</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
               {medicalRecord.documents.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    No hay documentos adjuntos.
                </div>
               )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
