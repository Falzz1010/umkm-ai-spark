
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LandingCTA() {
  const navigate = useNavigate();
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      <div className="relative max-w-4xl mx-auto text-center px-4 text-white">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          Siap Mengembangkan Bisnis UMKM Anda?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Bergabunglah dengan ribuan UMKM yang sudah merasakan transformasi digital
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={() => navigate('/auth')}>
            Mulai Gratis Sekarang
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-purple-600" onClick={() => navigate('/auth')}>
            Hubungi Sales
          </Button>
        </div>
      </div>
    </section>
  );
}
