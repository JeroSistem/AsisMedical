'use client';

import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout'
import { SubmoduleFormPage } from '@/components/shared/submodule-form-page';

export default function FacturacionInformePage() {
  return (
    <ModulePageLayout title="Facturación - Informe" description="Reportes de facturación" maxWidth="5xl" showBackButton>
      <div className="text-sm text-muted-foreground">Pronto aquí verás los reportes de facturación.</div>
      <ModuleCard title="Formulario del módulo" description="Registro y parametrización">
        <SubmoduleFormPage href="/facturacion/informe" embedded />
      </ModuleCard>
    </ModulePageLayout>
  );
}
