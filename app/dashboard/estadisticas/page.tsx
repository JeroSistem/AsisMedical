'use client';

import { useState, useEffect } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout'
import { SubmoduleFormPage } from '@/components/shared/submodule-form-page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity, 
  Calendar,
  Server,
  Database,
  Cpu,
  HardDrive,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  Globe,
  Shield,
  Zap,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function EstadisticasPage() {
  const [periodo, setPeriodo] = useState('30');
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  // Estadísticas del sistema - inicialmente en 0
  const [stats, setStats] = useState({
    usuarios: {
      total: 0,
      activos: 0,
      nuevos: 0,
      sesiones: 0,
      crecimiento: 0
    },
    rendimiento: {
      uptime: 0,
      tiempoRespuesta: 0,
      solicitudes: 0,
      crecimiento: 0
    },
    almacenamiento: {
      total: 0,
      usado: 0,
      porcentaje: 0,
      tendencia: 'stable' as const
    },
    transacciones: {
      total: 0,
      exitosas: 0,
      fallidas: 0,
      tasa: 0
    }
  });

  const [tendencias, setTendencias] = useState<any[]>([]);
  const [topModulos, setTopModulos] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<any[]>([]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dashboard/stats');
      const result = await response.json();
      
      if (result.success && result.data) {
        setStats(result.data.stats || stats);
        setTendencias(result.data.tendencias || []);
        setTopModulos(result.data.topModulos || []);
        setAlertas(result.data.alertas || []);
      }
    } catch (error: any) {
      console.error('Error cargando estadísticas:', error);
      toast.error('Error al cargar estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setHasMounted(true);
    loadStats();
  }, []);

  const formatNumber = (value: number) => {
    if (!hasMounted) return String(value);
    return value.toLocaleString('es-CO');
  };

  const formatUptime = (uptime: number) => {
    if (!hasMounted || uptime <= 0) return '—';
    return `${uptime}%`;
  };

  const formatPercent = (value: number) => {
    if (!hasMounted || value <= 0) return '0%';
    return `${value}%`;
  };

  const handleRefresh = () => {
    loadStats();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCrecimientoColor = (valor: number) => {
    if (valor > 0) return 'text-green-600';
    if (valor < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getCrecimientoIcon = (valor: number) => {
    if (valor > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (valor < 0) return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const actions = (
    <>
      <Select value={periodo} onValueChange={setPeriodo}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7">7 días</SelectItem>
          <SelectItem value="30">30 días</SelectItem>
          <SelectItem value="90">90 días</SelectItem>
          <SelectItem value="365">1 año</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        Actualizar
      </Button>
      <Button variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Exportar
      </Button>
    </>
  );

  return (
    <ModulePageLayout
      title="Estadísticas del Sistema"
      description="Análisis de rendimiento y funcionalidad del software"
      actions={actions}
      maxWidth="7xl"
    >

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.usuarios.activos}</div>
              {stats.usuarios.crecimiento !== 0 && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  {getCrecimientoIcon(stats.usuarios.crecimiento)}
                  <span className={getCrecimientoColor(stats.usuarios.crecimiento)}>
                    {stats.usuarios.crecimiento > 0 ? '+' : ''}{stats.usuarios.crecimiento}%
                  </span>
                  <span>vs mes anterior</span>
                </div>
              )}
              {stats.usuarios.sesiones > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.usuarios.sesiones} sesiones activas
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime del Sistema</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatUptime(stats.rendimiento.uptime)}</div>
              {hasMounted && stats.rendimiento.uptime > 0 && stats.rendimiento.crecimiento !== 0 && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  {getCrecimientoIcon(stats.rendimiento.crecimiento)}
                  <span className={getCrecimientoColor(stats.rendimiento.crecimiento)}>
                    +{stats.rendimiento.crecimiento}%
                  </span>
                  <span>vs mes anterior</span>
                </div>
              )}
              {hasMounted && stats.rendimiento.uptime === 0 && (
                <p className="text-xs text-muted-foreground mt-1">Sin monitoreo configurado</p>
              )}
              {hasMounted && stats.rendimiento.uptime > 0 && stats.rendimiento.tiempoRespuesta > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Tiempo de respuesta: {stats.rendimiento.tiempoRespuesta}ms
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Almacenamiento</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercent(stats.almacenamiento.porcentaje)}</div>
              {stats.almacenamiento.total > 0 && (
                <div className="text-xs text-muted-foreground">
                  {stats.almacenamiento.usado} GB de {stats.almacenamiento.total} GB
                </div>
              )}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    stats.almacenamiento.porcentaje > 80 ? 'bg-red-600' : 
                    stats.almacenamiento.porcentaje > 60 ? 'bg-yellow-600' : 'bg-green-600'
                  }`}
                  style={{ width: `${stats.almacenamiento.porcentaje}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercent(stats.transacciones.tasa)}</div>
              {hasMounted && stats.transacciones.total > 0 && (
                <>
                  <div className="text-xs text-muted-foreground">
                    {formatNumber(stats.transacciones.exitosas)} exitosas
                  </div>
                  {stats.transacciones.fallidas > 0 && (
                    <div className="text-xs text-red-600 mt-1">
                      {stats.transacciones.fallidas} fallidas
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de tendencias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Tendencia de Usuarios Activos
              </CardTitle>
              <CardDescription>
                Evolución de usuarios activos en los últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tendencias.length > 0 ? (
                <div className="space-y-4">
                  {tendencias.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.mes}</span>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{item.usuarios}</div>
                          <div className="text-xs text-muted-foreground">usuarios</div>
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(item.usuarios / 100) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No hay datos de tendencias disponibles</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top módulos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Módulos Más Utilizados
              </CardTitle>
              <CardDescription>
                Módulos con mayor uso este mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topModulos.length > 0 ? (
                <div className="space-y-4">
                  {topModulos.map((modulo, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{modulo.nombre}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatNumber(modulo.uso)} accesos
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">{modulo.porcentaje}%</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No hay datos de módulos utilizados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alertas y notificaciones del sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Alertas del Sistema
            </CardTitle>
            <CardDescription>
              Estado y notificaciones del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {alertas.length > 0 ? (
              <div className="space-y-4">
                {alertas.map((alerta, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        alerta.prioridad === 'alta' ? 'bg-red-500' : 
                        alerta.prioridad === 'media' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <div className="text-sm font-medium">{alerta.mensaje}</div>
                        <div className="text-xs text-muted-foreground">
                          Tipo: {alerta.tipo}
                        </div>
                      </div>
                    </div>
                    <Badge variant={alerta.prioridad === 'alta' ? 'destructive' : 'secondary'}>
                      {alerta.prioridad}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay alertas del sistema</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rendimiento y métricas adicionales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cpu className="w-5 h-5 mr-2" />
                Rendimiento del Sistema
              </CardTitle>
              <CardDescription>
                Métricas de rendimiento en tiempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium">Tiempo de respuesta promedio</span>
                  </div>
                  <Badge variant="outline">{stats.rendimiento.tiempoRespuesta}ms</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Solicitudes procesadas</span>
                  </div>
                  <Badge variant="outline">{formatNumber(stats.rendimiento.solicitudes)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Server className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Disponibilidad</span>
                  </div>
                  <Badge variant="outline" className={stats.rendimiento.uptime > 0 ? 'bg-green-50 text-green-700' : ''}>
                    {formatUptime(stats.rendimiento.uptime) === '—'
                      ? 'Sin monitoreo'
                      : formatUptime(stats.rendimiento.uptime)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Seguridad y Accesos
              </CardTitle>
              <CardDescription>
                Estado de seguridad y control de accesos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Autenticaciones exitosas</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {formatNumber(stats.transacciones.exitosas)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium">Intentos fallidos</span>
                  </div>
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    {stats.transacciones.fallidas}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Usuarios registrados</span>
                  </div>
                  <Badge variant="outline">{stats.usuarios.total}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen ejecutivo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Resumen Ejecutivo
            </CardTitle>
            <CardDescription>
              Indicadores clave de rendimiento del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.usuarios.nuevos}</div>
                <div className="text-sm text-muted-foreground">Usuarios Nuevos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.usuarios.sesiones}</div>
                <div className="text-sm text-muted-foreground">Sesiones Activas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatNumber(stats.transacciones.total)}</div>
                <div className="text-sm text-muted-foreground">Transacciones Totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{formatNumber(stats.rendimiento.solicitudes)}</div>
                <div className="text-sm text-muted-foreground">Solicitudes Procesadas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      <ModuleCard title="Formulario del módulo" description="Registro y parametrización">
        <SubmoduleFormPage href="/dashboard/estadisticas" embedded />
      </ModuleCard>
    </ModulePageLayout>
  );
}
