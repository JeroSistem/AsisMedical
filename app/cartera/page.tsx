'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, TrendingUp, AlertCircle, FileText } from 'lucide-react';

export default function CarteraPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cartera</h1>
          <p className="text-gray-600 mt-2">Gestión de cartera y cobranza</p>
        </div>
        <Button className="bg-cyan-500 hover:bg-cyan-600">
          <CreditCard className="w-4 h-4 mr-2" />
          Nueva Cobranza
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartera Total</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$456,780</div>
            <p className="text-xs text-muted-foreground">
              Saldo pendiente total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobrado Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$23,450</div>
            <p className="text-xs text-muted-foreground">
              +12.5% desde ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencido</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">$89,230</div>
            <p className="text-xs text-muted-foreground">
              Facturas vencidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Vencer</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">$156,000</div>
            <p className="text-xs text-muted-foreground">
              Próximos 30 días
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Facturas Vencidas */}
        <Card>
          <CardHeader>
            <CardTitle>Facturas Vencidas</CardTitle>
            <CardDescription>
              Facturas con pagos pendientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { paciente: 'María González', factura: 'F-001-2024', monto: 1250, dias: 45, estado: 'Crítico' },
                { paciente: 'Juan Pérez', factura: 'F-002-2024', monto: 890, dias: 30, estado: 'Alto' },
                { paciente: 'Ana López', factura: 'F-003-2024', monto: 2100, dias: 60, estado: 'Crítico' },
                { paciente: 'Carlos Ruiz', factura: 'F-004-2024', monto: 750, dias: 15, estado: 'Medio' },
                { paciente: 'Laura Torres', factura: 'F-005-2024', monto: 1800, dias: 90, estado: 'Crítico' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.estado === 'Crítico' ? 'bg-red-100' : 
                      item.estado === 'Alto' ? 'bg-orange-100' : 'bg-yellow-100'
                    }`}>
                      <AlertCircle className={`w-4 h-4 ${
                        item.estado === 'Crítico' ? 'text-red-600' : 
                        item.estado === 'Alto' ? 'text-orange-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{item.paciente}</p>
                      <p className="text-sm text-gray-500">{item.factura} • {item.dias} días vencida</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.monto.toLocaleString()}</p>
                    <Badge variant={item.estado === 'Crítico' ? 'destructive' : 
                                  item.estado === 'Alto' ? 'secondary' : 'outline'}>
                      {item.estado}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cobranzas Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Cobranzas Recientes</CardTitle>
            <CardDescription>
              Últimas cobranzas realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { paciente: 'María González', monto: 1250, metodo: 'Efectivo', fecha: '2024-01-15' },
                { paciente: 'Juan Pérez', monto: 890, metodo: 'Tarjeta', fecha: '2024-01-14' },
                { paciente: 'Ana López', monto: 2100, metodo: 'Transferencia', fecha: '2024-01-13' },
                { paciente: 'Carlos Ruiz', monto: 750, metodo: 'Efectivo', fecha: '2024-01-12' },
                { paciente: 'Laura Torres', monto: 1800, metodo: 'Tarjeta', fecha: '2024-01-11' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{item.paciente}</p>
                      <p className="text-sm text-gray-500">{item.fecha} • {item.metodo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">${item.monto.toLocaleString()}</p>
                    <Badge variant="default">Cobrado</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Acciones frecuentes del módulo de cartera
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <CreditCard className="w-6 h-6 mb-2" />
              <span>Nueva Cobranza</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <AlertCircle className="w-6 h-6 mb-2" />
              <span>Facturas Vencidas</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="w-6 h-6 mb-2" />
              <span>Proyecciones</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="w-6 h-6 mb-2" />
              <span>Reportes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 