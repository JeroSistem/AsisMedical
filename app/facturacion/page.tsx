'use client';

import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout'
import { SubmoduleFormPage } from '@/components/shared/submodule-form-page';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FacturacionIndexPage() {
  const modules = [
    { title: 'Administración', href: '/facturacion/administracion', description: 'Gestión administrativa de facturación' },
    { title: 'Informe', href: '/facturacion/informe', description: 'Reportes de facturación' },
    { title: 'Proceso', href: '/facturacion/proceso', description: 'Procesos de facturación' },
  ];

  return (
    <ModulePageLayout title="Facturación y cartera" description="Gestión financiera, RIPS y cobranza" maxWidth="6xl">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {modules.map((m) => (
          <Link key={m.href} href={m.href}>
            <Card className="transition-colors hover:border-[#39b8fd]/50">
              <CardHeader>
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded bg-[#39b8fd]/10">
                  <span className="material-symbols-outlined text-[#006591]">payments</span>
                </div>
                <CardTitle>{m.title}</CardTitle>
                <CardDescription>{m.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      <ModuleCard title="Formulario del módulo" description="Registro y parametrización">
        <SubmoduleFormPage href="/facturacion" embedded />
      </ModuleCard>
    </ModulePageLayout>
  );
}
