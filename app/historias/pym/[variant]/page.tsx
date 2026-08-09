'use client';

import { useParams, notFound } from 'next/navigation';
import { StitchMockPage } from '@/components/stitch/StitchMockPage';
import { PYM_VARIANTS, buildPymSections } from '@/lib/stitch-screens';

export default function HistoriasPymVariantPage() {
  const params = useParams<{ variant: string }>();
  const variant = PYM_VARIANTS.find((v) => v.slug === params.variant);

  if (!variant) {
    notFound();
    return null;
  }

  return (
    <StitchMockPage
      title={variant.title}
      description="Formulario PyM — prototipo visual ASIS Medical Head"
      icon="assignment"
      sections={buildPymSections(variant.title)}
    />
  );
}
