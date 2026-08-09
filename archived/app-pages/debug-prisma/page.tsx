export default async function DebugPrismaPage() {
  let errorDetails: any = null;
  let connectionStatus = 'unknown';
  let prismaStatus = 'unknown';

  try {
    // Verificar variables de entorno
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    
    // Intentar importar Prisma
    let prisma: any;
    try {
      const prismaModule = await import('@/lib/prisma');
      prisma = prismaModule.prisma;
      prismaStatus = 'loaded';
    } catch (err: any) {
      prismaStatus = `error: ${err.message}`;
      errorDetails = err;
    }

    // Intentar conectar
    if (prisma) {
      try {
        await prisma.$queryRaw`SELECT 1`;
        connectionStatus = 'connected';
      } catch (err: any) {
        connectionStatus = `error: ${err.message}`;
        errorDetails = err;
      }
    }

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Diagnóstico de Prisma</h1>
        
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h2 className="font-semibold mb-2">Variables de Entorno</h2>
            <p>DATABASE_URL definida: {hasDatabaseUrl ? '✅ Sí' : '❌ No'}</p>
            {hasDatabaseUrl && (
              <p className="text-sm text-gray-600 mt-2">
                URL: {process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')}
              </p>
            )}
          </div>

          <div className="p-4 border rounded">
            <h2 className="font-semibold mb-2">Estado de Prisma</h2>
            <p>Estado: {prismaStatus}</p>
          </div>

          <div className="p-4 border rounded">
            <h2 className="font-semibold mb-2">Conexión a Base de Datos</h2>
            <p>Estado: {connectionStatus}</p>
          </div>

          {errorDetails && (
            <div className="p-4 border border-red-500 rounded bg-red-50">
              <h2 className="font-semibold mb-2 text-red-700">Error Detallado</h2>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
              {errorDetails.stack && (
                <pre className="text-xs mt-2 overflow-auto">
                  {errorDetails.stack}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Error en Diagnóstico</h1>
        <div className="p-4 border border-red-500 rounded bg-red-50">
          <pre className="text-sm overflow-auto">
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </div>
      </div>
    );
  }
}
