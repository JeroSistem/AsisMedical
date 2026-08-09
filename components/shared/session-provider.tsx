'use client';

import { SessionProvider } from 'next-auth/react';
import { authOptions } from '@/lib/auth';

export function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      session={undefined}
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
} 