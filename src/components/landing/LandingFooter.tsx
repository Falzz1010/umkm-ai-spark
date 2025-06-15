
import { Sparkles } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-background border-t py-12 transition-colors animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4 animate-scale-in">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">AI UMKM</span>
        </div>
        <p className="text-muted-foreground mb-4 animate-fade-in">
          Empowering Indonesian SMEs with AI Technology
        </p>
        <p className="text-sm text-muted-foreground animate-fade-in">
          &copy; 2024 AI Asisten UMKM. Dikembangkan dengan ❤️ untuk mendukung UMKM Indonesia.
        </p>
      </div>
    </footer>
  );
}
