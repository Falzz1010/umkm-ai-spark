
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useSweetAlert } from '@/hooks/useSweetAlert';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { supabase } from '@/integrations/supabase/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signOut } = useAuth();
  const { showSuccess, showError, showLoading, closeLoading } = useSweetAlert();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      showLoading('Sedang login admin...');
      const { error } = await signIn(email, password);

      if (error) {
        closeLoading();
        showError("Login Gagal", error.message);
        setLoading(false);
        return;
      }

      // Fetch user for role check
      const { data: user } = await supabase.auth.getUser();
      if (!user || !user.user) {
        closeLoading();
        showError("Login Gagal", "User tidak ditemukan setelah login.");
        setLoading(false);
        return;
      }

      // Cek role: harus admin
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.user.id)
        .single();

      if (roleError || !roleData) {
        closeLoading();
        showError("Akses Ditolak", "Tidak dapat menemukan role user.");
        setLoading(false);
        await signOut();
        return;
      }

      if (roleData.role === 'admin') {
        closeLoading();
        showSuccess("Login Admin Berhasil", "Selamat datang Admin!");
        setLoading(false);
        navigate('/dashboard');
      } else {
        closeLoading();
        showError("Akses Ditolak", "Akun Anda bukan admin.");
        setLoading(false);
        await signOut(); // Logout jika login bukan admin
      }
    } catch (error) {
      closeLoading();
      showError("Login Gagal", "Terjadi kesalahan saat login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-200">
      {/* Theme Toggle di kanan atas */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Admin Login
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Masuk sebagai admin platform UMKM-AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email (Admin)</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white transition-colors duration-200" 
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login Admin'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
