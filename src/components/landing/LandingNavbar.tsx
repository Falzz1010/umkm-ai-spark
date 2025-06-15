
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingNavbar() {
  const navigate = useNavigate();
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">AI UMKM</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => navigate('/auth')}>Login</Button>
            <Button
              variant="outline"
              className="text-indigo-600 border-indigo-600"
              onClick={() => navigate('/auth/admin')}
            >
              Login Admin
            </Button>
            <Button onClick={() => navigate('/auth')}>Daftar Gratis</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
