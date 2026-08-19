'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  User,
  Phone,
  MapPin,
  Heart,
  Building
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdvancedSearchFilters {
  // Información básica
  name?: string;
  documentNumber?: string;
  documentType?: string;
  
  // Información personal
  gender?: string;
  ageRange?: {
    min?: number;
    max?: number;
  };
  bloodType?: string;
  maritalStatus?: string;
  
  // Información de contacto
  phone?: string;
  email?: string;
  city?: string;
  department?: string;
  
  // Información médica
  hasAllergies?: boolean;
  hasActiveProblems?: boolean;
  
  // Información de seguro
  insuranceProvider?: string;
  
  // Estado del paciente
  status?: string;
  
  // Fechas
  registrationDateRange?: {
    from?: string;
    to?: string;
  };
}

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: AdvancedSearchFilters) => void;
  isLoading?: boolean;
}

const documentTypes = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PAS', label: 'Pasaporte' },
  { value: 'PEP', label: 'Permiso Especial de Permanencia' },
  { value: 'PPT', label: 'Permiso de Protección Temporal' }
];

const genderOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' }
];

const bloodTypes = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' }
];

const maritalStatusOptions = [
  { value: 'SOLTERO', label: 'Soltero' },
  { value: 'CASADO', label: 'Casado' },
  { value: 'UNION_LIBRE', label: 'Unión Libre' },
  { value: 'DIVORCIADO', label: 'Divorciado' },
  { value: 'VIUDO', label: 'Viudo' }
];

const statusOptions = [
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'INACTIVE', label: 'Inactivo' }
];

const departments = [
  'Antioquia', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá', 'Cauca', 'Cesar', 'Chocó',
  'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander',
  'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
];

