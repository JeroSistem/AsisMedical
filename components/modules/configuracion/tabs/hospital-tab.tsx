'use client';

import React, { useState, useEffect } from 'react';
import { TabEnableToggle, TabContentWrapper } from '@/components/modules/configuracion/tab-enable-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HospitalTabProps {
  onChange?: () => void;
  onDataChange?: (data: any) => void;
  initialData?: any;
  onGetData?: () => any;
  entityId?: string | null;
}

export function HospitalTab({ onChange, onDataChange, initialData, onGetData, entityId }: HospitalTabProps) {
  const [enabled, setEnabled] = useState(true);
  const [formData, setFormData] = useState({
    hospitalName: initialData?.hospitalName || '',
    nit: initialData?.nit || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    department: initialData?.department || '',
    contactName: initialData?.contactName || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    timezone: initialData?.timezone || 'America/Bogota',
    language: initialData?.language || 'es-CO',
  });

  const handleChange = (field: string, value: string) => {
    if (!enabled) return; // No permitir cambios si está desactivado
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange?.();
    onDataChange?.(newData);
  };

  // Actualizar formData cuando cambie initialData (solo una vez al cargar)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => {
        // Solo actualizar si los datos son diferentes para evitar loops
        const hasChanges = Object.keys(initialData).some(
          key => prev[key as keyof typeof prev] !== initialData[key]
        );
        if (hasChanges) {
          return {
            ...prev,
            ...initialData
          };
        }
        return prev;
      });
    }
  }, [initialData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Información del Hospital u Organización</h3>
          <p className="text-sm text-muted-foreground">
            Configura los datos básicos de tu institución
          </p>
        </div>
      </div>

      {/* Toggle para activar/desactivar configuración */}
      {entityId && (
        <TabEnableToggle
          entityId={entityId}
          category="hospital"
          label="Configuración de Hospital"
          description={enabled 
            ? 'Los datos del hospital están habilitados para esta institución. Puedes modificar los campos a continuación.'
            : 'Los datos del hospital están deshabilitados para esta institución. Todos los campos están bloqueados.'}
          enabled={enabled}
          onToggle={setEnabled}
        />
      )}

      <TabContentWrapper
        entityId={entityId}
        category="hospital"
        label="Configuración de Hospital"
        description=""
        enabled={enabled}
      >

      <Card>
        <CardHeader>
          <CardTitle>Datos Generales</CardTitle>
          <CardDescription>
            Información institucional y de contacto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nombre del hospital */}
          <div className="space-y-2">
            <Label htmlFor="hospitalName" className="flex items-center gap-2">
              Nombre del Hospital <span className="text-red-500">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Nombre oficial de la institución. Este nombre aparecerá en documentos oficiales y reportes.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="hospitalName"
              placeholder="Hospital San Jorge"
              value={formData.hospitalName}
              onChange={(e) => handleChange('hospitalName', e.target.value)}
              maxLength={150}
              required
              disabled={!enabled}
            />
            <p className="text-xs text-muted-foreground">
              Máximo 150 caracteres
            </p>
          </div>

          {/* NIT */}
          <div className="space-y-2">
            <Label htmlFor="nit" className="flex items-center gap-2">
              NIT / Identificación Fiscal <span className="text-red-500">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Número de Identificación Tributaria de la institución</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="nit"
              placeholder="900123456-7"
              value={formData.nit}
              onChange={(e) => handleChange('nit', e.target.value)}
              pattern="[0-9-]*"
              required
            />
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Textarea
              id="address"
              placeholder="Calle 50 # 30-10"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
            />
          </div>

          {/* Ciudad y Departamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                placeholder="Medellín"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un departamento" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="antioquia">Antioquia</SelectItem>
                  <SelectItem value="atlantico">Atlántico</SelectItem>
                  <SelectItem value="bogota">Bogotá D.C.</SelectItem>
                  <SelectItem value="bolivar">Bolívar</SelectItem>
                  <SelectItem value="boyaca">Boyacá</SelectItem>
                  <SelectItem value="caldas">Caldas</SelectItem>
                  <SelectItem value="caqueta">Caquetá</SelectItem>
                  <SelectItem value="cauca">Cauca</SelectItem>
                  <SelectItem value="cesar">Cesar</SelectItem>
                  <SelectItem value="choco">Chocó</SelectItem>
                  <SelectItem value="cordoba">Córdoba</SelectItem>
                  <SelectItem value="cundinamarca">Cundinamarca</SelectItem>
                  <SelectItem value="guainia">Guainía</SelectItem>
                  <SelectItem value="guaviare">Guaviare</SelectItem>
                  <SelectItem value="huila">Huila</SelectItem>
                  <SelectItem value="la-guajira">La Guajira</SelectItem>
                  <SelectItem value="magdalena">Magdalena</SelectItem>
                  <SelectItem value="meta">Meta</SelectItem>
                  <SelectItem value="narino">Nariño</SelectItem>
                  <SelectItem value="norte-de-santander">Norte de Santander</SelectItem>
                  <SelectItem value="putumayo">Putumayo</SelectItem>
                  <SelectItem value="quindio">Quindío</SelectItem>
                  <SelectItem value="risaralda">Risaralda</SelectItem>
                  <SelectItem value="san-andres">San Andrés y Providencia</SelectItem>
                  <SelectItem value="santander">Santander</SelectItem>
                  <SelectItem value="sucre">Sucre</SelectItem>
                  <SelectItem value="tolima">Tolima</SelectItem>
                  <SelectItem value="valle-del-cauca">Valle del Cauca</SelectItem>
                  <SelectItem value="vaupes">Vaupés</SelectItem>
                  <SelectItem value="vichada">Vichada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contacto Administrativo</CardTitle>
          <CardDescription>
            Persona de contacto para asuntos administrativos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nombre de contacto */}
          <div className="space-y-2">
            <Label htmlFor="contactName">Nombre Completo</Label>
            <Input
              id="contactName"
              placeholder="Dr. Juan Pérez"
              value={formData.contactName}
              onChange={(e) => handleChange('contactName', e.target.value)}
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              Teléfono de Contacto
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Formato recomendado: +57 312 5550000 (E.164)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+57 312 5550000"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          {/* Email institucional */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              Correo Institucional <span className="text-red-500">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Correo principal de contacto. Se verificará el registro MX.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@hospital.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración Regional</CardTitle>
          <CardDescription>
            Zona horaria e idioma del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Zona horaria */}
          <div className="space-y-2">
            <Label htmlFor="timezone" className="flex items-center gap-2">
              Zona Horaria <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.timezone} onValueChange={(value) => handleChange('timezone', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Bogota">América/Bogotá (GMT-5)</SelectItem>
                <SelectItem value="America/Mexico_City">América/Ciudad de México (GMT-6)</SelectItem>
                <SelectItem value="America/Lima">América/Lima (GMT-5)</SelectItem>
                <SelectItem value="America/Buenos_Aires">América/Buenos Aires (GMT-3)</SelectItem>
                <SelectItem value="America/Santiago">América/Santiago (GMT-3)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Idioma */}
          <div className="space-y-2">
            <Label htmlFor="language" className="flex items-center gap-2">
              Idioma por Defecto <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.language} onValueChange={(value) => handleChange('language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es-CO">Español (Colombia)</SelectItem>
                <SelectItem value="es-MX">Español (México)</SelectItem>
                <SelectItem value="es-ES">Español (España)</SelectItem>
                <SelectItem value="en-US">English (United States)</SelectItem>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      </TabContentWrapper>
    </div>
  );
}

