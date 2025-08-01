"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PatientsByMonthProps {
  data: Array<{
    month: string;
    count: number;
  }>;
}

export function PatientsByMonthChart({ data }: PatientsByMonthProps) {
  const chartData = data.map(item => ({
    month: new Date(item.month).toLocaleDateString('es-ES', { 
      month: 'short', 
      year: 'numeric' 
    }),
    pacientes: item.count
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Tendencia de Pacientes por Mes</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="pacientes" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 