'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, TrendingDown, DollarSign, FileText } from 'lucide-react';

export default function ContabilidadPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contabilidad</h1>
          <p className="text-gray-600 mt-2">Gestión contable y financiera</p>
        </div>
        <Button className="bg-lime-500 hover:bg-lime-600">
          <Calculator className="w-4 h-4 mr-2" />
          Nuevo Asiento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$125,430</div>
            <p className="text-xs text-muted-foreground">
              +15.3% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">$89,250</div>
            <p className="text-xs text-muted-foreground">
              +8.7% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilidad</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">$36,180</div>
            <p className="text-xs text-muted-foreground">
              Margen del 28.8%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asientos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos Asientos */}
        <Card>
          <CardHeader>
            <CardTitle>Últimos Asientos</CardTitle>
            <CardDescription>
              Asientos contables recientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { description: 'Ingreso por consultas', amount: 12500, type: 'Ingreso', date: '2024-01-15' },
                { description: 'Pago proveedores', amount: -8500, type: 'Gasto', date: '2024-01-14' },
                { description: 'Ingreso por procedimientos', amount: 18900, type: 'Ingreso', date: '2024-01-13' },
                { description: 'Gastos administrativos', amount: -3200, type: 'Gasto', date: '2024-01-12' },
                { description: 'Ingreso por farmacia', amount: 5600, type: 'Ingreso', date: '2024-01-11' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.type === 'Ingreso' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <DollarSign className={`w-4 h-4 ${
                        item.type === 'Ingreso' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      item.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${Math.abs(item.amount).toLocaleString()}
                    </p>
                    <Badge variant={item.type === 'Ingreso' ? 'default' : 'secondary'}>
                      {item.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cuentas Principales */}
        <Card>
          <CardHeader>
            <CardTitle>Cuentas Principales</CardTitle>
            <CardDescription>
              Balance de cuentas principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { account: 'Caja y Bancos', balance: 45680, type: 'Activo' },
                { account: 'Cuentas por Cobrar', balance: 23450, type: 'Activo' },
                { account: 'Cuentas por Pagar', balance: -18900, type: 'Pasivo' },
                { account: 'Ingresos por Servicios', balance: 125430, type: 'Ingreso' },
                { account: 'Gastos Operativos', balance: -89250, type: 'Gasto' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.balance > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Calculator className={`w-4 h-4 ${
                        item.balance > 0 ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{item.account}</p>
                      <p className="text-sm text-gray-500">{item.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      item.balance > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${Math.abs(item.balance).toLocaleString()}
                    </p>
                    <Badge variant={item.balance > 0 ? 'default' : 'secondary'}>
                      {item.balance > 0 ? 'Deudor' : 'Acreedor'}
                    </Badge>
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
            Acciones frecuentes del módulo de contabilidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Calculator className="w-6 h-6 mb-2" />
              <span>Nuevo Asiento</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="w-6 h-6 mb-2" />
              <span>Balance General</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="w-6 h-6 mb-2" />
              <span>Estado de Resultados</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <DollarSign className="w-6 h-6 mb-2" />
              <span>Flujo de Caja</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 