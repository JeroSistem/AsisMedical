import { NextResponse } from 'next/server';
import { saveSystemConfig, saveSystemConfigs, getSystemConfigsByCategory, getAllSystemConfigs } from '@/lib/actions/config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const entityId = searchParams.get('entityId') || undefined;

    if (category) {
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
    console.error('Error en GET /api/configuracion/general:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { configs, category = 'general', entityId } = body;

    if (!configs || typeof configs !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Formato de configuración inválido' },
        { status: 400 }
      );
    }

    // Guardar cada campo individualmente
    // Si la clave ya tiene un prefijo (ej: hospital.nombre), mantenerlo
    // Si no tiene prefijo, agregar el prefijo de la categoría
    const configArray = Object.entries(configs).map(([key, value]) => {
      const finalKey = key.includes('.') ? key : `${category}.${key}`;
      return {
        key: finalKey,
        value: value as any,
        category,
        description: `Configuración ${category}: ${key.replace(/^[^.]+\./, '')}`,
        entityId,
      };
    });

    const result = await saveSystemConfigs(configArray);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Error guardando configuración' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Configuración guardada correctamente',
      data: result.data,
    });
  } catch (error: any) {
    console.error('Error en POST /api/configuracion/general:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
