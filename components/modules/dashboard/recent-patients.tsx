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
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Pacientes Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {patients.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-muted-foreground">
              <User className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" />
              <p className="text-sm sm:text-base">No hay pacientes recientes</p>
            </div>
          ) : (
            patients.map((patient) => (
              <div key={patient.id} className="flex items-center space-x-3 sm:space-x-4 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${patient.name || 'Unknown'}`} />
                  <AvatarFallback className="text-xs sm:text-sm">
                    {patient.name ? patient.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'UN'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium leading-none truncate">{patient.name || 'Paciente sin nombre'}</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs text-muted-foreground truncate">
                      Registrado el {new Date(patient.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs flex-shrink-0">Nuevo</Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 