
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/types/database';

interface AdminUsersTabProps {
  users: Profile[];
}

export function AdminUsersTab({ users }: AdminUsersTabProps) {
  return (
    <Card className="bg-card/90 shadow-md border-0 rounded-xl">
      <CardHeader>
        <CardTitle>Pengguna Terbaru</CardTitle>
        <CardDescription>Daftar pengguna yang baru mendaftar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length === 0 && (
            <div className="text-center text-muted-foreground py-12">Belum ada pengguna terdaftar.</div>
          )}
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg shadow-sm bg-background/70 hover:shadow-lg transition-all group space-y-2 lg:space-y-0"
            >
              <div>
                <h3 className="font-semibold group-hover:text-primary transition">{user.full_name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.business_name || 'Belum diset'}</p>
                <p className="text-sm text-gray-500">{user.phone || 'Belum diset'}</p>
              </div>
              <Badge variant="outline">
                {new Date(user.created_at).toLocaleDateString('id-ID')}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
