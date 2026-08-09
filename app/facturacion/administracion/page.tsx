'use client';

import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const submodules = [
  { title: 'Pacientes', href: '/facturacion/administracion/pacientes' },
  { title: 'Admisiones', href: '/facturacion/administracion/admisiones' },
  { title: 'Recibos de caja', href: '/facturacion/administracion/recibos-caja' },
  { title: 'Traslados', href: '/facturacion/administracion/traslados' },
  { title: 'Homologaciones proc', href: '/facturacion/administracion/homologaciones-proc' },
  { title: 'Anexo técnico Inconsistencia', href: '/facturacion/administracion/anexo-inconsistencia' },
  { title: 'Anexo técnico Informe urgencia', href: '/facturacion/administracion/anexo-urgencia' },
  { title: 'Anexo técnico Autorizaciones', href: '/facturacion/administracion/anexo-autorizaciones' },
  { title: 'Resolución 202', href: '/facturacion/administracion/resolucion-202' },
  { title: 'Grupos etareos', href: '/facturacion/administracion/grupos-etareos' },
  { title: 'Furips', href: '/facturacion/administracion/furips' },
  { title: 'Furtran', href: '/facturacion/administracion/furtran' },
  { title: 'Anexo Técnico Uno', href: '/facturacion/administracion/anexo-tecnico-uno' },
];

export default function FacturacionAdministracionPage() {
  return (
    <ModulePageLayout title="Facturación - Administración" description="Submódulos administrativos" maxWidth="6xl" showBackButton>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {submodules.map((m) => (
          <Link key={m.href} href={m.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{m.title}</CardTitle>
                <CardDescription>Acceder</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </ModulePageLayout>
  );
}


