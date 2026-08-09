import { NextRequest, NextResponse } from 'next/server';
import { addUser, getUsers } from '@/lib/data';

// GET - Obtener todos los usuarios
export async function GET() {
  const users = await getUsers();

  return NextResponse.json({
    success: true,
    data: users
  });
}

// POST - Crear nuevo usuario (modo sin base de datos)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      role,
      status,
      password
    } = body as {
      name?: string;
      email?: string;
      role?: string;
      status?: string;
      password?: string;
    };

    if (!name || !email || !role) {
      return NextResponse.json(
        { success: false, error: 'Datos requeridos faltantes' },
        { status: 400 }
      );
    }

    if (!password) {
      console.warn('POST /api/configuracion/users recibido sin contraseña: se ignora hashing por modo demo');
    }

    const existingUsers = await getUsers();
    const emailExists = existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
      return NextResponse.json(
        { success: false, error: 'El email ya está registrado (modo demo)' },
        { status: 400 }
      );
    }

    const newUser = await addUser({
      name,
      email,
      role,
      status: status ?? 'Active'
    });

    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'Usuario creado en memoria. Configure una base de datos para persistir los cambios.'
    });
  } catch (error: unknown) {
    console.error('Error creating user in demo mode:', error);
    const message = error instanceof Error ? error.message : 'Error al crear usuario';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
