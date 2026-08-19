import { NextResponse } from 'next/server';
import { listPlatformModules } from '@/lib/actions/entity-principal-users';
import { PLATFORM_MODULES_CATALOG } from '@/lib/platform-modules';

export async function GET() {
  try {
    const result = await listPlatformModules();
    if (result.success && result.data?.length) {
      return NextResponse.json(result);
    }

    // Fallback si la BD aún no tiene módulos
    return NextResponse.json({
      success: true,
      data: PLATFORM_MODULES_CATALOG.map((m) => ({
        id: m.name,
        name: m.name,
        description: m.description,
        status: 'ENABLED',
      })),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      data: PLATFORM_MODULES_CATALOG.map((m) => ({
        id: m.name,
        name: m.name,
        description: m.description,
        status: 'ENABLED',
      })),
      warning: error?.message,
    });
  }
}
