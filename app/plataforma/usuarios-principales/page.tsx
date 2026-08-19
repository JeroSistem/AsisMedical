'use client';

import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout'
import { SubmoduleFormPage } from '@/components/shared/submodule-form-page';
import { PrincipalUsersPanel } from '@/components/modules/plataforma/principal-users-panel';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';

export default function UsuariosPrincipalesPage() {
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role;

  if (status === 'loading') {
    return (
      <ModulePageLayout
        title="Usuarios principales"
        description="Administración de accesos principales por entidad"
      >
        <p className="text-sm text-muted-foreground">Cargando…</p>
      </ModulePageLayout>
    );
  }

  const blocked =
    role === 'ENTITY_ADMIN' ||
    role === 'MEDICO' ||
    role === 'ENFERMERO' ||
    role === 'USER';

  if (blocked) {
    return (
      <ModulePageLayout
        title="Usuarios principales"
        description="Acceso restringido"
      >
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            Este módulo es exclusivo del administrador principal de la plataforma.
          </CardContent>
        </Card>
      </ModulePageLayout>
    );
  }

  return (
    <ModulePageLayout
      title="Usuarios principales"
      description="Crea y gestiona el usuario principal de cada entidad con la que contratas"
    >
      <PrincipalUsersPanel />
      <ModuleCard title="Formulario del módulo" description="Registro y parametrización">
        <SubmoduleFormPage href="/plataforma/usuarios-principales" embedded />
      </ModuleCard>
    </ModulePageLayout>
  );
}
