
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      // Tunggu userRole terupdate
      setTimeout(() => {
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        if (userRole === 'admin') {
          toast({
            title: "Berhasil",
            description: "Login admin berhasil!"
          });
          navigate('/dashboard');
        } else {
          toast({
            title: "Akses Ditolak",
            description: "Akun Anda bukan admin.",
            variant: "destructive"
          });
          setLoading(false);
        }
      }, 300); // tunggu 300ms supaya state userRole baru update
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login",
        variant: "destructive"
      });
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