export function AdvancedSearchModal({ isOpen, onClose, onSearch, isLoading = false }: AdvancedSearchModalProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<AdvancedSearchFilters>({});
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const updateFilter = (key: keyof AdvancedSearchFilters, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Actualizar filtros activos
      const newActiveFilters: string[] = [];
      Object.entries(newFilters).forEach(([k, v]) => {
        if (v !== undefined && v !== '' && v !== null) {
          if (typeof v === 'object') {
            if (v.min !== undefined || v.max !== undefined || v.from !== undefined || v.to !== undefined) {
              newActiveFilters.push(k);
            }
          } else if (v !== false) {
            newActiveFilters.push(k);
          }
        }
      });
      setActiveFilters(newActiveFilters);
      
      return newFilters;
    });
  };

  const clearFilter = (key: keyof AdvancedSearchFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
    setActiveFilters([]);
  };

  const handleSearch = () => {
    // Construir la URL de búsqueda con los filtros
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'object') {
          if (key === 'ageRange') {
            if (value.min) searchParams.append('ageMin', value.min.toString());
            if (value.max) searchParams.append('ageMax', value.max.toString());
          } else if (key === 'registrationDateRange') {
            if (value.from) searchParams.append('dateFrom', value.from);
            if (value.to) searchParams.append('dateTo', value.to);
          }
        } else if (typeof value === 'boolean') {
          searchParams.append(key, value.toString());
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    
    // Navegar a la página de búsqueda
    const searchUrl = `/patients/busqueda?${searchParams.toString()}`;
    router.push(searchUrl);
    onClose();
  };

  const getFilterLabel = (key: string): string => {
    const labels: Record<string, string> = {
      name: 'Nombre',
      documentNumber: 'Documento',
      documentType: 'Tipo de Documento',
      gender: 'Género',
      ageRange: 'Rango de Edad',
      bloodType: 'Tipo de Sangre',
      maritalStatus: 'Estado Civil',
      phone: 'Teléfono',
      email: 'Email',
      city: 'Ciudad',
      department: 'Departamento',
      hasAllergies: 'Alergias',
      hasActiveProblems: 'Problemas Activos',
      insuranceProvider: 'Aseguradora',
      status: 'Estado',
      registrationDateRange: 'Fecha de Registro'
    };
    return labels[key] || key;
  };

  const getFilterValue = (key: string, value: any): string => {
    if (typeof value === 'object') {
      if (key === 'ageRange') {
        const parts = [];
        if (value.min) parts.push(`Mín: ${value.min}`);
        if (value.max) parts.push(`Máx: ${value.max}`);
        return parts.join(', ');
      }
      if (key === 'registrationDateRange') {
        const parts = [];
        if (value.from) parts.push(`Desde: ${value.from}`);
        if (value.to) parts.push(`Hasta: ${value.to}`);
        return parts.join(', ');
      }
    }
    
    if (key === 'documentType') {
      return documentTypes.find(dt => dt.value === value)?.label || value;
    }
    if (key === 'gender') {
      return genderOptions.find(g => g.value === value)?.label || value;
    }
    if (key === 'bloodType') {
      return bloodTypes.find(bt => bt.value === value)?.label || value;
    }
    if (key === 'maritalStatus') {
      return maritalStatusOptions.find(ms => ms.value === value)?.label || value;
    }
    if (key === 'status') {
      return statusOptions.find(s => s.value === value)?.label || value;
    }
    
    return String(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Search className="h-6 w-6" />
              Búsqueda Avanzada
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filtros Activos */}
          {activeFilters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros Activos ({activeFilters.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map(filterKey => (
                    <Badge key={filterKey} variant="secondary" className="flex items-center gap-1">
                      {getFilterLabel(filterKey)}: {getFilterValue(filterKey, filters[filterKey as keyof AdvancedSearchFilters])}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => clearFilter(filterKey as keyof AdvancedSearchFilters)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    Limpiar Todos
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Buscar por nombre..."
                  value={filters.name || ''}
                  onChange={(e) => updateFilter('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentNumber">Número de Documento</Label>
                <Input
                  id="documentNumber"
                  placeholder="Número de documento..."
                  value={filters.documentNumber || ''}
                  onChange={(e) => updateFilter('documentNumber', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentType">Tipo de Documento</Label>
                <Select value={filters.documentType} onValueChange={(value) => updateFilter('documentType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <Select value={filters.gender} onValueChange={(value) => updateFilter('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map(gender => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Rango de Edad</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={filters.ageRange?.min || ''}
                    onChange={(e) => updateFilter('ageRange', { 
                      ...filters.ageRange, 
                      min: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={filters.ageRange?.max || ''}
                    onChange={(e) => updateFilter('ageRange', { 
                      ...filters.ageRange, 
                      max: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodType">Tipo de Sangre</Label>
                <Select value={filters.bloodType} onValueChange={(value) => updateFilter('bloodType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Estado Civil</Label>
                <Select value={filters.maritalStatus} onValueChange={(value) => updateFilter('maritalStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {maritalStatusOptions.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  placeholder="Buscar por teléfono..."
                  value={filters.phone || ''}
                  onChange={(e) => updateFilter('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Buscar por email..."
                  value={filters.email || ''}
                  onChange={(e) => updateFilter('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  placeholder="Buscar por ciudad..."
                  value={filters.city || ''}
                  onChange={(e) => updateFilter('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select value={filters.department} onValueChange={(value) => updateFilter('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Información Médica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Información Médica
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasAllergies"
                  checked={filters.hasAllergies || false}
                  onCheckedChange={(checked) => updateFilter('hasAllergies', checked)}
                />
                <Label htmlFor="hasAllergies">Tiene Alergias</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasActiveProblems"
                  checked={filters.hasActiveProblems || false}
                  onCheckedChange={(checked) => updateFilter('hasActiveProblems', checked)}
                />
                <Label htmlFor="hasActiveProblems">Tiene Problemas Activos</Label>
              </div>
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Información Adicional
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Aseguradora</Label>
                <Input
                  id="insuranceProvider"
                  placeholder="Buscar por aseguradora..."
                  value={filters.insuranceProvider || ''}
                  onChange={(e) => updateFilter('insuranceProvider', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado del Paciente</Label>
                <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Fechas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Fecha de Registro
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Desde</Label>
                <Input
                  type="date"
                  value={filters.registrationDateRange?.from || ''}
                  onChange={(e) => updateFilter('registrationDateRange', { 
                    ...filters.registrationDateRange, 
                    from: e.target.value 
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Hasta</Label>
                <Input
                  type="date"
                  value={filters.registrationDateRange?.to || ''}
                  onChange={(e) => updateFilter('registrationDateRange', { 
                    ...filters.registrationDateRange, 
                    to: e.target.value 
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Buscando...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
