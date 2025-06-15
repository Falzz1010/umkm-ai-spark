
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, KeyRound } from "lucide-react";

interface EditUserDialogProps {
  userId: string;
  currentEmail: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ userId, currentEmail, open, onOpenChange }: EditUserDialogProps) {
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      // Call edge function
      const res = await fetch("/functions/v1/admin-update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          new_email: email !== currentEmail ? email : undefined,
          new_password: password || undefined,
        }),
      });

      let result: any;
      try {
        result = await res.json();
      } catch (err) {
        // If not JSON, try to get text body
        const text = await res.text();
        result = { error: 'Response is not JSON', body: text };
      }

      if (res.ok) {
        toast({
          title: "Berhasil",
          description: "Data pengguna berhasil diupdate.",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Gagal update",
          description: (result.error || result.body || "Terjadi kesalahan."),
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Gagal update",
        description: String(e),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Email/Password User</DialogTitle>
          <DialogDescription>
            Hanya admin yang dapat mengubah data penting akun user.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <div className="flex gap-2 items-center">
              <Mail size={18} className="text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="Email baru"
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password Baru
            </label>
            <div className="flex gap-2 items-center">
              <KeyRound size={18} className="text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Biarkan kosong jika tidak ingin mengubah password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="animate-spin w-4 h-4 mr-1" />}
            Simpan
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={loading}>
              Batal
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

