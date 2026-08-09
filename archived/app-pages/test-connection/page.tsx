export default async function TestConnectionPage() {
  let testResults: any = {
    envCheck: false,
    connectionTest: null,
    error: null,
  };

  try {
    // Verificar variable de entorno
    testResults.envCheck = !!process.env.DATABASE_URL;
    
    if (testResults.envCheck) {
      // Intentar conexión directa con pg
      const { Pool } = await import('pg');
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 5000,
      });

      try {
        const result = await pool.query('SELECT version()');
        testResults.connectionTest = {
          success: true,
          version: result.rows[0]?.version || 'Conectado',
        };
        await pool.end();
      } catch (err: any) {
        testResults.connectionTest = {
          success: false,
          error: err.message,
          code: err.code,
        };
        await pool.end();
      }
    }
  } catch (error: any) {
    testResults.error = {
      message: error.message,
      stack: error.stack,
    };
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Prueba de Conexión a PostgreSQL</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Variable de Entorno</h2>
          <p>DATABASE_URL definida: {testResults.envCheck ? '✅ Sí' : '❌ No'}</p>
          {testResults.envCheck && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">URL (oculta):</p>
              <code className="text-xs bg-gray-100 p-2 rounded block">
                {process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@')}
              </code>
            </div>
          )}
        </div>

        {testResults.connectionTest && (
          <div className={`p-4 border rounded ${testResults.connectionTest.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <h2 className="font-semibold mb-2">
              Prueba de Conexión Directa
            </h2>
            {testResults.connectionTest.success ? (
              <div>
                <p className="text-green-700 font-semibold">✅ Conexión exitosa</p>
                <p className="text-sm mt-2">Versión: {testResults.connectionTest.version}</p>
              </div>
            ) : (
              <div>
                <p className="text-red-700 font-semibold">❌ Error de conexión</p>
                <p className="text-sm mt-2">Código: {testResults.connectionTest.code}</p>
                <p className="text-sm">Mensaje: {testResults.connectionTest.error}</p>
              </div>
            )}
          </div>
        )}

        {testResults.error && (
          <div className="p-4 border border-red-500 rounded bg-red-50">
            <h2 className="font-semibold mb-2 text-red-700">Error</h2>
            <pre className="text-sm overflow-auto">
              {testResults.error.message}
            </pre>
          </div>
        )}

        <div className="p-4 border rounded bg-yellow-50">
          <h2 className="font-semibold mb-2">Solución de Problemas</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Verifica que PostgreSQL esté ejecutándose</li>
            <li>Verifica que la contraseña en DATABASE_URL sea correcta</li>
            <li>Si la contraseña tiene caracteres especiales (@, #, etc.), deben estar codificados:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>@ se codifica como %40</li>
                <li># se codifica como %23</li>
                <li>Espacio se codifica como %20</li>
              </ul>
            </li>
            <li>Ejemplo: Si tu contraseña es "pass@123", la URL sería: postgresql://user:pass%40123@localhost:5432/db</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
