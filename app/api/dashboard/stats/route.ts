import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPrismaClient } from '@/lib/database-manager';

/**
 * Obtiene estadísticas reales del sistema desde la base de datos
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;
    const userEntityId = (session.user as any)?.entityId;

    // Obtener estadísticas de la BD principal
    const [
      totalUsersMain,
      totalEntities,
      totalModules,
      totalPatientsMain,
      totalMedicalRecordsMain,
    ] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.entity.count().catch(() => 0),
      prisma.module.count().catch(() => 0),
      prisma.patient.count().catch(() => 0),
      prisma.medicalRecord.count().catch(() => 0),
    ]);

    // Si el usuario tiene una entidad, obtener estadísticas de esa entidad también
    let entityStats = null;
    if (userEntityId) {
      try {
        const entityPrisma = getPrismaClient(userEntityId);
        const [totalUsersEntity, totalPatientsEntity, totalMedicalRecordsEntity] = await Promise.all([
          entityPrisma.user.count().catch(() => 0),
          entityPrisma.patient.count().catch(() => 0),
          entityPrisma.medicalRecord.count().catch(() => 0),
        ]);

        entityStats = {
          totalUsers: totalUsersEntity,
          totalPatients: totalPatientsEntity,
          totalMedicalRecords: totalMedicalRecordsEntity,
        };
      } catch (error: any) {
        console.error('[API /dashboard/stats] Error obteniendo estadísticas de entidad:', error);
      }
    }

    // Calcular estadísticas consolidadas
    const stats = {
      usuarios: {
        total: entityStats ? entityStats.totalUsers : totalUsersMain,
        activos: entityStats ? entityStats.totalUsers : totalUsersMain, // Por ahora igual al total
        nuevos: 0, // Se calcularía comparando con el mes anterior
        sesiones: 0, // Se obtendría de la tabla de sesiones
        crecimiento: 0,
      },
      rendimiento: {
        uptime: 0, // Se calcularía desde logs del sistema
        tiempoRespuesta: 0,
        solicitudes: 0,
        crecimiento: 0,
      },
      almacenamiento: {
        total: 0, // Se calcularía del tamaño de la BD
        usado: 0,
        porcentaje: 0,
        tendencia: 'stable' as const,
      },
      transacciones: {
        total: 0,
        exitosas: 0,
        fallidas: 0,
        tasa: 0,
      },
      entidades: {
        total: totalEntities,
      },
      modulos: {
        total: totalModules,
      },
      pacientes: {
        total: entityStats ? entityStats.totalPatients : totalPatientsMain,
      },
      historiasClinicas: {
        total: entityStats ? entityStats.totalMedicalRecords : totalMedicalRecordsMain,
      },
    };

    // Obtener tendencias (últimos 6 meses) - por ahora vacío
    const tendencias: any[] = [];

    // Obtener módulos más utilizados - por ahora vacío
    const topModulos: any[] = [];

    // Obtener alertas del sistema - por ahora vacío
    const alertas: any[] = [];

    return NextResponse.json({
      success: true,
      data: {
        stats,
        tendencias,
        topModulos,
        alertas,
      },
    });
  } catch (error: any) {
    console.error('[API /dashboard/stats] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
