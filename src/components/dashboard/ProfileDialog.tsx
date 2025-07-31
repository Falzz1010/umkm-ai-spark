
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    businessName: '',
    phone: '',
    address: '',
    bio: '',
  });

  const handleSaveProfile = () => {
    // Here you would typically save to database
    toast({
      title: "Profil Diperbarui",
      description: "Profil Anda telah berhasil diperbarui.",
    });
    onOpenChange(false);
  };

  const getUserInitials = () => {
    if (profileData.fullName) {
      return profileData.fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Profil Pengguna</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) =>
                  setProfileData(prev => ({ ...prev, fullName: e.target.value }))
                }
                placeholder="Masukkan nama lengkap"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessName">Nama Bisnis</Label>
              <Input
                id="businessName"
                value={profileData.businessName}
                onChange={(e) =>
                  setProfileData(prev => ({ ...prev, businessName: e.target.value }))
                }
                placeholder="Masukkan nama bisnis"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData(prev => ({ ...prev, phone: e.target.value }))
                }
                placeholder="Masukkan nomor telepon"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                value={profileData.address}
                onChange={(e) =>
                  setProfileData(prev => ({ ...prev, address: e.target.value }))
                }
                placeholder="Masukkan alamat"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveProfile}>
              Simpan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
