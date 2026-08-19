'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** Redirige a la pantalla principal de admisión. */
export default function AdmisionesPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admision');
  }, [router]);

  return (
    <div className="p-8 text-center text-muted-foreground">
      Redirigiendo a Admisión…{' '}
      <Link href="/admision" className="underline">
        Continuar
      </Link>
    </div>
  );
}
