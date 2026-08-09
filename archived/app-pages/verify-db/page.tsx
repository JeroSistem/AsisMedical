'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyDbPage() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-db-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          connectionString: process.env.NEXT_PUBLIC_DATABASE_URL || 'usando DATABASE_URL del servidor'
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Verificar Conexión a Base de Datos</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Prueba de Conexión</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testConnection} disabled={testing}>
            {testing ? 'Probando...' : 'Probar Conexión'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className={result.success ? 'border-green-500' : 'border-red-500'}>
          <CardHeader>
            <CardTitle className={result.success ? 'text-green-700' : 'text-red-700'}>
              {result.success ? '✅ Conexión Exitosa' : '❌ Error de Conexión'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <div>
                <p className="text-green-700 font-semibold mb-2">
                  La conexión fue exitosa
                </p>
                {result.version && (
                  <p className="text-sm text-gray-600">
                    Versión de PostgreSQL: {result.version}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-red-700 font-semibold mb-2">
                  Error: {result.error || 'Error desconocido'}
                </p>
                {result.code && (
                  <p className="text-sm text-gray-600">
                    Código: {result.code}
                  </p>
                )}
                <div className="mt-4 p-3 bg-yellow-50 rounded text-sm">
                  <p className="font-semibold mb-2">Posibles soluciones:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Verifica que PostgreSQL esté ejecutándose</li>
                    <li>Verifica que la contraseña en .env.local sea correcta</li>
                    <li>Visita <code className="bg-gray-100 px-1 rounded">/fix-database</code> para probar diferentes credenciales</li>
                    <li>Verifica que la base de datos <code className="bg-gray-100 px-1 rounded">asis_medical</code> exista</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
