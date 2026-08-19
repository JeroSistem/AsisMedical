'use client'

import { SessionProvider } from 'next-auth/react'

export function ClientSessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider
      // Evita ráfagas de /api/auth/session durante HMR (CLIENT_FETCH_ERROR)
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
      refetchInterval={0}
      basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  )
}
