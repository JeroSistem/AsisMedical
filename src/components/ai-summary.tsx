'use client';
import React, { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, LoaderCircle } from 'lucide-react';
import type { MedicalRecord } from '@/lib/types';
import { summarizePatientRecordAction } from '@/actions/summarize';
import { useToast } from '@/hooks/use-toast';

export function AiSummary({ medicalRecord }: { medicalRecord: MedicalRecord }) {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateSummary = () => {
    startTransition(async () => {
      const result = await summarizePatientRecordAction({
        medicalHistory: medicalRecord.medicalHistory,
        currentStatus: medicalRecord.currentStatus,
      });

      if (result.success && result.data) {
        setSummary(result.data.summary);
      } else {
        toast({
            variant: "destructive",
            title: "Error al generar el resumen",
            description: result.error || "Ocurrió un error desconocido.",
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-primary h-6 w-6" />
                    Resumen con IA
                </CardTitle>
                <CardDescription>
                    Un vistazo rápido al historial del paciente, generado por IA.
                </CardDescription>
            </div>
            <Button onClick={handleGenerateSummary} disabled={isPending}>
                {isPending ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generar Resumen
            </Button>
        </div>
      </CardHeader>
      {(isPending || summary) && (
        <CardContent>
            {isPending && (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Generando resumen... por favor espere.
                </div>
            )}
            {summary && !isPending && (
                <div className="prose prose-sm max-w-none text-foreground">
                    <p>{summary}</p>
                </div>
            )}
        </CardContent>
      )}
    </Card>
  );
}
