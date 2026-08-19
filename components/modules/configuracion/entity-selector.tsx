'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Building2, Search, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface Entity {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface EntitySelectorProps {
  selectedEntityId: string | null;
  onEntitySelect: (entityId: string | null) => void;
  placeholder?: string;
  showClear?: boolean;
}

export function EntitySelector({
  selectedEntityId,
  onEntitySelect,
  placeholder = 'Buscar institución...',
  showClear = true,
}: EntitySelectorProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  // Cargar entidades al montar
  useEffect(() => {
    loadEntities();
  }, []);

  // Cargar entidad seleccionada cuando cambia selectedEntityId
  useEffect(() => {
    if (selectedEntityId) {
      const entity = entities.find((e) => e.id === selectedEntityId);
      setSelectedEntity(entity || null);
    } else {
      setSelectedEntity(null);
    }
  }, [selectedEntityId, entities]);

  const loadEntities = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/configuracion/entities');
      const result = await response.json();

      if (result.success) {
        setEntities(result.data || []);
      } else {
        console.error('Error cargando entidades:', result.error);
      }
    } catch (error: any) {
      console.error('Error cargando entidades:', error);
      toast.error('Error al cargar instituciones');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntities = entities.filter((entity) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      entity.name.toLowerCase().includes(query) ||
      entity.type.toLowerCase().includes(query)
    );
  });

  const handleSelectEntity = (entity: Entity) => {
    setSelectedEntity(entity);
    onEntitySelect(entity.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClearSelection = () => {
    setSelectedEntity(null);
    onEntitySelect(null);
    setSearchQuery('');
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      HOSPITAL: 'Hospital',
      CLINICA: 'Clínica',
      CENTRO_MEDICO: 'Centro Médico',
      LABORATORIO: 'Laboratorio',
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-2">
      <Label>Institución</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {selectedEntity ? (
                <>
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">{selectedEntity.name}</span>
                  <Badge variant="secondary" className="ml-auto shrink-0">
                    {getTypeLabel(selectedEntity.type)}
                  </Badge>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 shrink-0" />
                  <span className="text-muted-foreground">{placeholder}</span>
                </>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o tipo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
              {showClear && selectedEntity && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="h-9 w-9 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <ScrollArea className="h-[300px]">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Cargando instituciones...
              </div>
            ) : filteredEntities.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {searchQuery
                  ? 'No se encontraron instituciones'
                  : 'No hay instituciones disponibles. Crea una en la pestaña Instituciones.'}
              </div>
            ) : (
              <div className="p-1">
                {filteredEntities.map((entity) => (
                  <div
                    key={entity.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent ${
                      selectedEntityId === entity.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => handleSelectEntity(entity)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{entity.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {getTypeLabel(entity.type)}
                        </div>
                      </div>
                    </div>
                    {selectedEntityId === entity.id && (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
      {selectedEntity && (
        <p className="text-xs text-muted-foreground">
          Configurando datos para: <span className="font-medium">{selectedEntity.name}</span>
        </p>
      )}
    </div>
  );
}
