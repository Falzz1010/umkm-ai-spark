
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Sparkles, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import * as React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer';

export function LandingNavbar() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

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

          {!isMobile && (
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
          )}

          {isMobile && (
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Menu"
                  className="ml-2"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-w-xs w-full right-0 fixed top-0 h-screen bg-background rounded-none shadow-xl p-0 animate-slide-in-right">
                <div className="flex flex-col gap-2 py-6 px-6 min-h-screen">
                  <div className="flex items-center mb-6 space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-foreground">AI UMKM</span>
                  </div>
                  <ThemeToggle />
                  <Button
                    variant="ghost"
                    className="justify-start w-full"
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate('/auth');
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start w-full text-indigo-600 border-indigo-600"
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate('/auth/admin');
                    }}
                  >
                    Login Admin
                  </Button>
                  <Button
                    className="justify-start w-full"
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate('/auth');
                    }}
                  >
                    Daftar Gratis
                  </Button>
                  <DrawerClose asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-auto self-end"
                      onClick={() => setDrawerOpen(false)}
                    >
                      Tutup
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>
    </nav>
  );
}
