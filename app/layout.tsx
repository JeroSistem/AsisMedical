
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '@/styles/theme.css';
import { LanguageProvider } from '@/lib/contexts/language-context';
import { ThemeProvider } from '@/lib/contexts/theme-context';
import { ClientSessionProvider } from '@/components/providers/session-provider';
import { ToasterProvider } from '@/components/shared/toaster-provider';
import { AppShellProvider } from '@/components/shared/app-shell-context';
import { PersistentAppShell } from '@/components/shared/app-layout';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AsisMediCare',
  description: 'Gestión Avanzada de Historias Clínicas Electrónicas',
};

// Evita errores de prerender estático (useSearchParams, DB no disponible en CI, etc.)
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0b1c30" />
      </head>
      <body className="font-body antialiased bg-surface text-on-surface" suppressHydrationWarning>
        <ClientSessionProvider>
          <ThemeProvider>
            <LanguageProvider>
              <AppShellProvider>
                <PersistentAppShell>{children}</PersistentAppShell>
              </AppShellProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ClientSessionProvider>
        <ToasterProvider />
      </body>
    </html>
  );
}
