import { NextRequest, NextResponse } from 'next/server';
import {
  listPrincipalUsers,
  upsertPrincipalUser,
  deactivatePrincipalUser,
  listPlatformModules,
} from '@/lib/actions/entity-principal-users';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('modules') === '1') {
      const modules = await listPlatformModules();
      return NextResponse.json(modules);
    }

    const result = await listPrincipalUsers();
    return NextResponse.json(result, { status: result.success ? 200 : 403 });
  } catch (error: any) {
    console.error('GET /api/plataforma/usuarios-principales:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al listar' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const result = await upsertPrincipalUser({
      entityId: payload.entityId,
      institutionName: payload.institutionName,
      nit: payload.nit,
      city: payload.city,
      department: payload.department,
      phone: payload.phone,
      email: payload.email,
      password: payload.password,
      status: payload.status === 'Inactive' ? 'Inactive' : 'Active',
      modules: payload.modules || [],
    });

    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    });
  } catch (error: any) {
    console.error('POST /api/plataforma/usuarios-principales:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al guardar' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId');
    if (!entityId) {
      return NextResponse.json(
        { success: false, error: 'entityId requerido' },
        { status: 400 }
      );
    }

    const result = await deactivatePrincipalUser(entityId);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    console.error('DELETE /api/plataforma/usuarios-principales:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al desactivar' },
      { status: 500 }
    );
  }
}
