'use client';

import React, { useState, useRef, useCallback } from 'react';
import { ModulePageLayout, ModuleCard } from '@/components/shared/module-page-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { InstitutionsTab } from '@/components/modules/configuracion/tabs/institutions-tab';
import { HospitalTab } from '@/components/modules/configuracion/tabs/hospital-tab';
import { SecurityTab } from '@/components/modules/configuracion/tabs/security-tab';
import { RolesTab } from '@/components/modules/configuracion/tabs/roles-tab';
import { IntegrationsTab } from '@/components/modules/configuracion/tabs/integrations-tab';
import { ClinicalRecordsTab } from '@/components/modules/configuracion/tabs/clinical-records-tab';
import { NotificationsTab } from '@/components/modules/configuracion/tabs/notifications-tab';
import { BackupTab } from '@/components/modules/configuracion/tabs/backup-tab';
import { BrandingTab } from '@/components/modules/configuracion/tabs/branding-tab';
import { AdvancedTab } from '@/components/modules/configuracion/tabs/advanced-tab';
import { EntitySelector } from '@/components/modules/configuracion/entity-selector';

export default function ConfiguracionGeneralPage() {
  const [activeTab, setActiveTab] = useState('institutions');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [hospitalData, setHospitalData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hospitalDataRef = useRef<any>(null);

  // Función memoizada para actualizar datos del hospital
  const handleHospitalDataChange = useCallback((data: any) => {
    console.log('HospitalTab onDataChange:', data);
    setHospitalData(data);
    hospitalDataRef.current = data;
  }, []);

  // Cargar datos guardados cuando cambia la entidad seleccionada o el tab activo
  React.useEffect(() => {
    if (activeTab === 'hospital' && selectedEntityId) {
      loadHospitalData();
    }
  }, [selectedEntityId, activeTab]);

  const loadHospitalData = async () => {
    try {
      const url = `/api/configuracion/general?category=hospital${selectedEntityId ? `&entityId=${selectedEntityId}` : ''}`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success && result.data) {
        // Convertir array de configuraciones a objeto plano
        const configObject: any = {};
        if (Array.isArray(result.data)) {
          result.data.forEach((config: any) => {
            // Remover el prefijo "hospital." si existe
            const key = config.key.replace(/^hospital\./, '');
            configObject[key] = config.value;
          });
        }
        setHospitalData(configObject);
        hospitalDataRef.current = configObject;
      } else {
        // Si no hay datos, inicializar vacío
        setHospitalData({});
        hospitalDataRef.current = {};
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
      setHospitalData({});
      hospitalDataRef.current = {};
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validar que haya una entidad seleccionada (excepto en la pestaña de Instituciones)
      if (activeTab !== 'institutions' && !selectedEntityId) {
        toast.error('Por favor selecciona una institución antes de guardar');
        setIsLoading(false);
        return;
      }

      // Para la pestaña de Roles, los cambios se guardan automáticamente
      if (activeTab === 'roles') {
        toast.info('Los cambios en roles y permisos se guardan automáticamente al modificar los switches.');
        setIsLoading(false);
        return;
      }

      // Para la pestaña de Instituciones, no hay datos de formulario que guardar aquí
      if (activeTab === 'institutions') {
        toast.info('Las instituciones se gestionan directamente desde la tabla. No hay datos adicionales que guardar.');
        setIsLoading(false);
        return;
      }

      // Recopilar datos de todos los tabs (por ahora solo hospital)
      const configsToSave: any = {};
      
      // Obtener datos actuales del formulario
      // Usar hospitalDataRef que se actualiza en tiempo real con cada cambio
      const currentHospitalData = hospitalDataRef.current || hospitalData;
      
      if (!currentHospitalData || Object.keys(currentHospitalData).length === 0) {
        toast.error('No hay datos para guardar. Completa al menos un campo del formulario.');
        setIsLoading(false);
        return;
      }
      
      // Guardar todos los campos del formulario
      Object.entries(currentHospitalData).forEach(([key, value]) => {
        // Guardar todos los campos (incluso vacíos para mantener consistencia)
        configsToSave[`hospital.${key}`] = value;
      });
      
      if (Object.keys(configsToSave).length === 0) {
        toast.error('No hay datos para guardar. Completa al menos un campo del formulario.');
        setIsLoading(false);
        return;
      }

      console.log('Datos a guardar:', configsToSave);
      console.log('Entidad seleccionada:', selectedEntityId);
      console.log('hospitalDataRef.current:', hospitalDataRef.current);

      const response = await fetch('/api/configuracion/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          configs: configsToSave,
          category: activeTab,
          entityId: selectedEntityId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Configuración guardada exitosamente para la institución seleccionada`);
        setHasChanges(false);
        // Recargar datos después de guardar
        if (selectedEntityId && activeTab === 'hospital') {
          loadHospitalData();
        }
      } else {
        throw new Error(result.error || 'Error al guardar');
      }
    } catch (error: any) {
      console.error('Error guardando configuración:', error);
      toast.error('Error al guardar la configuración: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('¿Estás seguro de restablecer los valores por defecto? Esta acción no se puede deshacer.')) {
      // TODO: Implementar reset
      toast.info('Valores restablecidos por defecto');
      setHasChanges(false);
    }
  };

  const handleExport = () => {
    // TODO: Implementar exportación
    toast.success('Configuración exportada');
  };

  const handleImport = () => {
    // TODO: Implementar importación
    toast.success('Configuración importada');
  };

  const actions = (
    <>
      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="h-4 w-4 mr-2" />
        Exportar
      </Button>
      <Button variant="outline" size="sm" onClick={handleImport}>
        <Upload className="h-4 w-4 mr-2" />
        Importar
      </Button>
      <Button variant="outline" size="sm" onClick={handleReset}>
        <RotateCcw className="h-4 w-4 mr-2" />
        Restablecer
      </Button>
      <Button onClick={handleSave} disabled={!hasChanges || isLoading}>
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
    </>
    );

  return (
    <ModulePageLayout
      title="Configuración General"
      description="Administra la configuración global del sistema"
      actions={actions}
      maxWidth="7xl"
    >

      {/* Tabs */}
      <Card>
            <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-10 mb-6">
              <TabsTrigger value="institutions">Instituciones</TabsTrigger>
              <TabsTrigger value="hospital">Hospital</TabsTrigger>
              <TabsTrigger value="security">Seguridad</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="integrations">Integraciones</TabsTrigger>
              <TabsTrigger value="clinical">Historia Clínica</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
              <TabsTrigger value="backup">Backup</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="advanced">Avanzado</TabsTrigger>
            </TabsList>

            <TabsContent value="institutions" className="space-y-4">
              <InstitutionsTab onChange={() => setHasChanges(true)} />
            </TabsContent>

            <TabsContent value="hospital" className="space-y-4">
              <div className="mb-4">
                <EntitySelector
                  selectedEntityId={selectedEntityId}
                  onEntitySelect={(entityId) => {
                    setSelectedEntityId(entityId);
                    setHasChanges(false);
                    if (entityId) {
                      loadHospitalData();
                    }
                  }}
                  placeholder="Selecciona una institución para configurar..."
                />
              </div>
              {selectedEntityId ? (
                <HospitalTab 
                  onChange={() => setHasChanges(true)} 
                  onDataChange={handleHospitalDataChange}
                  initialData={hospitalData}
                  entityId={selectedEntityId}
                />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <p>Selecciona una institución para comenzar a configurar sus datos.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="mb-4">
                <EntitySelector
                  selectedEntityId={selectedEntityId}
                  onEntitySelect={(entityId) => {
                    setSelectedEntityId(entityId);
                    setHasChanges(false);
                  }}
                  placeholder="Selecciona una institución para configurar..."
                />
              </div>
              {selectedEntityId ? (
                <SecurityTab onChange={() => setHasChanges(true)} entityId={selectedEntityId} />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <p>Selecciona una institución para comenzar a configurar sus datos.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="roles" className="space-y-4">
              <div className="mb-4">
                <EntitySelector
                  selectedEntityId={selectedEntityId}
                  onEntitySelect={(entityId) => {
                    setSelectedEntityId(entityId);
                    setHasChanges(false);
                  }}
                  placeholder="Selecciona una institución para configurar..."
                />
              </div>
              {selectedEntityId ? (
                <RolesTab onChange={() => setHasChanges(true)} entityId={selectedEntityId} />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <p>Selecciona una institución para comenzar a configurar sus datos.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="integrations" className="space-y-4">
              <div className="mb-4">
                <EntitySelector
                  selectedEntityId={selectedEntityId}
                  onEntitySelect={(entityId) => {
                    setSelectedEntityId(entityId);
                    setHasChanges(false);
                  }}
                  placeholder="Selecciona una institución para configurar..."
                />
              </div>
              {selectedEntityId ? (
                <IntegrationsTab onChange={() => setHasChanges(true)} entityId={selectedEntityId} />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <p>Selecciona una institución para comenzar a configurar sus datos.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="clinical" className="space-y-4">
              <div className="mb-4">
                <EntitySelector
                  selectedEntityId={selectedEntityId}
                  onEntitySelect={(entityId) => {
                    setSelectedEntityId(entityId);
                    setHasChanges(false);
                  }}
                  placeholder="Selecciona una institución para configurar..."
                />
              </div>
              {selectedEntityId ? (
                <ClinicalRecordsTab onChange={() => setHasChanges(true)} entityId={selectedEntityId} />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <p>Selecciona una institución para comenzar a configurar sus datos.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <div className="mb-4">
                <EntitySelector
                  selectedEntityId={selectedEntityId}
                  onEntitySelect={(entityId) => {
                    setSelectedEntityId(entityId);
                    setHasChanges(false);
                  }}
                  placeholder="Selecciona una institución para configurar..."
                />
              </div>
              {selectedEntityId ? (
                <NotificationsTab onChange={() => setHasChanges(true)} entityId={selectedEntityId} />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <p>Selecciona una institución para comenzar a configurar sus datos.</p>
                  </CardContent>
                </Card>
              )}
              </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <div className="mb-4">
                <EntitySelector
                  selectedEntityId={selectedEntityId}
                  onEntitySelect={(entityId) => {
                    setSelectedEntityId(entityId);
                    setHasChanges(false);
                  }}
                  placeholder="Selecciona una institución para configurar..."
                />
              </div>
              {selectedEntityId ? (
                <BackupTab onChange={() => setHasChanges(true)} entityId={selectedEntityId} />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <p>Selecciona una institución para comenzar a configurar sus datos.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="branding" className="space-y-4">
              <div className="mb-4">
                <EntitySelector
                  selectedEntityId={selectedEntityId}
                  onEntitySelect={(entityId) => {
                    setSelectedEntityId(entityId);
                    setHasChanges(false);
                  }}
                  placeholder="Selecciona una institución para configurar..."
                />
              </div>
              {selectedEntityId ? (
                <BrandingTab onChange={() => setHasChanges(true)} entityId={selectedEntityId} />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <p>Selecciona una institución para comenzar a configurar sus datos.</p>
                  </CardContent>
                </Card>
              )}
              </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="mb-4">
                <EntitySelector
                  selectedEntityId={selectedEntityId}
                  onEntitySelect={(entityId) => {
                    setSelectedEntityId(entityId);
                    setHasChanges(false);
                  }}
                  placeholder="Selecciona una institución para configurar..."
                />
              </div>
              {selectedEntityId ? (
                <AdvancedTab onChange={() => setHasChanges(true)} entityId={selectedEntityId} />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <p>Selecciona una institución para comenzar a configurar sus datos.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
                  </CardContent>
                </Card>

      {/* Footer con indicador de cambios */}
      {hasChanges && (
        <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ Tienes cambios sin guardar
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setHasChanges(false)}>
                  Descartar
                            </Button>
                <Button size="sm" onClick={handleSave}>
                  Guardar Ahora
                            </Button>
                          </div>
                        </div>
          </CardContent>
        </Card>
      )}
    </ModulePageLayout>
  );
}
