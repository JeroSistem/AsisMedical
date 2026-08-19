import { NextRequest, NextResponse } from 'next/server';
import { findEntityByName, getEntityPermissions } from '@/lib/actions/config';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const entityName = searchParams.get('entityName');
    const entityId = searchParams.get('entityId');

    if (!entityName && !entityId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere entityName o entityId' },
        { status: 400 }
      );
    }

    let targetEntityId = entityId;

    // Si se proporciona el nombre, buscar la entidad
    if (entityName && !entityId) {
      const entityResult = await findEntityByName(entityName);
      if (!entityResult.success || !entityResult.data) {
        return NextResponse.json(
          { success: false, error: entityResult.error || 'Entidad no encontrada' },
          { status: 404 }
        );
      }
      targetEntityId = entityResult.data.id;
    }

    if (!targetEntityId) {
      return NextResponse.json(
        { success: false, error: 'No se pudo determinar el ID de la entidad' },
        { status: 400 }
      );
    }

    // Obtener los permisos de la entidad
    const permissionsResult = await getEntityPermissions(targetEntityId);

    if (!permissionsResult.success) {
      return NextResponse.json(
        { success: false, error: permissionsResult.error || 'Error obteniendo permisos' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        entityId: targetEntityId,
        entityName: entityName || 'N/A',
        ...permissionsResult.data,
      },
    });
  } catch (error: any) {
    console.error('Error en GET /api/configuracion/entity-permissions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
