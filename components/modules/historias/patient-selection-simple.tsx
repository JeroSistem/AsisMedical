'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, CheckCircle } from 'lucide-react';

export function PatientSelectionSimple() {
  return (
    <div className="space-y-4">
      {/* Lista de Pacientes */}
      <div className="space-y-3">
        {/* Paciente 1 */}
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold">María González</h4>
                  <p className="text-sm text-muted-foreground">CC: 12345678 • 45 años</p>
                  <p className="text-sm text-muted-foreground">Admisión: 10:30 AM</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="destructive">Urgencia Alta</Badge>
                <Button size="sm" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Atender
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
