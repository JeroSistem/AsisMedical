import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { connectionString } = body;
    
    // Usar DATABASE_URL del servidor (siempre desde variables de entorno del servidor)
    const dbUrl = connectionString && connectionString !== 'usando DATABASE_URL del servidor' 
      ? connectionString 
      : process.env.DATABASE_URL;
    
    if (!dbUrl) {
      return NextResponse.json(
        { success: false, error: 'DATABASE_URL no está definida en las variables de entorno del servidor' },
        { status: 400 }
      );
    }

    // Validar que la URL tenga el formato correcto
    if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
      return NextResponse.json(
        { success: false, error: 'Formato de DATABASE_URL inválido. Debe empezar con postgresql:// o postgres://' },
        { status: 400 }
      );
    }

    // Parsear la URL para usar configuración individual
    let poolConfig: any;
    try {
      const url = new URL(dbUrl);
      
      // Validar que tenga los componentes necesarios
      if (!url.hostname || !url.username || !url.pathname) {
        throw new Error('URL de conexión incompleta');
      }
      
      const password = decodeURIComponent(url.password || '');
      const database = url.pathname.slice(1); // Remover el '/' inicial
      
      if (!database) {
        throw new Error('Nombre de base de datos no especificado en la URL');
      }
      
      poolConfig = {
        host: url.hostname,
        port: parseInt(url.port) || 5433, // Usar 5433 por defecto (según pgAdmin)
        database: database,
        user: url.username,
        password: password,
        connectionTimeoutMillis: 10000,
      };
    } catch (parseError: any) {
      console.error('Error parseando DATABASE_URL:', parseError);
      // Si falla el parseo, usar connectionString directamente
      poolConfig = {
        connectionString: dbUrl,
        connectionTimeoutMillis: 10000,
      };
    }

    const pool = new Pool(poolConfig);

    try {
      const result = await pool.query('SELECT version()');
      const version = result.rows[0]?.version || 'Connected';
      
      await pool.end();
      
      return NextResponse.json({
        success: true,
        version,
      });
    } catch (err: any) {
      await pool.end();
      
      // Mensaje más descriptivo para errores comunes
      let errorMessage = err.message;
      let hint = undefined;
      
      if (err.code === '28P01') {
        errorMessage = 'Error de autenticación: La contraseña o el usuario son incorrectos. Verifica las credenciales en .env.local';
        hint = 'Verifica que la contraseña en .env.local sea correcta. La contraseña debe estar codificada (ej: JR2026@@ → JR2026%40%40)';
      } else if (err.code === '3D000') {
        errorMessage = 'La base de datos "asis_medical" no existe. Debes crearla primero.';
        hint = 'Conéctate a PostgreSQL y ejecuta: CREATE DATABASE asis_medical;';
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = 'No se puede conectar al servidor PostgreSQL. Verifica que PostgreSQL esté corriendo en el puerto correcto';
        hint = 'Verifica que PostgreSQL esté corriendo y que el puerto en .env.local sea correcto (5433 según pgAdmin)';
      } else if (err.message.includes('ECONNRESET') || err.message.includes('connection')) {
        errorMessage = 'La conexión se cerró inesperadamente. Esto puede indicar que la base de datos no existe o hay un problema de permisos.';
        hint = 'Verifica que la base de datos "asis_medical" exista. Si no existe, créala desde pgAdmin o ejecuta: CREATE DATABASE asis_medical;';
      }
      
      return NextResponse.json({
        success: false,
        error: errorMessage,
        code: err.code,
        detail: err.detail,
        hint: hint,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
