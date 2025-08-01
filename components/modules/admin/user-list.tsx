
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
import { UserPlus } from 'lucide-react';

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
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <Input
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
         <Button asChild>
          <Link href="/admin/usuarios/nuevo">
            <UserPlus className="mr-2 h-4 w-4" /> Crear Usuario
          </Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead className="text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow
                key={user.id}
                onClick={() => handleRowClick(user.id)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.creationDate}</TableCell>
                <TableCell className="text-right">
                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                        {user.status === 'Active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredUsers.length === 0 && (
         <div className="text-center p-8 text-muted-foreground">
            No se encontraron usuarios.
         </div>
       )}
    </div>
  );
}
