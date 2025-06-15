
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingHero() {
  const navigate = useNavigate();
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-100/60 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/20 transition-colors"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 animate-fade-in">🚀 Platform AI Terdepan untuk UMKM</Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
            Transformasi
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Digital </span>
            UMKM Anda
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: "100ms", animationFillMode: "both"}}>
            Platform AI terpadu yang membantu UMKM mengembangkan bisnis dengan teknologi kecerdasan buatan.
            Kelola produk, generate konten berkualitas, dan dapatkan insights bisnis yang actionable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-scale-in" style={{animationDelay: "150ms", animationFillMode: "both"}}>
            <Button size="lg"
              className="text-lg px-8 py-6 hover-scale shadow-lg transition-all duration-200"
              onClick={() => navigate('/auth')}>
              Mulai Gratis Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg"
              variant="outline"
              className="text-lg px-8 py-6 hover:bg-indigo-50 hover:text-indigo-700 border-indigo-100 transition-all duration-200"
              onClick={() => navigate('/auth')}>
              Lihat Demo
            </Button>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground animate-fade-in" style={{animationDelay: "300ms", animationFillMode: "both"}}>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Gratis 14 hari</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Tanpa kartu kredit</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Setup 5 menit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
