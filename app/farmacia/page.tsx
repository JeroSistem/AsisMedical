"use client";

import { useState } from 'react';
import { AppLayout } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Pill, Package, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

// Datos de ejemplo para farmacia
const mockMedicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Analgésico",
    stock: 150,
    minStock: 20,
    price: 5.50,
    expiryDate: "2024-12-31",
    status: "available"
  },
  {
    id: 2,
    name: "Ibuprofeno 400mg",
    category: "Antiinflamatorio",
    stock: 8,
    minStock: 15,
    price: 8.75,
    expiryDate: "2024-10-15",
    status: "low_stock"
  },
  {
    id: 3,
    name: "Amoxicilina 500mg",
    category: "Antibiótico",
    stock: 0,
    minStock: 10,
    price: 12.30,
    expiryDate: "2024-08-20",
    status: "out_of_stock"
  }
];

const statusColors = {
  available: "bg-green-100 text-green-800",
  low_stock: "bg-yellow-100 text-yellow-800",
  out_of_stock: "bg-red-100 text-red-800"
};

const statusLabels = {
  available: "Disponible",
  low_stock: "Stock Bajo",
  out_of_stock: "Sin Stock"
};

export default function FarmaciaPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedicines = mockMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMedicines = mockMedicines.length;
  const lowStockMedicines = mockMedicines.filter(m => m.status === 'low_stock').length;
  const outOfStockMedicines = mockMedicines.filter(m => m.status === 'out_of_stock').length;
  const expiringSoon = mockMedicines.filter(m => {
    const expiryDate = new Date(m.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  }).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Farmacia</h1>
            <p className="text-gray-600 mt-1">Gestión de medicamentos e inventario</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Nuevo Medicamento
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Receta
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Pill className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Medicamentos</p>
                  <p className="text-2xl font-bold text-gray-900">{totalMedicines}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                  <p className="text-2xl font-bold text-gray-900">{lowStockMedicines}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Sin Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{outOfStockMedicines}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Por Vencer</p>
                  <p className="text-2xl font-bold text-gray-900">{expiringSoon}</p>
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
                  placeholder="Buscar medicamentos por nombre o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          </CardContent>
        </Card>

        {/* Medicines List */}
        <Card>
          <CardHeader>
            <CardTitle>Inventario de Medicamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMedicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Pill className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{medicine.name}</h3>
                        <Badge className={statusColors[medicine.status as keyof typeof statusColors]}>
                          {statusLabels[medicine.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{medicine.category}</p>
                      <p className="text-sm text-gray-500">
                        Stock: {medicine.stock} unidades | Precio: S/. {medicine.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Vence</p>
                      <p className="text-sm font-medium text-gray-900">{medicine.expiryDate}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredMedicines.length === 0 && (
                <div className="text-center py-8">
                  <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron medicamentos</h3>
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