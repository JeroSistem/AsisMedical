'use client';

import React from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdmisionesPage() {
  const actions = (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Nueva Admisión
    </Button>
  );

  return (
    <ModulePageLayout
      title="Gestión de Admisiones"
      description="Sistema de gestión de admisiones hospitalarias"
      actions={actions}
      maxWidth="7xl"
    >
      <ModuleCard>
        <div className="text-center space-y-4 py-8">
          <p className="text-gray-600 text-lg">
            Sistema de gestión de admisiones hospitalarias en desarrollo
          </p>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-5 w-5 mr-2" />
            Nueva Admisión
          </Button>
        </div>
      </ModuleCard>
    </ModulePageLayout>
  );
}
