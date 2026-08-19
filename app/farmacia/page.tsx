"use client";

import { useState } from 'react';
import { AppLayout } from '@/components/shared';
import { EmptyStatBlock, NoDataMessage } from '@/components/shared/no-data-message';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, Pill, Package, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

export default function FarmaciaPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <AppLayout title="Farmacia" description="Inventario y despacho farmacéutico">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#39b8fd]/10">
              <span className="material-symbols-outlined text-[#006591]">local_pharmacy</span>
            </div>
            <div>
              <h1 className="font-geist text-headline-sm text-[#191c1e]">Central farmacéutica</h1>
              <p className="text-body-sm text-[#45464d]">Gestión de medicamentos e inventario</p>
            </div>
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
                  <EmptyStatBlock />
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
                  <EmptyStatBlock />
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
                  <EmptyStatBlock />
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
                  <EmptyStatBlock />
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
            <NoDataMessage
              title="Sin medicamentos registrados"
              description="El inventario aparecerá cuando se registren medicamentos en el sistema."
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
