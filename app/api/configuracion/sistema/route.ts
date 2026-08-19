import { NextResponse } from 'next/server';
import { saveSystemConfig, getSystemConfigsByCategory, getAllSystemConfigs } from '@/lib/actions/config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'sistema';
    const entityId = searchParams.get('entityId') || undefined;

    if (category) {
      // Obtener configuraciones por categoría
      const result = await getSystemConfigsByCategory(category, entityId);
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error || 'Error obteniendo configuraciones' },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, data: result.data });
    }

    // Si no hay categoría, obtener todas
    const result = await getAllSystemConfigs(entityId);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Error obteniendo configuraciones' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    console.error('Error en GET /api/configuracion/sistema:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { configs, entityId } = body;

    if (!configs || typeof configs !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Formato de configuración inválido' },
        { status: 400 }
      );
    }

    // Convertir el objeto de configuraciones a array con prefijo
    const configArray = Object.entries(configs).map(([key, value]) => ({
      key: `sistema.${key}`, // Prefijo para organización
      value: value as any,
      category: 'sistema',
      description: `Configuración del sistema: ${key}`,
      entityId,
    }));

    const result = await saveSystemConfigs(configArray);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Error guardando configuración' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Configuración del sistema guardada correctamente',
      data: result.data,
    });
  } catch (error: any) {
    console.error('Error en POST /api/configuracion/sistema:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
