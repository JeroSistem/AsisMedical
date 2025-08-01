"use client";

import { useState } from 'react';
import { AppLayout } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, DollarSign, CreditCard, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

// Datos de ejemplo para facturación
const mockInvoices = [
  {
    id: 1,
    patientName: "Juan Pérez",
    invoiceNumber: "FAC-2024-001",
    amount: 150.00,
    status: "paid",
    date: "2024-01-15",
    dueDate: "2024-01-30",
    paymentMethod: "Tarjeta"
  },
  {
    id: 2,
    patientName: "María García",
    invoiceNumber: "FAC-2024-002",
    amount: 85.50,
    status: "pending",
    date: "2024-01-15",
    dueDate: "2024-01-30",
    paymentMethod: "Efectivo"
  },
  {
    id: 3,
    patientName: "Carlos López",
    invoiceNumber: "FAC-2024-003",
    amount: 320.00,
    status: "overdue",
    date: "2024-01-10",
    dueDate: "2024-01-25",
    paymentMethod: "Transferencia"
  }
];

const statusColors = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800"
};

const statusLabels = {
  paid: "Pagada",
  pending: "Pendiente",
  overdue: "Vencida",
  cancelled: "Cancelada"
};

export default function FacturacionPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = mockInvoices.filter(invoice =>
    invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.includes(searchTerm) ||
    invoice.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInvoices = mockInvoices.length;
  const paidInvoices = mockInvoices.filter(i => i.status === 'paid').length;
  const pendingInvoices = mockInvoices.filter(i => i.status === 'pending').length;
  const overdueInvoices = mockInvoices.filter(i => i.status === 'overdue').length;
  const totalAmount = mockInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = mockInvoices
    .filter(i => i.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
            <p className="text-gray-600 mt-1">Gestión financiera y facturación</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Ver Reportes
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Factura
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Facturas</p>
                  <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pagadas</p>
                  <p className="text-2xl font-bold text-gray-900">{paidInvoices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingInvoices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Vencidas</p>
                  <p className="text-2xl font-bold text-gray-900">{overdueInvoices}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen Financiero</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Facturado:</span>
                  <span className="font-semibold">S/. {totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cobrado:</span>
                  <span className="font-semibold text-green-600">S/. {paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Por Cobrar:</span>
                  <span className="font-semibold text-red-600">S/. {(totalAmount - paidAmount).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tarjeta:</span>
                  <span className="font-semibold">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Efectivo:</span>
                  <span className="font-semibold">35%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transferencia:</span>
                  <span className="font-semibold">20%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar facturas por paciente, número o método de pago..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Facturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{invoice.patientName}</h3>
                        <Badge className={statusColors[invoice.status as keyof typeof statusColors]}>
                          {statusLabels[invoice.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-500">
                        Método: {invoice.paymentMethod} | Fecha: {invoice.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Monto</p>
                      <p className="text-lg font-bold text-gray-900">S/. {invoice.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Vence: {invoice.dueDate}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredInvoices.length === 0 && (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron facturas</h3>
                  <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 