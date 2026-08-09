'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FixDatabasePage() {
  const [username, setUsername] = useState('postgres');
  const [password, setPassword] = useState('JR2026@@');
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('5432');
  const [database, setDatabase] = useState('asis_medical');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const encodePassword = (pwd: string) => {
    return encodeURIComponent(pwd);
  };

  const testConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      const encodedPassword = encodePassword(password);
      const connectionString = `postgresql://${username}:${encodedPassword}@${host}:${port}/${database}`;
      
      const response = await fetch('/api/test-db-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connectionString }),
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

  const updateEnvFile = async () => {
    if (!result?.success) {
      alert('Primero debes probar la conexión exitosamente');
      return;
    }

    const encodedPassword = encodePassword(password);
    const connectionString = `postgresql://${username}:${encodedPassword}@${host}:${port}/${database}`;
    
    const response = await fetch('/api/update-database-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ connectionString }),
    });

    const data = await response.json();
    if (data.success) {
      alert('✅ DATABASE_URL actualizada correctamente. Reinicia el servidor de desarrollo.');
    } else {
      alert('❌ Error al actualizar: ' + data.error);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configurar Conexión a PostgreSQL</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Credenciales de PostgreSQL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="postgres"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
            />
            <p className="text-xs text-gray-500 mt-1">
              Los caracteres especiales se codificarán automáticamente
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="localhost"
              />
            </div>
            
            <div>
              <Label htmlFor="port">Puerto</Label>
              <Input
                id="port"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="5432"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="database">Base de Datos</Label>
            <Input
              id="database"
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
              placeholder="asis_medical"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={testConnection} disabled={testing}>
              {testing ? 'Probando...' : 'Probar Conexión'}
            </Button>
            
            {result?.success && (
              <Button onClick={updateEnvFile} variant="default">
                Actualizar .env.local
              </Button>
            )}
          </div>
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
                <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                  <p className="font-semibold mb-1">URL de conexión generada:</p>
                  <code className="break-all">
                    {`postgresql://${username}:${encodePassword(password).replace(/./g, '*')}@${host}:${port}/${database}`}
                  </code>
                </div>
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
                  <p className="font-semibold mb-2">Sugerencias:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Verifica que PostgreSQL esté ejecutándose</li>
                    <li>Verifica que el usuario y contraseña sean correctos</li>
                    <li>Verifica que la base de datos exista</li>
                    <li>Verifica que el puerto sea correcto (por defecto 5432)</li>
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
