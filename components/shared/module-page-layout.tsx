'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSetAppChrome } from './app-shell-context';

interface ModulePageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  showBackButton?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
}

const MAX_WIDTH_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-[1400px]',
  full: 'max-w-full',
} as const;

export function ModulePageLayout({
  children,
  title,
  description,
  actions,
  showBackButton = false,
  maxWidth = '7xl',
}: ModulePageLayoutProps) {
  const router = useRouter();

  const onBack = useMemo(
    () => (showBackButton ? () => router.back() : undefined),
    [showBackButton, router]
  );

  useSetAppChrome({
    title,
    description,
    actions,
    showBackButton,
    onBack,
    contentClassName: MAX_WIDTH_CLASSES[maxWidth],
  });

  return <div className="space-y-4">{children}</div>;
}

interface ModuleCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function ModuleCard({ children, title, description, className = '' }: ModuleCardProps) {
  const hasPadding = className.includes('p-');
  return (
    <Card className={hasPadding ? className : cn('p-4', className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className="font-geist text-title-lg text-[#191c1e]">{title}</h2>
          )}
          {description && (
            <p className="mt-1 text-body-sm text-[#45464d]">{description}</p>
          )}
        </div>
      )}
      {children}
    </Card>
  );
}
