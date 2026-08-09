import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { associateModulesToEntity } from '@/lib/actions/entities';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Solo el SUPER_ADMIN puede asociar módulos' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { entityId, moduleNames } = body;

    if (!entityId) {
      return NextResponse.json(
        { success: false, error: 'entityId es requerido' },
        { status: 400 }
      );
    }

    if (!moduleNames || !Array.isArray(moduleNames) || moduleNames.length === 0) {
      return NextResponse.json(
        { success: false, error: 'moduleNames debe ser un array no vacío' },
        { status: 400 }
      );
    }

    // Verificar que la entidad existe
    const entity = await prisma.entity.findUnique({
      where: { id: entityId },
    });

    if (!entity) {
      return NextResponse.json(
        { success: false, error: 'Entidad no encontrada' },
        { status: 404 }
      );
    }

    // Asociar los módulos
    const result = await associateModulesToEntity(entityId, moduleNames);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Se asociaron ${result.associatedCount} módulos a la entidad`,
        data: { associatedCount: result.associatedCount },
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Error al asociar módulos' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[API] Error asociando módulos:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
