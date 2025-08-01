import { Stethoscope } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-lg font-bold tracking-tight ${className}`}>
      <div className="bg-primary text-primary-foreground rounded-lg p-2">
        <Stethoscope className="h-5 w-5" />
      </div>
      <span>ASIS medical Plus</span>
    </div>
  );
}
