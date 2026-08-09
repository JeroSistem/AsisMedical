import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const { connectionString } = await request.json();

    if (!connectionString) {
      return NextResponse.json(
        { success: false, error: 'Connection string is required' },
        { status: 400 }
      );
    }

    // Leer el archivo .env.local
    const envPath = join(process.cwd(), '.env.local');
    let envContent = '';
    
    try {
      envContent = await readFile(envPath, 'utf-8');
    } catch (error) {
      // Si el archivo no existe, crear uno nuevo
      envContent = '';
    }

    // Actualizar o agregar DATABASE_URL
    const lines = envContent.split('\n');
    let found = false;
    const updatedLines = lines.map(line => {
      if (line.startsWith('DATABASE_URL=')) {
        found = true;
        return `DATABASE_URL=${connectionString}`;
      }
      return line;
    });

    if (!found) {
      updatedLines.push(`DATABASE_URL=${connectionString}`);
    }

    // Escribir el archivo actualizado
    await writeFile(envPath, updatedLines.join('\n'), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'DATABASE_URL updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
