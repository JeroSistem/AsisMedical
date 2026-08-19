'use client';

import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout'
import { SubmoduleFormPage } from '@/components/shared/submodule-form-page';

export default function FacturacionProcesoPage() {
  return (
    <ModulePageLayout title="Facturación - Proceso" description="Procesos de facturación" maxWidth="5xl" showBackButton>
      <div className="text-sm text-muted-foreground">Pronto aquí verás los procesos de facturación.</div>
      <ModuleCard title="Formulario del módulo" description="Registro y parametrización">
        <SubmoduleFormPage href="/facturacion/proceso" embedded />
      </ModuleCard>
    </ModulePageLayout>
  );
}
