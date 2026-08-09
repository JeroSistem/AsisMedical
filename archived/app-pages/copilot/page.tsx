'use client';

import { StitchMockPage } from '@/components/stitch/StitchMockPage';
import { STITCH_SCREENS } from '@/lib/stitch-screens';

export default function CopilotPage() {
  const screen = STITCH_SCREENS.copilot;
  return (
    <StitchMockPage
      title={screen.title}
      description={screen.description}
      icon={screen.icon}
      sections={screen.sections}
    />
  );
}
