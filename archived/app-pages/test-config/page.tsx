'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function TestConfigPage() {
  const [testKey, setTestKey] = useState('test.configuracion');
  const [testValue, setTestValue] = useState('valor de prueba');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedConfig, setSavedConfig] = useState<any>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/configuracion/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          configs: {
            [testKey]: testValue,
          },
          category: 'test',
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('✅ Configuración guardada correctamente');
        setSavedConfig(result.data);
      } else {
        throw new Error(result.error || 'Error al guardar');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('❌ Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLoad = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/configuracion/general?category=test`);
      const result = await response.json();

      if (result.success) {
        if (Array.isArray(result.data) && result.data.length > 0) {
          const config = result.data.find((c: any) => c.key === `general.${testKey}` || c.key === testKey);
          if (config) {
            setTestValue(String(config.value));
            toast.success('✅ Configuración cargada correctamente');
          } else {
            toast.info('No se encontró la configuración con esa clave');
          }
        } else if (result.data && typeof result.data === 'object') {
          const value = result.data[testKey] || result.data[`general.${testKey}`];
          if (value !== undefined) {
            setTestValue(String(value));
            toast.success('✅ Configuración cargada correctamente');
          } else {
            toast.info('No se encontró la configuración con esa clave');
          }
        } else {
          toast.info('No hay configuraciones guardadas');
        }
      } else {
        throw new Error(result.error || 'Error al cargar');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      // No enviar connectionString desde el cliente, dejar que el servidor use DATABASE_URL
      const response = await fetch('/api/test-db-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Enviar objeto vacío para que use DATABASE_URL del servidor
      });

      const result = await response.json();

      if (result.success) {
        toast.success('✅ Conexión a la base de datos exitosa');
        if (result.version) {
          toast.info('Versión: ' + result.version.substring(0, 50) + '...');
        }
      } else {
        let errorMsg = '❌ Error de conexión: ' + result.error;
        if (result.hint) {
          errorMsg += '\n💡 ' + result.hint;
        }
        toast.error(errorMsg, {
          duration: 8000, // Mostrar por más tiempo
        });
        if (result.code) {
          console.error('Código de error PostgreSQL:', result.code);
          console.error('Detalle:', result.detail);
        }
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      toast.error('❌ Error: ' + error.message);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Prueba de Configuración</h1>

      <div className="space-y-6">
        {/* Prueba de Conexión */}
        <Card>
          <CardHeader>
            <CardTitle>1. Prueba de Conexión a Base de Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleTestConnection}>
              Probar Conexión
            </Button>
          </CardContent>
        </Card>

        {/* Guardar Configuración */}
        <Card>
          <CardHeader>
            <CardTitle>2. Guardar Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="testKey">Clave de Configuración</Label>
              <Input
                id="testKey"
                value={testKey}
                onChange={(e) => setTestKey(e.target.value)}
                placeholder="test.configuracion"
              />
            </div>
            <div>
              <Label htmlFor="testValue">Valor</Label>
              <Input
                id="testValue"
                value={testValue}
                onChange={(e) => setTestValue(e.target.value)}
                placeholder="valor de prueba"
              />
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar en Base de Datos'}
            </Button>
            {savedConfig && (
              <div className="mt-4 p-3 bg-green-50 rounded">
                <p className="text-sm font-semibold text-green-700">Configuración guardada:</p>
                <pre className="text-xs mt-2 overflow-auto">
                  {JSON.stringify(savedConfig, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cargar Configuración */}
        <Card>
          <CardHeader>
            <CardTitle>3. Cargar Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="loadKey">Clave a Cargar</Label>
              <Input
                id="loadKey"
                value={testKey}
                onChange={(e) => setTestKey(e.target.value)}
                placeholder="test.configuracion"
              />
            </div>
            <Button onClick={handleLoad} disabled={loading}>
              {loading ? 'Cargando...' : 'Cargar desde Base de Datos'}
            </Button>
            <div className="mt-4">
              <Label>Valor Cargado:</Label>
              <div className="p-3 bg-gray-50 rounded mt-2">
                <p className="font-mono">{testValue || '(vacío)'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información */}
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle>Información</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-2">
              Esta página te permite probar el sistema de configuración:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Verifica la conexión a PostgreSQL</li>
              <li>Guarda una configuración en la base de datos</li>
              <li>Carga la configuración guardada</li>
            </ul>
            <p className="text-sm text-gray-700 mt-4">
              Una vez que esto funcione, puedes usar los formularios de configuración en:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mt-2">
              <li><code>/admin/configuracion</code> - Configuración General</li>
              <li><code>/configuracion/sistema</code> - Configuración del Sistema</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
