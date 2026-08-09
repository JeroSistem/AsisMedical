'use client';

import React from 'react';
import Link from 'next/link';
import { ModulePageLayout } from '@/components/shared/module-page-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MetricCard, StatusPill } from '@/components/design-system';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export type StitchSection =
  | { type: 'metrics'; items: { label: string; value: string; icon?: string; meta?: string }[] }
  | {
      type: 'table';
      title: string;
      columns: string[];
      rows: string[][];
    }
  | {
      type: 'form';
      title: string;
      fields: { label: string; placeholder?: string; span?: 1 | 2 }[];
    }
  | {
      type: 'cards';
      title?: string;
      items: { title: string; description: string; icon?: string; href?: string }[];
    }
  | { type: 'banner'; text: string; tone?: 'info' | 'warning' | 'success' }
  | { type: 'patientBar'; name: string; id: string; age?: string; entity?: string };

export interface StitchMockPageProps {
  title: string;
  description?: string;
  icon?: string;
  sections?: StitchSection[];
  actions?: React.ReactNode;
  mobileFrame?: boolean;
}

export function StitchMockPage({
  title,
  description,
  icon = 'dashboard',
  sections = [],
  actions,
  mobileFrame = false,
}: StitchMockPageProps) {
  const defaultActions = (
    <>
      <Badge variant="info">Vista de diseño</Badge>
      <Button
        size="sm"
        variant="outline"
        type="button"
        onClick={() => toast.message('Vista de diseño', { description: 'Sin persistencia en base de datos' })}
      >
        <span className="material-symbols-outlined text-[18px]">visibility</span>
        Mock UI
      </Button>
    </>
  );

  const content = (
    <div className="space-y-4">
      <div className="clinical-card flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0b1c30]">
          <span className="material-symbols-outlined text-[#39b8fd]">{icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-geist text-label-md uppercase tracking-wide text-[#75859d]">
            Stitch · ASIS Medical Head
          </p>
          <p className="truncate text-body-sm text-[#45464d]">
            Prototipo visual sin lógica de negocio
          </p>
        </div>
        <StatusPill tone="info" icon="palette">
          Solo diseño
        </StatusPill>
      </div>

      {sections.map((section, idx) => {
        if (section.type === 'banner') {
          return (
            <div
              key={idx}
              className={cn(
                'rounded-lg border px-4 py-3 text-body-sm',
                section.tone === 'warning' && 'border-amber-200 bg-amber-50 text-amber-900',
                section.tone === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-900',
                (!section.tone || section.tone === 'info') &&
                  'border-sky-200 bg-sky-50 text-sky-900'
              )}
            >
              {section.text}
            </div>
          );
        }

        if (section.type === 'patientBar') {
          return (
            <div
              key={idx}
              className="clinical-card flex flex-wrap items-center gap-4 p-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#39b8fd]/15 font-geist text-sm font-bold text-[#006591]">
                {section.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-geist text-title-lg text-[#191c1e]">{section.name}</p>
                <p className="text-body-sm text-[#45464d]">
                  ID {section.id}
                  {section.age ? ` · ${section.age}` : ''}
                  {section.entity ? ` · ${section.entity}` : ''}
                </p>
              </div>
              <StatusPill tone="success" icon="check_circle">
                Activo
              </StatusPill>
            </div>
          );
        }

        if (section.type === 'metrics') {
          return (
            <div
              key={idx}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
              {section.items.map((item) => (
                <MetricCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                  meta={item.meta}
                />
              ))}
            </div>
          );
        }

        if (section.type === 'table') {
          return (
            <div key={idx} className="clinical-card overflow-hidden">
              <div className="border-b border-slate-100 px-4 py-3">
                <h3 className="font-geist text-title-lg text-[#191c1e]">{section.title}</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    {section.columns.map((col) => (
                      <TableHead key={col}>{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.rows.map((row, rIdx) => (
                    <TableRow key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <TableCell key={cIdx}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
        }

        if (section.type === 'form') {
          return (
            <div key={idx} className="clinical-card p-4">
              <h3 className="mb-4 font-geist text-title-lg text-[#191c1e]">
                {section.title}
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {section.fields.map((field) => (
                  <div
                    key={field.label}
                    className={cn('space-y-1.5', field.span === 2 && 'md:col-span-2')}
                  >
                    <label className="font-geist text-label-md text-[#191c1e]">
                      {field.label}
                    </label>
                    <Input placeholder={field.placeholder || field.label} readOnly />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
                <Button type="button">Guardar (mock)</Button>
              </div>
            </div>
          );
        }

        if (section.type === 'cards') {
          return (
            <div key={idx} className="space-y-3">
              {section.title && (
                <h3 className="font-geist text-title-lg text-[#191c1e]">{section.title}</h3>
              )}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {section.items.map((item) => {
                  const inner = (
                    <div className="clinical-card h-full p-4 transition-colors hover:border-[#39b8fd]/40">
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded bg-[#39b8fd]/10">
                        <span className="material-symbols-outlined text-[#006591]">
                          {item.icon || 'widgets'}
                        </span>
                      </div>
                      <p className="font-geist text-[15px] font-semibold text-[#191c1e]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-body-sm text-[#45464d]">{item.description}</p>
                    </div>
                  );
                  return item.href ? (
                    <Link key={item.title} href={item.href}>
                      {inner}
                    </Link>
                  ) : (
                    <div key={item.title}>{inner}</div>
                  );
                })}
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );

  return (
    <ModulePageLayout
      title={title}
      description={description}
      actions={actions || defaultActions}
      maxWidth="7xl"
    >
      {mobileFrame ? (
        <div className="mx-auto max-w-[390px] overflow-hidden rounded-[28px] border-[10px] border-[#0b1c30] bg-[#f7f9fb] shadow-clinical">
          <div className="flex h-7 items-center justify-center bg-[#0b1c30]">
            <div className="h-1.5 w-16 rounded-full bg-white/20" />
          </div>
          <div className="max-h-[720px] overflow-y-auto p-3">{content}</div>
        </div>
      ) : (
        content
      )}
    </ModulePageLayout>
  );
}
