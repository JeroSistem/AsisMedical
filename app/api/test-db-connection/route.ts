import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { connectionString } = body;

    const dbUrl =
      connectionString && connectionString !== 'usando DATABASE_URL del servidor'
        ? connectionString
        : process.env.DATABASE_URL;

    if (!dbUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'DATABASE_URL no está definida en las variables de entorno del servidor',
        },
        { status: 400 }
      );
    }

    if (!dbUrl.startsWith('mysql://') && !dbUrl.startsWith('mariadb://')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Formato de DATABASE_URL inválido. Debe empezar con mysql:// o mariadb://',
        },
        { status: 400 }
      );
    }

    const url = new URL(dbUrl);
    const conn = await mysql.createConnection({
      host: url.hostname,
      port: parseInt(url.port || '3306', 10),
      user: url.username,
      password: decodeURIComponent(url.password || ''),
      database: url.pathname.replace(/^\//, ''),
      connectTimeout: 10000,
    });

    try {
      const [rows] = await conn.query<any[]>('SELECT VERSION() AS version');
      const version = rows[0]?.version || 'Connected';
      await conn.end();
      return NextResponse.json({ success: true, version });
    } catch (err: any) {
      await conn.end().catch(() => {});
      return NextResponse.json(
        { success: false, error: err.message || 'Error de conexión' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}
