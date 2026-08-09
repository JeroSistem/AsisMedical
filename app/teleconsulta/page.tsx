'use client';

import { StitchMockPage } from '@/components/stitch/StitchMockPage';
import { STITCH_SCREENS } from '@/lib/stitch-screens';

export default function TeleconsultaPage() {
  const screen = STITCH_SCREENS.teleconsulta;
  return (
    <StitchMockPage
      title={screen.title}
      description={screen.description}
      icon={screen.icon}
      sections={screen.sections}
    />
  );
}
