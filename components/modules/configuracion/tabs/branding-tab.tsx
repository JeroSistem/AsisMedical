'use client';

import React, { useState, useEffect } from 'react';
import { TabEnableToggle, TabContentWrapper } from '@/components/modules/configuracion/tab-enable-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Palette, Info, Upload, Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BrandingTabProps {
  onChange?: () => void;
  entityId?: string | null;
}

export function BrandingTab({ onChange, entityId }: BrandingTabProps) {
  const [enabled, setEnabled] = useState(true);
  const [formData, setFormData] = useState({
    logo: null as File | null,
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    accentColor: '#10b981',
    footerText: 'Derechos reservados © 2025 Hospital. Todos los derechos reservados.',
    darkModeDefault: false,
    defaultDashboard: 'clinician',
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Cargar estado de activación
  useEffect(() => {
    if (entityId) {
      loadEnabledState();
    } else {
      setEnabled(true);
    }
  }, [entityId]);

  const loadEnabledState = async () => {
    if (!entityId) return;
    try {
      const response = await fetch(`/api/configuracion/general?category=branding&entityId=${entityId}`);
      const result = await response.json();
      if (result.success && result.data) {
        const enabledConfig = result.data.find((config: any) => 
          config.key === 'branding.enabled' || config.key === 'enabled'
        );
        if (enabledConfig) {
          setEnabled(enabledConfig.value === true);
        }
      }
    } catch (error) {
      console.error('Error cargando estado de branding:', error);
    }
  };

  const handleToggle = async (newEnabled: boolean) => {
    setEnabled(newEnabled);
    onChange?.();
    if (entityId) {
      try {
        await fetch('/api/configuracion/general', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            configs: { 'branding.enabled': newEnabled },
            category: 'branding',
            entityId: entityId,
          }),
        });
      } catch (error) {
        console.error('Error guardando estado de branding:', error);
      }
    }
  };

  const handleChange = (field: string, value: any) => {
    if (!enabled) return;
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange?.();
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tamaño (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 2MB.');
        return;
      }

      // Validar tipo
      if (!['image/png', 'image/svg+xml', 'image/jpeg'].includes(file.type)) {
        alert('Formato no válido. Use PNG, SVG o JPEG.');
        return;
      }

      setFormData(prev => ({ ...prev, logo: file }));
      
      // Generar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      onChange?.();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">UI / Branding</h3>
          <p className="text-sm text-muted-foreground">
            Personaliza la apariencia de la aplicación
          </p>
        </div>
      </div>

      {/* Toggle para activar/desactivar configuración */}
      {entityId && (
        <TabEnableToggle
          entityId={entityId}
          category="branding"
          label="Configuración de Branding"
          description={enabled 
            ? 'La configuración de branding está habilitada para esta institución. Puedes modificar los campos a continuación.'
            : 'La configuración de branding está deshabilitada para esta institución. Todos los campos están bloqueados.'}
          enabled={enabled}
          onToggle={handleToggle}
        />
      )}

      <TabContentWrapper
        entityId={entityId}
        category="branding"
        label="Configuración de Branding"
        description=""
        enabled={enabled}
      >

      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Logo de la Institución</CardTitle>
          <CardDescription>
            Sube el logo que aparecerá en la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Tamaño máximo: 2MB. Formatos aceptados: PNG, SVG, JPEG. Dimensiones recomendadas: 250x60 px
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Logo
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/png,image/svg+xml,image/jpeg"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              </Button>
              
              {logoPreview && (
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Vista Previa
                </Button>
              )}
            </div>

            {/* Preview del logo */}
            {logoPreview && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">Vista Previa:</p>
                <div className="bg-white p-4 rounded border inline-block">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="max-h-16 max-w-[250px] object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Paleta de Colores */}
      <Card>
        <CardHeader>
          <CardTitle>Paleta de Colores</CardTitle>
          <CardDescription>
            Personaliza los colores principales de la interfaz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Color primario */}
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Color Primario</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="flex-1"
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            {/* Color secundario */}
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Color Secundario</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="flex-1"
                  placeholder="#8b5cf6"
                />
              </div>
            </div>

            {/* Color de acento */}
            <div className="space-y-2">
              <Label htmlFor="accentColor">Color de Acento</Label>
              <div className="flex gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className="flex-1"
                  placeholder="#10b981"
                />
              </div>
            </div>
          </div>

          {/* Preview de colores */}
          <div className="border rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium mb-3">Vista Previa de Colores:</p>
            <div className="flex gap-2">
              <div 
                className="h-12 flex-1 rounded border flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: formData.primaryColor }}
              >
                Primario
              </div>
              <div 
                className="h-12 flex-1 rounded border flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: formData.secondaryColor }}
              >
                Secundario
              </div>
              <div 
                className="h-12 flex-1 rounded border flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: formData.accentColor }}
              >
                Acento
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Texto Legal / Footer */}
      <Card>
        <CardHeader>
          <CardTitle>Texto Legal / Footer</CardTitle>
          <CardDescription>
            Texto que aparecerá en el pie de página
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footerText">Texto del Footer</Label>
            <Textarea
              id="footerText"
              value={formData.footerText}
              onChange={(e) => handleChange('footerText', e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              Máximo 500 caracteres
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preferencias de Interfaz */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias de Interfaz</CardTitle>
          <CardDescription>
            Configuración predeterminada de la interfaz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Modo oscuro por defecto */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo Oscuro por Defecto</Label>
              <p className="text-sm text-muted-foreground">
                Activar el modo oscuro para nuevos usuarios
              </p>
            </div>
            <Switch
              checked={formData.darkModeDefault}
              onCheckedChange={(checked) => handleChange('darkModeDefault', checked)}
            />
          </div>

          {/* Dashboard por defecto */}
          <div className="space-y-2">
            <Label htmlFor="defaultDashboard">Dashboard por Defecto</Label>
            <Select value={formData.defaultDashboard} onValueChange={(value) => handleChange('defaultDashboard', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clinician">Vista Clínica (Médicos)</SelectItem>
                <SelectItem value="admin">Vista Administrativa</SelectItem>
                <SelectItem value="reception">Vista Recepción</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      </TabContentWrapper>
    </div>
  );
}

