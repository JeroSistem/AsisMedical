'use client';

import React, { useState, useEffect } from 'react';
import { TabEnableToggle, TabContentWrapper } from '@/components/modules/configuracion/tab-enable-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Info, Plus, Edit, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface ClinicalRecordsTabProps {
  onChange?: () => void;
  entityId?: string | null;
}

const DEFAULT_TEMPLATES = [
  { id: '1', name: 'SOAP - Nota de Evolución', type: 'soap', required: true },
  { id: '2', name: 'Epicrisis', type: 'epicrisis', required: true },
  { id: '3', name: 'Consentimiento Informado', type: 'consent', required: true },
  { id: '4', name: 'Historia Clínica Completa', type: 'full-history', required: false },
  { id: '5', name: 'Nota de Ingreso', type: 'admission', required: false },
];

export function ClinicalRecordsTab({ onChange, entityId }: ClinicalRecordsTabProps) {
  const [enabled, setEnabled] = useState(true);
  const [formData, setFormData] = useState({
    icdVersion: 'ICD-10',
    requiredFields: ['alergias', 'diagnostico'],
    exportFormats: ['pdf', 'docx'],
    maxAttachmentSize: 50,
  });

  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);

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
      const response = await fetch(`/api/configuracion/general?category=clinical&entityId=${entityId}`);
      const result = await response.json();
      if (result.success && result.data) {
        const enabledConfig = result.data.find((config: any) => 
          config.key === 'clinical.enabled' || config.key === 'enabled'
        );
        if (enabledConfig) {
          setEnabled(enabledConfig.value === true);
        }
      }
    } catch (error) {
      console.error('Error cargando estado de historia clínica:', error);
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
            configs: { 'clinical.enabled': newEnabled },
            category: 'clinical',
            entityId: entityId,
          }),
        });
      } catch (error) {
        console.error('Error guardando estado de historia clínica:', error);
      }
    }
  };

  const handleChange = (field: string, value: any) => {
    if (!enabled) return;
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange?.();
  };

  const toggleRequiredField = (field: string) => {
    const newFields = formData.requiredFields.includes(field)
      ? formData.requiredFields.filter(f => f !== field)
      : [...formData.requiredFields, field];
    handleChange('requiredFields', newFields);
  };

  const toggleExportFormat = (format: string) => {
    const newFormats = formData.exportFormats.includes(format)
      ? formData.exportFormats.filter(f => f !== format)
      : [...formData.exportFormats, format];
    handleChange('exportFormats', newFormats);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Historia Clínica / Documentos</h3>
          <p className="text-sm text-muted-foreground">
            Configura las plantillas y comportamiento de documentos clínicos
          </p>
        </div>
      </div>

      {/* Toggle para activar/desactivar configuración */}
      {entityId && (
        <TabEnableToggle
          entityId={entityId}
          category="clinical"
          label="Configuración de Historia Clínica"
          description={enabled 
            ? 'La configuración de historia clínica está habilitada para esta institución. Puedes modificar los campos a continuación.'
            : 'La configuración de historia clínica está deshabilitada para esta institución. Todos los campos están bloqueados.'}
          enabled={enabled}
          onToggle={handleToggle}
        />
      )}

      <TabContentWrapper
        entityId={entityId}
        category="clinical"
        label="Configuración de Historia Clínica"
        description=""
        enabled={enabled}
      >

      {/* Versión CIE/ICD */}
      <Card>
        <CardHeader>
          <CardTitle>Clasificación de Enfermedades</CardTitle>
          <CardDescription>
            Versión de CIE / ICD utilizada en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="icdVersion" className="flex items-center gap-2">
              Versión CIE/ICD <span className="text-red-500">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Clasificación Internacional de Enfermedades utilizada para codificación de diagnósticos</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select value={formData.icdVersion} onValueChange={(value) => handleChange('icdVersion', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ICD-9">ICD-9 (Obsoleto)</SelectItem>
                <SelectItem value="ICD-10">ICD-10 (Actual - Colombia)</SelectItem>
                <SelectItem value="ICD-11">ICD-11 (Más reciente)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campos Obligatorios */}
      <Card>
        <CardHeader>
          <CardTitle>Campos Obligatorios</CardTitle>
          <CardDescription>
            Define qué campos son obligatorios al crear una nota clínica
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="field-alergias"
              checked={formData.requiredFields.includes('alergias')}
              onCheckedChange={() => toggleRequiredField('alergias')}
            />
            <Label htmlFor="field-alergias" className="font-normal cursor-pointer">
              Alergias
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="field-diagnostico"
              checked={formData.requiredFields.includes('diagnostico')}
              onCheckedChange={() => toggleRequiredField('diagnostico')}
            />
            <Label htmlFor="field-diagnostico" className="font-normal cursor-pointer">
              Código de Diagnóstico (CIE/ICD)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="field-motivo"
              checked={formData.requiredFields.includes('motivo')}
              onCheckedChange={() => toggleRequiredField('motivo')}
            />
            <Label htmlFor="field-motivo" className="font-normal cursor-pointer">
              Motivo de Consulta
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="field-plan"
              checked={formData.requiredFields.includes('plan')}
              onCheckedChange={() => toggleRequiredField('plan')}
            />
            <Label htmlFor="field-plan" className="font-normal cursor-pointer">
              Plan de Tratamiento
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="field-signos-vitales"
              checked={formData.requiredFields.includes('signos-vitales')}
              onCheckedChange={() => toggleRequiredField('signos-vitales')}
            />
            <Label htmlFor="field-signos-vitales" className="font-normal cursor-pointer">
              Signos Vitales
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Plantillas de Documentos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Plantillas de Documentos Clínicos</CardTitle>
              <CardDescription>
                Gestiona las plantillas para documentos clínicos
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Plantilla
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{template.name}</p>
                      {template.required && (
                        <Badge variant="secondary">Obligatoria</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">
                      Tipo: {template.type}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!template.required && (
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formatos de Exportación */}
      <Card>
        <CardHeader>
          <CardTitle>Formatos de Exportación</CardTitle>
          <CardDescription>
            Selecciona los formatos disponibles para exportar documentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="format-pdf"
              checked={formData.exportFormats.includes('pdf')}
              onCheckedChange={() => toggleExportFormat('pdf')}
            />
            <Label htmlFor="format-pdf" className="font-normal cursor-pointer">
              PDF - Portable Document Format
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="format-docx"
              checked={formData.exportFormats.includes('docx')}
              onCheckedChange={() => toggleExportFormat('docx')}
            />
            <Label htmlFor="format-docx" className="font-normal cursor-pointer">
              DOCX - Microsoft Word
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="format-cda"
              checked={formData.exportFormats.includes('cda')}
              onCheckedChange={() => toggleExportFormat('cda')}
            />
            <Label htmlFor="format-cda" className="font-normal cursor-pointer">
              CDA - Clinical Document Architecture
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="format-fhir"
              checked={formData.exportFormats.includes('fhir')}
              onCheckedChange={() => toggleExportFormat('fhir')}
            />
            <Label htmlFor="format-fhir" className="font-normal cursor-pointer">
              FHIR DocumentReference
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Límite de Adjuntos */}
      <Card>
        <CardHeader>
          <CardTitle>Adjuntos en Expedientes</CardTitle>
          <CardDescription>
            Configura el tamaño máximo de archivos adjuntos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxAttachmentSize" className="flex items-center gap-2">
              Tamaño Máximo por Expediente (MB)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Límite total de archivos adjuntos por expediente de paciente</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="maxAttachmentSize"
              type="number"
              min={1}
              max={500}
              value={formData.maxAttachmentSize}
              onChange={(e) => handleChange('maxAttachmentSize', parseInt(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Recomendado: 50 MB. Máximo permitido: 500 MB
            </p>
          </div>
        </CardContent>
      </Card>
      </TabContentWrapper>
    </div>
  );
}

