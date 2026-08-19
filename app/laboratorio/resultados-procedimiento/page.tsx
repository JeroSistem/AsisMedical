'use client';

import React, { useState } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Save, 
  Search, 
  HelpCircle, 
  Plus, 
  ExternalLink,
  Pencil,
  Star,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
}

interface Item {
  id: string;
  nombre: string;
  categoriaId: string;
  unidad?: string;
  valorReferencia?: string;
}

export default function ResultadosProcedimientoPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [procedimiento, setProcedimiento] = useState('');
  const [procedimientoSearch, setProcedimientoSearch] = useState('');
  const [activo, setActivo] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [showCategoriaDialog, setShowCategoriaDialog] = useState(false);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '', descripcion: '' });
  const [nuevoItem, setNuevoItem] = useState({ 
    nombre: '', 
    categoriaId: '', 
    unidad: '', 
    valorReferencia: '' 
  });

  // Procedimientos de ejemplo para la búsqueda
  const procedimientosEjemplo = [
    { id: '1', nombre: 'Hemograma Completo' },
    { id: '2', nombre: 'Glicemia en Ayunas' },
    { id: '3', nombre: 'Perfil Lipídico' },
    { id: '4', nombre: 'Creatinina' },
    { id: '5', nombre: 'Urea' },
  ];

  const procedimientosFiltrados = procedimientosEjemplo.filter(p =>
    p.nombre.toLowerCase().includes(procedimientoSearch.toLowerCase())
  );

  const handleGuardar = async () => {
    if (!procedimiento) {
      toast({
        title: 'Error',
        description: 'Debe seleccionar un procedimiento',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Guardado exitoso',
        description: 'La parametrización se ha guardado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la parametrización',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgregarCategoria = () => {
    if (!nuevaCategoria.nombre.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre de la categoría es requerido',
        variant: 'destructive',
      });
      return;
    }

    const categoria: Categoria = {
      id: Date.now().toString(),
      nombre: nuevaCategoria.nombre,
      descripcion: nuevaCategoria.descripcion,
    };

    setCategorias([...categorias, categoria]);
    setNuevaCategoria({ nombre: '', descripcion: '' });
    setShowCategoriaDialog(false);
    
    toast({
      title: 'Categoría agregada',
      description: `La categoría "${categoria.nombre}" ha sido agregada`,
    });
  };

  const handleAgregarItem = () => {
    if (!nuevoItem.nombre.trim() || !nuevoItem.categoriaId) {
      toast({
        title: 'Error',
        description: 'El nombre y la categoría son requeridos',
        variant: 'destructive',
      });
      return;
    }

    const item: Item = {
      id: Date.now().toString(),
      nombre: nuevoItem.nombre,
      categoriaId: nuevoItem.categoriaId,
      unidad: nuevoItem.unidad,
      valorReferencia: nuevoItem.valorReferencia,
    };

    setItems([...items, item]);
    setNuevoItem({ nombre: '', categoriaId: '', unidad: '', valorReferencia: '' });
    setShowItemDialog(false);
    
    toast({
      title: 'Item agregado',
      description: `El item "${item.nombre}" ha sido agregado`,
    });
  };

  const handleEliminarCategoria = (id: string) => {
    setCategorias(categorias.filter(c => c.id !== id));
    setItems(items.filter(i => i.categoriaId !== id));
    toast({
      title: 'Categoría eliminada',
      description: 'La categoría y sus items han sido eliminados',
    });
  };

  const handleEliminarItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    toast({
      title: 'Item eliminado',
      description: 'El item ha sido eliminado',
    });
  };

  const actions = (
    <>
      <Button variant="outline" size="sm" asChild>
        <Link href="/laboratorio/parametrizacion/listado">
          <Search className="h-4 w-4 mr-2" />
          Listado
        </Link>
      </Button>
      <Button variant="outline" size="sm">
        <HelpCircle className="h-4 w-4 mr-2" />
        Ayuda
      </Button>
      <Button size="sm" onClick={handleGuardar} disabled={isLoading}>
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Guardando...' : 'Guardar'}
      </Button>
    </>
  );

  return (
    <ModulePageLayout
      title={
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white rounded-lg p-2">
            <Pencil className="h-5 w-5" />
          </div>
          <span>Parametrización laboratorio clínico</span>
          <Star className="h-5 w-5 text-gray-400 cursor-pointer hover:text-yellow-500" />
        </div>
      }
      description="Configure los parámetros y categorías para los procedimientos de laboratorio"
      actions={actions}
      maxWidth="7xl"
    >
      {/* Sección Información */}
      <Card className="border-l-4 border-l-orange-400">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Información
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Campo Procedimiento */}
          <div className="space-y-2">
            <Label htmlFor="procedimiento" className="text-sm font-medium">
              Procedimiento <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="procedimiento"
                placeholder="Escribe para buscar..."
                value={procedimientoSearch}
                onChange={(e) => {
                  setProcedimientoSearch(e.target.value);
                  if (!e.target.value) {
                    setProcedimiento('');
                  }
                }}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  asChild
                >
                  <Link href="/laboratorio/procedimientos/nuevo">
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                  </Link>
                </Button>
              </div>
              
              {/* Dropdown de resultados */}
              {procedimientoSearch && procedimientosFiltrados.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {procedimientosFiltrados.map((proc) => (
                    <button
                      key={proc.id}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      onClick={() => {
                        setProcedimiento(proc.id);
                        setProcedimientoSearch(proc.nombre);
                      }}
                    >
                      {proc.nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {procedimiento && (
              <p className="text-xs text-gray-500">
                Procedimiento seleccionado: {procedimientosEjemplo.find(p => p.id === procedimiento)?.nombre}
              </p>
            )}
          </div>

          {/* Checkbox Activo */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="activo"
              checked={activo}
              onCheckedChange={(checked) => setActivo(checked === true)}
            />
            <Label htmlFor="activo" className="text-sm font-medium cursor-pointer">
              Activo
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Paneles Categorías e Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Categorías */}
        <Card>
          <CardHeader className="bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Categorías</CardTitle>
              <Dialog open={showCategoriaDialog} onOpenChange={setShowCategoriaDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Categoría</DialogTitle>
                    <DialogDescription>
                      Complete la información de la nueva categoría
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoria-nombre">Nombre *</Label>
                      <Input
                        id="categoria-nombre"
                        value={nuevaCategoria.nombre}
                        onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
                        placeholder="Ej: Hematología"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria-descripcion">Descripción</Label>
                      <Input
                        id="categoria-descripcion"
                        value={nuevaCategoria.descripcion}
                        onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, descripcion: e.target.value })}
                        placeholder="Descripción opcional"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCategoriaDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAgregarCategoria}>
                        Agregar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {categorias.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Button
                  variant="outline"
                  className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                  onClick={() => setShowCategoriaDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Categoría
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {categorias.map((categoria) => (
                  <div
                    key={categoria.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{categoria.nombre}</p>
                      {categoria.descripcion && (
                        <p className="text-sm text-gray-500">{categoria.descripcion}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {items.filter(i => i.categoriaId === categoria.id).length} items
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEliminarCategoria(categoria.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Panel Items */}
        <Card>
          <CardHeader className="bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Items</CardTitle>
              <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={categorias.length === 0}>
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Item</DialogTitle>
                    <DialogDescription>
                      Complete la información del nuevo item
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="item-nombre">Nombre *</Label>
                      <Input
                        id="item-nombre"
                        value={nuevoItem.nombre}
                        onChange={(e) => setNuevoItem({ ...nuevoItem, nombre: e.target.value })}
                        placeholder="Ej: Hemoglobina"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-categoria">Categoría *</Label>
                      <select
                        id="item-categoria"
                        value={nuevoItem.categoriaId}
                        onChange={(e) => setNuevoItem({ ...nuevoItem, categoriaId: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-unidad">Unidad</Label>
                      <Input
                        id="item-unidad"
                        value={nuevoItem.unidad}
                        onChange={(e) => setNuevoItem({ ...nuevoItem, unidad: e.target.value })}
                        placeholder="Ej: g/dL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-valor">Valor de Referencia</Label>
                      <Input
                        id="item-valor"
                        value={nuevoItem.valorReferencia}
                        onChange={(e) => setNuevoItem({ ...nuevoItem, valorReferencia: e.target.value })}
                        placeholder="Ej: 12-16"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowItemDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAgregarItem}>
                        Agregar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {items.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500 mb-4">
                  {categorias.length === 0 
                    ? 'Primero debe agregar una categoría' 
                    : 'No hay items agregados'}
                </p>
                {categorias.length > 0 && (
                  <Button
                    variant="outline"
                    className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                    onClick={() => setShowItemDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Item
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const categoria = categorias.find(c => c.id === item.categoriaId);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.nombre}</p>
                        <div className="flex items-center gap-4 mt-1">
                          {categoria && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {categoria.nombre}
                            </span>
                          )}
                          {item.unidad && (
                            <span className="text-xs text-gray-500">
                              Unidad: {item.unidad}
                            </span>
                          )}
                          {item.valorReferencia && (
                            <span className="text-xs text-gray-500">
                              Ref: {item.valorReferencia}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEliminarItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ModulePageLayout>
  );
}

