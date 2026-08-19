import { NextRequest, NextResponse } from 'next/server';
import {
  getAllEntities,
  createEntity,
  updateEntity,
  deleteEntity,
  getEntityById,
  getAllModules,
} from '@/lib/actions/entities';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Obtener una institución específica
      const result = await getEntityById(id);
      if (result.success) {
        return NextResponse.json(result);
      } else {
        return NextResponse.json(result, { status: 404 });
      }
    }

    // Obtener todas las instituciones
    const result = await getAllEntities();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error en GET /api/configuracion/entities:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al obtener las instituciones',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Validar datos requeridos
    if (!payload.name || !payload.type || !payload.adminUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Faltan datos requeridos: name, type, adminUser',
        },
        { status: 400 }
      );
    }

    if (!payload.adminUser.name || !payload.adminUser.email || !payload.adminUser.password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Faltan datos del usuario administrador: name, email, password',
        },
        { status: 400 }
      );
    }

    const result = await createEntity({
      name: payload.name,
      type: payload.type,
      status: payload.status || 'ACTIVE',
      adminUser: {
        name: payload.adminUser.name,
        email: payload.adminUser.email,
        password: payload.adminUser.password,
      },
      modules: payload.modules || [],
    });

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error en POST /api/configuracion/entities:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al crear la institución',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json();

    if (!payload.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Se requiere el ID de la institución',
        },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (payload.name) updateData.name = payload.name;
    if (payload.type) updateData.type = payload.type;
    if (payload.status) updateData.status = payload.status;
    if (payload.adminUser) updateData.adminUser = payload.adminUser;
    if (payload.modules !== undefined) updateData.modules = payload.modules;

    const result = await updateEntity(payload.id, updateData);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error en PUT /api/configuracion/entities:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al actualizar la institución',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Se requiere el ID de la institución',
        },
        { status: 400 }
      );
    }

    const result = await deleteEntity(id);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error en DELETE /api/configuracion/entities:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al eliminar la institución',
      },
      { status: 500 }
    );
  }
}
