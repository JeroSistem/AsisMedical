'use client';

import { StitchMockPage } from '@/components/stitch/StitchMockPage';
import { STITCH_SCREENS } from '@/lib/stitch-screens';

export default function PortalPacientePage() {
  const screen = STITCH_SCREENS['portal-paciente'];
  return (
    <StitchMockPage
      title={screen.title}
      description={screen.description}
      icon={screen.icon}
      sections={screen.sections}
      mobileFrame={screen.mobileFrame}
    />
  );
}
