
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingCTA() {
  const navigate = useNavigate();
  return (
    <section className="py-20 relative overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      <div className="relative max-w-4xl mx-auto text-center px-4 text-white">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4 animate-fade-in">
          Siap Mengembangkan Bisnis UMKM Anda?
        </h2>
        <p className="text-xl mb-8 opacity-90 animate-fade-in">
          Bergabunglah dengan ribuan UMKM yang sudah merasakan transformasi digital
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
          <Button size="lg"
            variant="secondary"
            className="text-lg px-8 py-6 hover-scale shadow-xl"
            onClick={() => navigate('/auth')}>
            Mulai Gratis Sekarang
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg"
            variant="outline"
            className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-purple-600 hover-scale transition"
            onClick={() => navigate('/auth')}>
            Hubungi Sales
          </Button>
        </div>
      </div>
    </section>
  );
}
