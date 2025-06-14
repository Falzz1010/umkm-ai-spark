
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Package, TrendingUp, Users, ChartBar, Sparkles, ArrowRight, Check, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
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
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Login
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Daftar Gratis
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              🚀 Platform AI Terdepan untuk UMKM
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Transformasi
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Digital </span>
              UMKM Anda
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Platform AI terpadu yang membantu UMKM mengembangkan bisnis dengan teknologi kecerdasan buatan. 
              Kelola produk, generate konten berkualitas, dan dapatkan insights bisnis yang actionable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/auth')}>
                Mulai Gratis Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={() => navigate('/auth')}>
                Lihat Demo
              </Button>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
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

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              ✨ Fitur Unggulan
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Semua yang Anda Butuhkan dalam Satu Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Solusi lengkap untuk mengoptimalkan operasional dan marketing UMKM Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 border-0 bg-background/60 backdrop-blur">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-background to-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                💡 Keunggulan Platform
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Mengapa Memilih AI UMKM?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Kami memahami tantangan UMKM dan menyediakan solusi yang tepat sasaran
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl transform rotate-3"></div>
              <Card className="relative bg-background/80 backdrop-blur border-0 p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Peningkatan Penjualan</h3>
                      <p className="text-sm text-muted-foreground">Rata-rata 35% dalam 3 bulan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <Bot className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Efisiensi Waktu</h3>
                      <p className="text-sm text-muted-foreground">Hemat 60% waktu untuk konten</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <ChartBar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Data-Driven Decision</h3>
                      <p className="text-sm text-muted-foreground">Insights bisnis yang akurat</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              ⭐ Testimoni
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Dipercaya oleh Ribuan UMKM
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-background/60 backdrop-blur border-0">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">AI UMKM</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Empowering Indonesian SMEs with AI Technology
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; 2024 AI Asisten UMKM. Dikembangkan dengan ❤️ untuk mendukung UMKM Indonesia.
          </p>
        </div>
      </footer>
    </div>
  );
}
