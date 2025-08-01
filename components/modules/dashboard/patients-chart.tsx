"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface PatientsByGenderProps {
  data: Array<{
    gender: string;
    count: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function PatientsByGenderChart({ data }: PatientsByGenderProps) {
  const chartData = data.map((item, index) => ({
    name: item.gender === 'Male' ? 'Masculino' : item.gender === 'Female' ? 'Femenino' : 'Otro',
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Distribución por Género</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 