'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DebugModulesPage() {
  const { data: session } = useSession();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [modulesInfo, setModulesInfo] = useState<any>(null);
  const [initializing, setInitializing] = useState(false);
  const [associating, setAssociating] = useState(false);

  const [diagnosisInfo, setDiagnosisInfo] = useState<any>(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [usersInfo, setUsersInfo] = useState<any>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [cleaningUsers, setCleaningUsers] = useState(false);

  const loadDebugInfo = async () => {
    try {
      const [navResponse, modulesResponse] = await Promise.all([
        fetch('/api/navigation/filtered'),
        fetch('/api/debug/check-modules'),
      ]);
      
      const navResult = await navResponse.json();
      const modulesResult = await modulesResponse.json();
      
      setDebugInfo(navResult);
      setModulesInfo(modulesResult);
    } catch (error) {
      console.error('Error cargando info de depuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const runDiagnosis = async () => {
    setDiagnosing(true);
    try {
      const response = await fetch('/api/debug/diagnose-modules');
      const result = await response.json();
      setDiagnosisInfo(result);
    } catch (error: any) {
      console.error('Error ejecutando diagnóstico:', error);
      setDiagnosisInfo({ success: false, error: error.message });
    } finally {
      setDiagnosing(false);
    }
  };

  useEffect(() => {
    loadDebugInfo();
  }, []);

  const handleInitializeModules = async () => {
    if (!confirm('¿Estás seguro de que deseas inicializar los módulos del sistema? Esto creará los módulos si no existen.')) {
      return;
    }

    setInitializing(true);
    try {
      const response = await fetch('/api/debug/init-modules', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        toast.success(result.message || 'Módulos inicializados correctamente');
        // Recargar la información
        await loadDebugInfo();
      } else {
        toast.error('Error: ' + (result.error || 'Error desconocido'));
      }
    } catch (error: any) {
      console.error('Error inicializando módulos:', error);
      toast.error('Error al inicializar módulos');
    } finally {
      setInitializing(false);
    }
  };

  const handleAssociateModules = async () => {
    const userEntityId = (session?.user as any)?.entityId;
    if (!userEntityId) {
      toast.error('No se puede asociar módulos: el usuario no tiene una entidad asignada');
      return;
    }

    if (!confirm('¿Estás seguro de que deseas asociar todos los módulos disponibles a esta entidad? Esto habilitará todos los módulos para la entidad actual.')) {
      return;
    }

    setAssociating(true);
    try {
      // Usar el endpoint que fuerza la asociación directamente en la BD de la entidad
      const response = await fetch('/api/debug/force-associate-modules', {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(result.message || `Se asociaron ${result.data?.associatedCount || 0} módulos correctamente`);
        // Recargar la información y forzar recarga de navegación
        await loadDebugInfo();
        // Disparar evento para recargar navegación
        window.dispatchEvent(new Event('permissions-updated'));
        // Recargar la página después de un breve delay para asegurar que todo se actualice
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error('Error: ' + (result.error || 'Error desconocido'));
      }
    } catch (error: any) {
      console.error('Error asociando módulos:', error);
      toast.error('Error al asociar módulos');
    } finally {
      setAssociating(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('/api/debug/list-users');
      const result = await response.json();
      setUsersInfo(result);
    } catch (error: any) {
      console.error('Error cargando usuarios:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCleanAllData = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
      return;
    }

    setCleaning(true);
    try {
      const response = await fetch('/api/debug/clean-all-data', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        toast.success('Todos los datos han sido eliminados correctamente');
        // Redirigir al login después de un breve delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        toast.error('Error: ' + (result.error || 'Error desconocido'));
      }
    } catch (error: any) {
      console.error('Error limpiando datos:', error);
      toast.error('Error al limpiar datos');
    } finally {
      setCleaning(false);
    }
  };

  if (loading) {
    return <div className="p-8">Cargando información de depuración...</div>;
  }

  const userRole = (session?.user as any)?.role || 'N/A';
  const userEntityId = (session?.user as any)?.entityId || 'N/A';

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Depuración de Módulos</h1>
        <div className="flex gap-2">
          <Button 
            onClick={runDiagnosis} 
            disabled={diagnosing}
            variant="secondary"
          >
            {diagnosing ? 'Diagnosticando...' : '🔍 Ejecutar Diagnóstico Completo'}
          </Button>
          <Button 
            onClick={handleInitializeModules} 
            disabled={initializing}
            variant="outline"
          >
            {initializing ? 'Inicializando...' : 'Inicializar Módulos del Sistema'}
          </Button>
          {userEntityId && userEntityId !== 'N/A' && (
            <Button 
              onClick={handleAssociateModules} 
              disabled={associating}
              variant="default"
            >
              {associating ? 'Asociando...' : 'Asociar Todos los Módulos a esta Entidad'}
            </Button>
          )}
          <Button 
            onClick={loadUsers} 
            disabled={loadingUsers}
            variant="outline"
          >
            {loadingUsers ? 'Cargando...' : '👥 Ver Usuarios'}
          </Button>
          {userRole === 'SUPER_ADMIN' && (
            <>
              <Button 
                onClick={handleCleanUsers} 
                disabled={cleaningUsers}
                variant="destructive"
              >
                {cleaningUsers ? 'Eliminando...' : '🗑️ Eliminar Usuarios (Mantener SUPER_ADMIN)'}
              </Button>
              <Button 
                onClick={handleCleanAllData} 
                disabled={cleaning}
                variant="destructive"
              >
                {cleaning ? 'Limpiando...' : '🗑️ Limpiar TODOS los Datos'}
              </Button>
            </>
          )}
        </div>
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

      {debugInfo?.debug && (
        <Card>
          <CardHeader>
            <CardTitle>Información de Depuración del Servidor</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(debugInfo.debug, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Módulos Recibidos ({debugInfo?.data?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {debugInfo?.data && debugInfo.data.length > 0 ? (
            <ul className="space-y-2">
              {debugInfo.data.map((module: any) => (
                <li key={module.id} className="p-2 bg-gray-50 rounded">
                  <strong>{module.title}</strong> (ID: {module.id})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-600">No se recibieron módulos</p>
          )}
        </CardContent>
      </Card>

      {modulesInfo?.success && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Usuario Actual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Rol:</strong> {modulesInfo.data.currentUser?.role || 'N/A'}</p>
              <p><strong>Entity ID:</strong> {modulesInfo.data.currentUser?.entityId || 'N/A'}</p>
              <p><strong>Email:</strong> {modulesInfo.data.currentUser?.email || 'N/A'}</p>
              {modulesInfo.data.enabledModulesForCurrentUser && (
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p><strong>Módulos Habilitados para este Usuario:</strong></p>
                  <p className="text-sm text-gray-600">
                    Total: {modulesInfo.data.enabledModulesForCurrentUser.count}
                  </p>
                  {modulesInfo.data.enabledModulesForCurrentUser.modules.length > 0 ? (
                    <ul className="list-disc list-inside mt-2">
                      {modulesInfo.data.enabledModulesForCurrentUser.modules.map((m: string, idx: number) => (
                        <li key={idx} className="text-sm">{m}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-red-600 text-sm mt-2">⚠️ No hay módulos habilitados para esta entidad</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Módulos en la Base de Datos ({modulesInfo.data.modulesInDB.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {modulesInfo.data.modulesInDB.length > 0 ? (
                <ul className="space-y-2">
                  {modulesInfo.data.modulesInDB.map((module: any) => (
                    <li key={module.id} className="p-2 bg-gray-50 rounded">
                      <strong>{module.name}</strong> (ID: {module.id}, Estado: {module.status})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-600">⚠️ No hay módulos en la base de datos. Haz clic en "Inicializar Módulos del Sistema"</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Entidades y sus Módulos Habilitados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modulesInfo.data.entitiesWithModules.map((entity: any) => (
                  <div key={entity.id} className="p-3 border rounded">
                    <h3 className="font-semibold mb-2">{entity.name} (ID: {entity.id})</h3>
                    {entity.enabledModules.length > 0 ? (
                      <>
                        <p className="text-sm text-green-600 mb-2">✅ {entity.enabledModules.length} módulo(s) habilitado(s):</p>
                        <ul className="list-disc list-inside space-y-1">
                          {entity.enabledModules.map((em: any) => (
                            <li key={em.moduleId}>
                              {em.moduleName} (ID: {em.moduleId})
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p className="text-red-600">⚠️ No tiene módulos habilitados</p>
                    )}
                    {entity.allModules && entity.allModules.length > entity.enabledModules.length && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-gray-500">Todos los módulos asociados (incluyendo deshabilitados):</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          {entity.allModules.map((em: any) => (
                            <li key={em.moduleId} className={em.enabled ? 'text-green-600' : 'text-gray-400'}>
                              {em.moduleName} {em.enabled ? '✓' : '✗'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {modulesInfo.data.allEntityModules && modulesInfo.data.allEntityModules.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Registros EntityModule (Todos)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Entidad</th>
                        <th className="text-left p-2">Módulo</th>
                        <th className="text-left p-2">Habilitado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modulesInfo.data.allEntityModules.map((em: any, idx: number) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2">{em.entityName}</td>
                          <td className="p-2">{em.moduleName}</td>
                          <td className="p-2">
                            <span className={em.enabled ? 'text-green-600 font-bold' : 'text-red-600'}>
                              {em.enabled ? '✓ Sí' : '✗ No'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {diagnosisInfo && (
        <Card>
          <CardHeader>
            <CardTitle>🔍 Diagnóstico Completo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {diagnosisInfo.success ? (
              <>
                {diagnosisInfo.diagnosis?.steps?.map((step: any, idx: number) => (
                  <div key={idx} className={`p-3 rounded border ${step.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-bold ${step.success ? 'text-green-700' : 'text-red-700'}`}>
                        {step.success ? '✅' : '❌'}
                      </span>
                      <span className="font-semibold">Paso {step.step}: {step.name}</span>
                    </div>
                    {step.error && (
                      <p className="text-red-600 text-sm mt-1">{step.error}</p>
                    )}
                    {step.hint && (
                      <p className="text-yellow-600 text-sm mt-1">💡 {step.hint}</p>
                    )}
                    {step.data && (
                      <pre className="bg-white p-2 rounded text-xs mt-2 overflow-auto">
                        {JSON.stringify(step.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
                
                {diagnosisInfo.diagnosis?.enabledModulesSet && (
                  <div className="mt-4 p-4 bg-blue-50 rounded">
                    <p><strong>Módulos Habilitados (Set):</strong></p>
                    <p className="text-sm text-gray-600">Total: {diagnosisInfo.diagnosis.enabledModulesSet.length}</p>
                    {diagnosisInfo.diagnosis.enabledModulesSet.length > 0 ? (
                      <ul className="list-disc list-inside mt-2">
                        {diagnosisInfo.diagnosis.enabledModulesSet.map((m: string, idx: number) => (
                          <li key={idx} className="text-sm">{m}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-red-600 text-sm mt-2">⚠️ El Set está vacío - este es el problema principal</p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="text-red-600">Error: {diagnosisInfo.error}</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Respuesta Completa del API</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {usersInfo && usersInfo.success && (
        <Card>
          <CardHeader>
            <CardTitle>Usuarios en el Sistema (Total: {usersInfo.data.total})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Usuarios de la BD principal */}
            {usersInfo.data.mainDatabase.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Base de Datos Principal ({usersInfo.data.mainDatabase.length} usuario(s))</h3>
                <div className="space-y-2">
                  {usersInfo.data.mainDatabase.map((user: any) => (
                    <div key={user.id} className="p-3 bg-gray-50 rounded border">
                      <p><strong>Nombre:</strong> {user.name}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Rol:</strong> {user.role}</p>
                      <p><strong>Estado:</strong> {user.status}</p>
                      <p><strong>Entity ID:</strong> {user.entityId || 'N/A'}</p>
                      <p><strong>Creado:</strong> {new Date(user.createdAt).toLocaleString('es-ES')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Usuarios de las entidades */}
            {usersInfo.data.entityDatabases.map((entity: any) => (
              <div key={entity.entityId} className="border-t pt-4">
                <h3 className="font-semibold mb-2">
                  Entidad: {entity.entityName} ({entity.users?.length || 0} usuario(s))
                </h3>
                {entity.error ? (
                  <p className="text-red-600">Error: {entity.error}</p>
                ) : entity.users && entity.users.length > 0 ? (
                  <div className="space-y-2">
                    {entity.users.map((user: any) => (
                      <div key={user.id} className="p-3 bg-blue-50 rounded border">
                        <p><strong>Nombre:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Rol:</strong> {user.role}</p>
                        <p><strong>Estado:</strong> {user.status}</p>
                        <p><strong>Entity ID:</strong> {user.entityId || 'N/A'}</p>
                        <p><strong>Creado:</strong> {new Date(user.createdAt).toLocaleString('es-ES')}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No hay usuarios en esta entidad</p>
                )}
              </div>
            ))}

            {usersInfo.data.total === 0 && (
              <p className="text-center text-gray-500 py-4">No hay usuarios en el sistema</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
