
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // FIX: Import Button
import { Profile } from '@/types/database';
import { EditUserDialog } from "./EditUserDialog";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface AdminUsersTabProps {
  users: Profile[];
}

export function AdminUsersTab({ users }: AdminUsersTabProps) {
  const [editId, setEditId] = useState<string | null>(null);

  const userToEdit = editId ? users.find(u => u.id === editId) : null;

  return (
    <Card className="bg-card shadow-md border-0 rounded-xl transition-colors">
      <CardHeader>
        <CardTitle className="text-lg">Pengguna Terbaru</CardTitle>
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
              className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg shadow-sm bg-background hover:bg-accent/40 hover:shadow-lg transition-all group space-y-2 lg:space-y-0"
            >
              <div>
                <h3 className="font-semibold group-hover:text-primary transition">{user.full_name}</h3>
                <p className="text-sm text-muted-foreground">{user.business_name || 'Belum diset'}</p>
                <p className="text-sm text-muted-foreground">{user.phone || 'Belum diset'}</p>
                <span className="text-xs text-muted-foreground">{user.id}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Badge variant="outline" className="text-xs px-2">
                  {new Date(user.created_at).toLocaleDateString('id-ID')}
                </Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  aria-label={`Edit ${user.full_name}`}
                  onClick={() => setEditId(user.id)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {userToEdit && (
          <EditUserDialog
            userId={userToEdit.id}
            currentEmail={""} // Fix: Profile has no .email; pass empty or fetch from elsewhere if needed
            open={!!editId}
            onOpenChange={(open) => !open && setEditId(null)}
          />
        )}
      </CardContent>
    </Card>
  );
}
