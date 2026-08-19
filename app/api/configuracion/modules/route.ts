import { NextResponse } from 'next/server';
import { getAllModules } from '@/lib/actions/entities';

export async function GET() {
  try {
    const result = await getAllModules();

    // Sin BD: 503 amigable (no 500) para no romper pantallas de configuración
    if (!result.success) {
      const offline =
        typeof result.error === 'string' &&
        (result.error.includes('no disponible') || result.error.includes('ECONNREFUSED'));
      return NextResponse.json(result, { status: offline ? 503 : 500 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.warn('[API] /api/configuracion/modules:', error?.message || error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: error?.message || 'Error al obtener los módulos',
      },
      { status: 503 }
    );
  }
}
