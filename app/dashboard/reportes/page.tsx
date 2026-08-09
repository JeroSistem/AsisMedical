'use client';

import { useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Calendar,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  TrendingUp,
  Filter,
  Search,
  Eye,
  Printer
} from 'lucide-react';

export default function ReportesPage() {
  const [tipoReporte, setTipoReporte] = useState('pacientes');
  const [periodo, setPeriodo] = useState('30');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Datos de ejemplo para los reportes
  const [reportes, setReportes] = useState({
    pacientes: [
      { id: 1, nombre: 'Reporte de Pacientes por Edad', descripcion: 'Distribución de pacientes por grupos de edad', tipo: 'PDF', fecha: '2024-01-15', estado: 'completado' },
      { id: 2, nombre: 'Pacientes Nuevos Mensual', descripcion: 'Registro de pacientes nuevos por mes', tipo: 'Excel', fecha: '2024-01-14', estado: 'completado' },
      { id: 3, nombre: 'Pacientes por Género', descripcion: 'Estadísticas de pacientes por género', tipo: 'PDF', fecha: '2024-01-13', estado: 'pendiente' }
    ],
    consultas: [
      { id: 4, nombre: 'Consultas por Especialidad', descripcion: 'Número de consultas por especialidad médica', tipo: 'Excel', fecha: '2024-01-15', estado: 'completado' },
      { id: 5, nombre: 'Tiempo Promedio de Consulta', descripcion: 'Análisis del tiempo promedio por consulta', tipo: 'PDF', fecha: '2024-01-14', estado: 'completado' },
      { id: 6, nombre: 'Consultas por Médico', descripcion: 'Rendimiento de consultas por médico', tipo: 'Excel', fecha: '2024-01-12', estado: 'pendiente' }
    ],
    financiero: [
      { id: 7, nombre: 'Ingresos Mensuales', descripcion: 'Reporte detallado de ingresos mensuales', tipo: 'PDF', fecha: '2024-01-15', estado: 'completado' },
      { id: 8, nombre: 'Gastos por Departamento', descripcion: 'Análisis de gastos por departamento', tipo: 'Excel', fecha: '2024-01-14', estado: 'completado' },
      { id: 9, nombre: 'Margen de Utilidad', descripcion: 'Análisis del margen de utilidad por servicio', tipo: 'PDF', fecha: '2024-01-13', estado: 'pendiente' }
    ],
    operativo: [
      { id: 10, nombre: 'Ocupación de Camas', descripcion: 'Reporte de ocupación hospitalaria', tipo: 'Excel', fecha: '2024-01-15', estado: 'completado' },
      { id: 11, nombre: 'Tiempo de Espera', descripcion: 'Análisis de tiempos de espera por servicio', tipo: 'PDF', fecha: '2024-01-14', estado: 'completado' },
      { id: 12, nombre: 'Eficiencia Operativa', descripcion: 'Métricas de eficiencia operativa', tipo: 'Excel', fecha: '2024-01-12', estado: 'pendiente' }
    ]
  });

  const [reportesGenerados, setReportesGenerados] = useState([
    { id: 1, nombre: 'Reporte Mensual Enero 2024', tipo: 'PDF', tamaño: '2.3 MB', fecha: '2024-01-15 14:30', descargas: 12 },
    { id: 2, nombre: 'Estadísticas Q4 2023', tipo: 'Excel', tamaño: '1.8 MB', fecha: '2024-01-10 09:15', descargas: 8 },
    { id: 3, nombre: 'Análisis Financiero Anual', tipo: 'PDF', tamaño: '4.1 MB', fecha: '2024-01-05 16:45', descargas: 15 }
  ]);

  const handleGenerarReporte = () => {
    // Simular generación de reporte
    console.log('Generando reporte...');
  };

  const handleDescargarReporte = (id: number) => {
    console.log(`Descargando reporte ${id}`);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'completado':
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'PDF':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'Excel':
        return <BarChart3 className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <ModulePageLayout
      title="Reportes"
      description="Generación y gestión de reportes del sistema"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar Todo
          </Button>
        </>
      }
    >

      <Tabs defaultValue="generar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generar">Generar Reporte</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
          <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
        </TabsList>

        <TabsContent value="generar" className="space-y-6">
          {/* Configuración del reporte */}
          <ModuleCard
            title="Configuración del Reporte"
            description="Selecciona el tipo de reporte y configura los parámetros"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="tipoReporte">Tipo de Reporte</Label>
                <Select value={tipoReporte} onValueChange={setTipoReporte}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pacientes">Pacientes</SelectItem>
                    <SelectItem value="consultas">Consultas</SelectItem>
                    <SelectItem value="financiero">Financiero</SelectItem>
                    <SelectItem value="operativo">Operativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="periodo">Período</Label>
                <Select value={periodo} onValueChange={setPeriodo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 días</SelectItem>
                    <SelectItem value="30">30 días</SelectItem>
                    <SelectItem value="90">90 días</SelectItem>
                    <SelectItem value="365">1 año</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fechaFin">Fecha Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={handleGenerarReporte}>
                <FileText className="w-4 h-4 mr-2" />
                Generar Reporte
              </Button>
            </div>
          </ModuleCard>

          {/* Reportes disponibles por categoría */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModuleCard
              title="Reportes de Pacientes"
              description="Reportes relacionados con la gestión de pacientes"
            >
              <div className="space-y-3">
                {reportes.pacientes.map((reporte) => (
                  <div key={reporte.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTipoIcon(reporte.tipo)}
                      <div>
                        <div className="text-sm font-medium">{reporte.nombre}</div>
                        <div className="text-xs text-muted-foreground">{reporte.descripcion}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getEstadoBadge(reporte.estado)}
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ModuleCard>

            <ModuleCard
              title="Reportes de Consultas"
              description="Reportes sobre actividad médica y consultas"
            >
              <div className="space-y-3">
                {reportes.consultas.map((reporte) => (
                  <div key={reporte.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTipoIcon(reporte.tipo)}
                      <div>
                        <div className="text-sm font-medium">{reporte.nombre}</div>
                        <div className="text-xs text-muted-foreground">{reporte.descripcion}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getEstadoBadge(reporte.estado)}
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ModuleCard>

            <ModuleCard
              title="Reportes Financieros"
              description="Reportes sobre ingresos, gastos y rentabilidad"
            >
              <div className="space-y-3">
                {reportes.financiero.map((reporte) => (
                  <div key={reporte.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTipoIcon(reporte.tipo)}
                      <div>
                        <div className="text-sm font-medium">{reporte.nombre}</div>
                        <div className="text-xs text-muted-foreground">{reporte.descripcion}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getEstadoBadge(reporte.estado)}
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ModuleCard>

            <ModuleCard
              title="Reportes Operativos"
              description="Reportes sobre eficiencia y operaciones"
            >
              <div className="space-y-3">
                {reportes.operativo.map((reporte) => (
                  <div key={reporte.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTipoIcon(reporte.tipo)}
                      <div>
                        <div className="text-sm font-medium">{reporte.nombre}</div>
                        <div className="text-xs text-muted-foreground">{reporte.descripcion}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getEstadoBadge(reporte.estado)}
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ModuleCard>
          </div>
        </TabsContent>

        <TabsContent value="historial" className="space-y-6">
          <ModuleCard
            title="Historial de Reportes"
            description="Reportes generados anteriormente"
          >
            <div className="space-y-4">
              {reportesGenerados.map((reporte) => (
                <div key={reporte.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getTipoIcon(reporte.tipo)}
                    <div>
                      <div className="text-sm font-medium">{reporte.nombre}</div>
                      <div className="text-xs text-muted-foreground">
                        {reporte.fecha} • {reporte.tamaño} • {reporte.descargas} descargas
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleDescargarReporte(reporte.id)}>
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ModuleCard>
        </TabsContent>

        <TabsContent value="plantillas" className="space-y-6">
          <ModuleCard
            title="Plantillas de Reportes"
            description="Plantillas predefinidas para generar reportes rápidamente"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <h4 className="font-medium">Reporte Mensual</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Plantilla para reporte mensual estándar
                </p>
                <Button size="sm" variant="outline">Usar Plantilla</Button>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  <h4 className="font-medium">Análisis Trimestral</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Plantilla para análisis trimestral completo
                </p>
                <Button size="sm" variant="outline">Usar Plantilla</Button>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <h4 className="font-medium">Reporte Anual</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Plantilla para reporte anual ejecutivo
                </p>
                <Button size="sm" variant="outline">Usar Plantilla</Button>
              </div>
            </div>
          </ModuleCard>
        </TabsContent>
      </Tabs>
    </ModulePageLayout>
  );
}
