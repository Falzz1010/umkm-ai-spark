
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });
  const [preferences, setPreferences] = useState({
    language: 'id',
    timezone: 'Asia/Jakarta',
    theme: 'system',
  });

  const handleSaveSettings = () => {
    // Here you would typically save to database
    toast({
      title: "Pengaturan Disimpan",
      description: "Pengaturan Anda telah berhasil disimpan.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pengaturan</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Notifikasi */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Notifikasi</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notif">Email</Label>
                <Switch
                  id="email-notif"
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notif">Push Notification</Label>
                <Switch
                  id="push-notif"
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="marketing-notif">Marketing</Label>
                <Switch
                  id="marketing-notif"
                  checked={notifications.marketing}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, marketing: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Preferensi */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Preferensi</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="language">Bahasa</Label>
                <Input
                  id="language"
                  value={preferences.language}
                  onChange={(e) =>
                    setPreferences(prev => ({ ...prev, language: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Zona Waktu</Label>
                <Input
                  id="timezone"
                  value={preferences.timezone}
                  onChange={(e) =>
                    setPreferences(prev => ({ ...prev, timezone: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveSettings}>
              Simpan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
