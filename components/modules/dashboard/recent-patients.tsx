"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

interface RecentPatient {
  id: string;
  name: string;
  createdAt: string;
}

interface RecentPatientsProps {
  patients: RecentPatient[];
}

export function RecentPatients({ patients }: RecentPatientsProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Pacientes Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-8 w-8 mx-auto mb-2" />
              <p>No hay pacientes recientes</p>
            </div>
          ) : (
            patients.map((patient) => (
              <div key={patient.id} className="flex items-center space-x-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${patient.name}`} />
                  <AvatarFallback>
                    {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{patient.name}</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Registrado el {new Date(patient.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Nuevo</Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 