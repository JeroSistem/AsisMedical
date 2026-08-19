"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { NoDataMessage } from "@/components/shared/no-data-message";

interface PatientsByMonthProps {
  data: Array<{
    month: string;
    count: number;
  }>;
}

export function PatientsByMonthChart({ data }: PatientsByMonthProps) {
  const chartData = data
    .filter((item) => item.count > 0)
    .map((item) => ({
      month: new Date(item.month).toLocaleDateString('es-ES', {
        month: 'short',
        year: 'numeric',
      }),
      pacientes: item.count,
    }));

  if (!chartData.length) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Tendencia de Pacientes por Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <NoDataMessage />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Tendencia de Pacientes por Mes</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              fontSize={12}
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              fontSize={12}
              tick={{ fontSize: 11 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
            <Bar 
              dataKey="pacientes" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 