import React from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: string;
  trendUp?: boolean;
  meta?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  icon = 'analytics',
  trend,
  trendUp,
  meta,
  className,
}: MetricCardProps) {
  return (
    <div className={cn('clinical-card flex flex-col justify-between p-4', className)}>
      <div className="flex items-start justify-between">
        <div className="rounded bg-[#39b8fd]/10 p-2">
          <span className="material-symbols-outlined text-[#006591]">{icon}</span>
        </div>
        {trend && (
          <span
            className={cn(
              'status-pill',
              trendUp ? 'status-pill--success' : 'status-pill--error'
            )}
          >
            <span className="material-symbols-outlined text-[12px]">
              {trendUp ? 'trending_up' : 'trending_down'}
            </span>
            {trend}
          </span>
        )}
        {meta && !trend && (
          <span className="text-label-sm text-slate-400">{meta}</span>
        )}
      </div>
      <div className="mt-4">
        <p className="font-geist text-label-md text-[#45464d]">{label}</p>
        <h3 className="mt-1 font-geist text-display-lg text-[#191c1e]">{value}</h3>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-start justify-between gap-3', className)}>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-geist text-headline-md text-[#191c1e]">{title}</h1>
          {badge && (
            <span className="status-pill status-pill--info">{badge}</span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-body-sm text-[#45464d]">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

interface StatusPillProps {
  children: React.ReactNode;
  tone?: 'success' | 'error' | 'warning' | 'info';
  icon?: string;
  className?: string;
}

export function StatusPill({
  children,
  tone = 'info',
  icon,
  className,
}: StatusPillProps) {
  return (
    <span className={cn('status-pill', `status-pill--${tone}`, className)}>
      {icon && <span className="material-symbols-outlined text-[12px]">{icon}</span>}
      {children}
    </span>
  );
}

interface ClinicalTableShellProps {
  children: React.ReactNode;
  className?: string;
}

export function ClinicalTableShell({ children, className }: ClinicalTableShellProps) {
  return (
    <div className={cn('clinical-card overflow-hidden', className)}>
      {children}
    </div>
  );
}
