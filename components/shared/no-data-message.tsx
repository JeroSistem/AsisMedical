import type { ReactNode } from 'react';

type NoDataMessageProps = {
  title?: string;
  description?: string;
  className?: string;
  children?: ReactNode;
};

export function NoDataMessage({
  title = 'No hay datos disponibles',
  description = 'Los indicadores aparecerán cuando se registre información en el sistema.',
  className = '',
  children,
}: NoDataMessageProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-10 text-center text-muted-foreground ${className}`}
    >
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {description ? (
        <p className="mt-1 max-w-md text-xs text-slate-500">{description}</p>
      ) : null}
      {children}
    </div>
  );
}

export function EmptyStatBlock({
  subtitle = 'Sin datos registrados',
}: {
  subtitle?: string;
}) {
  return (
    <>
      <div className="text-2xl font-bold">0</div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </>
  );
}
