
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { TrendingUp, Bot, ChartBar, Check } from 'lucide-react';

export function LandingBenefits() {
  const benefits = [
    'Otomatisasi konten dengan AI',
    'Dashboard analytics real-time',
    'Export data ke Excel',
    'Multi-role access control',
    'Interface mobile-friendly',
    'Support 24/7'
  ];
  return (
    <section className="py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="outline" className="mb-4">💡 Keunggulan Platform</Badge>
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
  );
}
