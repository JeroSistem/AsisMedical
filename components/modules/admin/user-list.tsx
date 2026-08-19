
'use client';

import * as React from 'react';
import { User } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserPlus, Search } from 'lucide-react';

export function UserList({ users }: { users: User[] }) {
  const [search, setSearch] = React.useState('');
  const router = useRouter();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRowClick = (userId: string) => {
    // router.push(`/admin/users/${userId}`); // Optional: Navigate to user detail page
  };

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y botón de crear */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/usuarios/nuevo">
            <UserPlus className="mr-2 h-4 w-4" /> Crear Usuario
          </Link>
        </Button>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700 px-6 py-4">Nombre</TableHead>
                <TableHead className="font-semibold text-gray-700 px-6 py-4">Email</TableHead>
                <TableHead className="font-semibold text-gray-700 px-6 py-4">Rol</TableHead>
                <TableHead className="font-semibold text-gray-700 px-6 py-4">Fecha Creación</TableHead>
                <TableHead className="font-semibold text-gray-700 px-6 py-4 text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  onClick={() => handleRowClick(user.id)}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <TableCell className="font-medium px-6 py-4">{user.name}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-600">{user.email}</TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-600">{user.creationDate}</TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                      {user.status === 'Active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mensaje cuando no hay resultados */}
      {filteredUsers.length === 0 && (
        <div className="text-center p-12 bg-white rounded-lg border shadow-sm">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
          <p className="text-gray-600">
            {search ? 'Intenta con otros términos de búsqueda' : 'No hay usuarios registrados en el sistema'}
          </p>
        </div>
      )}

      {/* Información de resultados */}
      {filteredUsers.length > 0 && (
        <div className="text-sm text-gray-600 text-center p-4 bg-gray-50 rounded-lg">
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </div>
      )}
    </div>
  );
}
