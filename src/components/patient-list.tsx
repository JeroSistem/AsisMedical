
'use client';

import * as React from 'react';
import { Patient } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

export function PatientList({ patients }: { patients: Patient[] }) {
  const [search, setSearch] = React.useState('');
  const router = useRouter();

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.id.includes(search)
  );

  const handleRowClick = (patientId: string) => {
    router.push(`/patients/${patientId}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <Input
          placeholder="Buscar por nombre o ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Género</TableHead>
              <TableHead>Fecha de Nacimiento</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead className="text-right">ID de Paciente</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow
                key={patient.id}
                onClick={() => handleRowClick(patient.id)}
                className="cursor-pointer"
              >
                <TableCell>
                  <Avatar>
                    <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person" />
                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>
                  <Badge variant={patient.gender === 'Female' ? 'secondary' : 'outline'}>
                    {patient.gender}
                  </Badge>
                </TableCell>
                <TableCell>{patient.dateOfBirth}</TableCell>
                <TableCell>{patient.contact}</TableCell>
                <TableCell className="text-right font-mono">{patient.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredPatients.length === 0 && (
         <div className="text-center p-8 text-muted-foreground">
            No se encontraron pacientes.
         </div>
       )}
    </div>
  );
}
