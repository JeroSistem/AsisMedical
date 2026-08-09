import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const DB_DISABLED_MESSAGE =
  'La base de datos ha sido deshabilitada. Esta API devolverá permisos vacíos hasta que se reconfigure la persistencia.';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const moduleName = searchParams.get('module');
    const session = await getServerSession(authOptions);
    const userId = (session as any)?.user?.id;
    const userRole = (session as any)?.user?.role;

    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    if (!moduleName) return NextResponse.json({ success: false, error: 'module is required' }, { status: 400 });

    // SUPER_ADMIN: todos los permisos
    if (userRole === 'SUPER_ADMIN') {
      return NextResponse.json({ success: true, data: ['read', 'write', 'delete', 'export', 'admin'] });
    }

    console.warn('GET /api/navigation/permissions sin capa de base de datos', { userId, moduleName });
    return NextResponse.json({ success: true, data: [], warning: DB_DISABLED_MESSAGE });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Error' }, { status: 500 });
  }
}


