'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Página de prueba para verificar el mapeo de módulos
 */
export default function TestModuleMappingPage() {
  const { data: session } = useSession();
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/navigation/filtered');
      const result = await response.json();
      
      setTestResults({
        success: result.success,
        navigationCount: result.data?.length || 0,
        navigationModules: result.data?.map((m: any) => ({ id: m.id, title: m.title })) || [],
        debug: result.debug,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      setTestResults({
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  const userRole = (session?.user as any)?.role || 'N/A';
  const userEntityId = (session?.user as any)?.entityId || 'N/A';

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prueba de Mapeo de Módulos</h1>
        <Button onClick={runTest} disabled={loading}>
          {loading ? 'Probando...' : 'Ejecutar Prueba'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Rol:</strong> {userRole}</p>
          <p><strong>Entity ID:</strong> {userEntityId}</p>
          <p><strong>Email:</strong> {(session?.user as any)?.email || 'N/A'}</p>
        </CardContent>
      </Card>

      {testResults && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Resultados de la Prueba</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p><strong>Estado:</strong> {testResults.success ? '✅ Éxito' : '❌ Error'}</p>
                {testResults.error && (
                  <p className="text-red-600"><strong>Error:</strong> {testResults.error}</p>
                )}
                <p><strong>Timestamp:</strong> {testResults.timestamp}</p>
              </div>

              {testResults.success && (
                <>
                  <div>
                    <p><strong>Módulos en Navegación:</strong> {testResults.navigationCount}</p>
                    {testResults.navigationModules.length > 0 ? (
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {testResults.navigationModules.map((m: any) => (
                          <li key={m.id} className="text-sm">
                            <strong>{m.title}</strong> (ID: {m.id})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-red-600 mt-2">⚠️ No se encontraron módulos en la navegación</p>
                    )}
                  </div>

                  {testResults.debug && (
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                      <p><strong>Información de Depuración:</strong></p>
                      <div className="mt-2 space-y-2 text-sm">
                        <p><strong>Rol del Usuario:</strong> {testResults.debug.userRole}</p>
                        <p><strong>Entity ID:</strong> {testResults.debug.userEntityId}</p>
                        <p><strong>Conteo de Navegación:</strong> {testResults.debug.navigationCount}</p>
                        
                        {testResults.debug.enabledModules && (
                          <div className="mt-2">
                            <p><strong>Módulos Habilitados en BD:</strong> {testResults.debug.enabledModules.count}</p>
                            {testResults.debug.enabledModules.modules && testResults.debug.enabledModules.modules.length > 0 ? (
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                {testResults.debug.enabledModules.modules.map((m: any, idx: number) => (
                                  <li key={idx} className="text-xs">
                                    {m.moduleName} (ID: {m.moduleId})
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-red-600 text-xs mt-1">⚠️ No hay módulos habilitados en la BD</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Respuesta Completa (JSON)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
