
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Package, TrendingUp, Users, ChartBar, Sparkles, ArrowRight, Check, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingBenefits } from '@/components/landing/LandingBenefits';
import { LandingTestimonials } from '@/components/landing/LandingTestimonials';
import { LandingFAQ } from '@/components/landing/LandingFAQ';
import { LandingCTA } from '@/components/landing/LandingCTA';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingChatbot } from "@/components/landing/LandingChatbot";

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Generate deskripsi produk, caption promosi, dan saran bisnis dengan AI',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Package,
      title: 'Manajemen Produk',
      description: 'Kelola produk, harga, stok, dan kategori dengan mudah',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: ChartBar,
      title: 'Analytics Dashboard',
      description: 'Monitor performa bisnis dengan grafik dan insights mendalam',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Users,
      title: 'Role Management',
      description: 'Sistem role Admin dan User dengan akses berbeda',
      color: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const benefits = [
    'Otomatisasi konten dengan AI',
    'Dashboard analytics real-time',
    'Export data ke Excel',
    'Multi-role access control',
    'Interface mobile-friendly',
    'Support 24/7'
  ];

  const testimonials = [
    {
      name: 'Sarah Wijaya',
      business: 'Toko Fashion Online',
      content: 'AI Assistant membantu saya membuat deskripsi produk yang menarik. Penjualan meningkat 40% dalam 2 bulan!',
      rating: 5
    },
    {
      name: 'Ahmad Rahman',
      business: 'Kedai Kopi Local',
      content: 'Analytics dashboard memberikan insight yang sangat berguna untuk strategi marketing saya.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background text-foreground">
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
      <LandingBenefits />
      <LandingTestimonials />
      {/* FAQ Accordion Section */}
      <LandingFAQ />
      {/* Chatbot Gemini AI (Baru Ditambahkan Dibawah Testimoni) */}
      <section className="py-12 transition-colors">
        <LandingChatbot />
      </section>
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
