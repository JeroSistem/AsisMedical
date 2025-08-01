
import { AppLayout } from '@/components/app-layout';
import { UserList } from '@/components/user-list';
import { getUsers } from '@/lib/data';

export default async function UsersPage() {
  const users = await getUsers();
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Usuarios del Sistema</h2>
        </div>
        <UserList users={users} />
      </div>
    </AppLayout>
  );
}
