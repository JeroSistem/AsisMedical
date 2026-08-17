"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Database, 
  HardDrive, 
  Network, 
  Server, 
  Shield, 
  Users 
} from 'lucide-react';

interface SystemStatusProps {
  stats: {
    uptime: string;
    memory: number;
    storage: number;
    cpu: number;
    activeUsers: number;
    totalUsers: number;
    activeEntities: number;
    totalEntities: number;
  };
}

export function SystemStatus({ stats }: SystemStatusProps) {
  const getStatusColor = (value: number) => {
    if (value < 50) return 'text-green-600';
    if (value < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (value: number) => {
    if (value < 50) return 'bg-green-100 text-green-800';
    if (value < 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Estado General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Server className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Estado del Sistema</p>
                <Badge className="bg-green-100 text-green-800">Operativo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uptime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Entidades Activas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeEntities}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recursos del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Uso de Recursos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">CPU</span>
                <span className={`text-sm font-medium ${getStatusColor(stats.cpu)}`}>
                  {stats.cpu}%
                </span>
              </div>
              <Progress value={stats.cpu} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Memoria</span>
                <span className={`text-sm font-medium ${getStatusColor(stats.memory)}`}>
                  {stats.memory}%
                </span>
              </div>
              <Progress value={stats.memory} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Almacenamiento</span>
                <span className={`text-sm font-medium ${getStatusColor(stats.storage)}`}>
                  {stats.storage}%
                </span>
              </div>
              <Progress value={stats.storage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Estadísticas de Uso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Usuarios</span>
              <span className="text-sm text-gray-600">{stats.totalUsers}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Usuarios Activos</span>
              <span className="text-sm text-green-600">{stats.activeUsers}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Entidades</span>
              <span className="text-sm text-gray-600">{stats.totalEntities}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Entidades Activas</span>
              <span className="text-sm text-green-600">{stats.activeEntities}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tasa de Actividad</span>
              <Badge className={getStatusBadge((stats.activeUsers / stats.totalUsers) * 100)}>
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Versión del Sistema:</span>
                <span className="font-semibold">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base de Datos:</span>
                <span className="font-semibold">MySQL 8.4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Framework:</span>
                <span className="font-semibold">Next.js 15.4.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Node.js:</span>
                <span className="font-semibold">v20.18.0</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Última Actualización:</span>
                <span className="font-semibold">2024-01-15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Backup Automático:</span>
                <Badge className="bg-green-100 text-green-800">Activo</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monitoreo:</span>
                <Badge className="bg-green-100 text-green-800">Activo</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seguridad:</span>
                <Badge className="bg-green-100 text-green-800">Actualizada</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
