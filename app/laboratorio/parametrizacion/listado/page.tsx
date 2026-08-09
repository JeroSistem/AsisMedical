'use client';

import React, { useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  ArrowLeft,
  TestTube
} from 'lucide-react';
import Link from 'next/link';

// Datos de ejemplo
const parametrizacionesEjemplo = [
  {
    id: '1',
    procedimiento: 'Hemograma Completo',
    activo: true,
    categorias: 3,
    items: 12,
    fechaCreacion: '2024-01-15',
    fechaModificacion: '2024-01-20',
  },
  {
    id: '2',
    procedimiento: 'Glicemia en Ayunas',
    activo: true,
    categorias: 1,
    items: 1,
    fechaCreacion: '2024-01-10',
    fechaModificacion: '2024-01-10',
  },
  {
    id: '3',
    procedimiento: 'Perfil Lipídico',
    activo: false,
    categorias: 2,
    items: 8,
    fechaCreacion: '2024-01-05',
    fechaModificacion: '2024-01-18',
  },
];

export default function ParametrizacionListadoPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const parametrizacionesFiltradas = parametrizacionesEjemplo.filter(p =>
    p.procedimiento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const actions = (
    <>
      <Button variant="outline" size="sm" asChild>
        <Link href="/laboratorio/parametrizacion">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/laboratorio/parametrizacion">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Parametrización
        </Link>
      </Button>
    </>
  );

  return (
    <ModulePageLayout
      title="Listado de Parametrizaciones"
      description="Gestione todas las parametrizaciones de laboratorio clínico"
      actions={actions}
      maxWidth="7xl"
    >
      {/* Búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por procedimiento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Parametrizaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Parametrizaciones ({parametrizacionesFiltradas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {parametrizacionesFiltradas.map((param) => (
              <div
                key={param.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TestTube className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{param.procedimiento}</h3>
                      <Badge variant={param.activo ? 'default' : 'secondary'}>
                        {param.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{param.categorias} categorías</span>
                      <span>•</span>
                      <span>{param.items} items</span>
                      <span>•</span>
                      <span>Creado: {param.fechaCreacion}</span>
                      {param.fechaModificacion !== param.fechaCreacion && (
                        <>
                          <span>•</span>
                          <span>Modificado: {param.fechaModificacion}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/laboratorio/parametrizacion?edit=${param.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}

            {parametrizacionesFiltradas.length === 0 && (
              <div className="text-center py-12">
                <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron parametrizaciones
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'Intenta ajustar los términos de búsqueda' 
                    : 'Comience creando una nueva parametrización'}
                </p>
                {!searchTerm && (
                  <Button asChild>
                    <Link href="/laboratorio/parametrizacion">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Parametrización
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ModulePageLayout>
  );
}

