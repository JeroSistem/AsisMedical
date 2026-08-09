'use client';

import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText,
  Users,
  Plus
} from 'lucide-react';
import { PatientSelection } from '@/components/modules/historias/patient-selection';

export default function HistoriasPage() {
  return (
    <ModulePageLayout
      title="Historias clínicas"
      description="EHR y selección de pacientes — Clinical Precision"
      maxWidth="7xl"
    >
      {/* Sistema de Pestañas Principal */}
      <ModuleCard>
        <Tabs defaultValue="historia-clinica" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="historia-clinica" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Historia Clínica</span>
            </TabsTrigger>
            <TabsTrigger value="seleccion" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Selección</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Pestaña: Historia Clínica */}
          <TabsContent value="historia-clinica" className="space-y-4 mt-6">
            <div className="text-center py-8">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Crear Nueva Historia Clínica</h3>
              <p className="text-muted-foreground mb-4">
                Accede al formulario completo para crear una nueva historia clínica
              </p>
              <Button asChild size="lg">
                <a href="/historias/historia-clinica">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Historia Clínica
                </a>
              </Button>
            </div>
          </TabsContent>
          
          {/* Pestaña: Selección */}
          <TabsContent value="seleccion" className="space-y-4 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Pacientes Admitidos y Listos para Atender</span>
              </h3>
              <PatientSelection />
            </div>
          </TabsContent>
        </Tabs>
      </ModuleCard>
    </ModulePageLayout>
  );
}
