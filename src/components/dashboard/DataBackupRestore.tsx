
import { useState } from 'react';
import { Download, Upload, Database, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function DataBackupRestore() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleBackup = async () => {
    if (!user) return;
    
    setIsBackingUp(true);
    try {
      // Fetch all user data
      const [productsRes, salesRes, profileRes] = await Promise.all([
        supabase.from('products').select('*').eq('user_id', user.id),
        supabase.from('sales_transactions').select('*').eq('user_id', user.id),
        supabase.from('profiles').select('*').eq('id', user.id).single()
      ]);

      const backupData = {
        timestamp: new Date().toISOString(),
        user_id: user.id,
        products: productsRes.data || [],
        sales_transactions: salesRes.data || [],
        profile: profileRes.data,
        version: '1.0'
      };

      // Create and download backup file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `umkm-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup Berhasil",
        description: "Data telah dibackup dan diunduh.",
      });
    } catch (error) {
      console.error('Backup error:', error);
      toast({
        title: "Backup Gagal",
        description: "Terjadi kesalahan saat backup data.",
        variant: "destructive",
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsRestoring(true);
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      // Validate backup data
      if (!backupData.user_id || !backupData.products) {
        throw new Error('Invalid backup file format');
      }

      // Restore products (with conflict handling)
      if (backupData.products.length > 0) {
        const { error: productsError } = await supabase
          .from('products')
          .upsert(
            backupData.products.map((p: any) => ({
              ...p,
              user_id: user.id, // Ensure correct user_id
              id: undefined // Let Supabase generate new IDs to avoid conflicts
            })),
            { onConflict: 'name,user_id' }
          );

        if (productsError) throw productsError;
      }

      toast({
        title: "Restore Berhasil",
        description: `${backupData.products.length} produk berhasil direstore.`,
      });

      // Refresh page to show restored data
      window.location.reload();
    } catch (error) {
      console.error('Restore error:', error);
      toast({
        title: "Restore Gagal",
        description: "File backup tidak valid atau terjadi kesalahan.",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Backup & Restore Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleBackup}
            disabled={isBackingUp}
            className="flex-1"
          >
            {isBackingUp ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Backup Data
          </Button>

          <div className="flex-1">
            <input
              type="file"
              accept=".json"
              onChange={handleRestore}
              disabled={isRestoring}
              className="hidden"
              id="restore-input"
            />
            <Button
              onClick={() => document.getElementById('restore-input')?.click()}
              disabled={isRestoring}
              variant="outline"
              className="w-full"
            >
              {isRestoring ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Restore Data
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Backup akan menyimpan semua produk dan transaksi Anda. 
          Restore akan menambahkan data dari file backup.
        </p>
      </CardContent>
    </Card>
  );
}
