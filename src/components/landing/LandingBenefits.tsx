
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { TrendingUp, Bot, ChartBar, Check } from 'lucide-react';
import { motion } from "framer-motion";

export function LandingBenefits() {
  const benefits = [
    'Otomatisasi konten dengan AI',
    'Dashboard analytics real-time',
    'Export data ke Excel',
    'Multi-role access control',
    'Interface mobile-friendly',
    'Support 24/7'
  ];

  const stats = [
    {
      icon: TrendingUp,
      title: 'Peningkatan Penjualan',
      value: '35%',
      description: 'Rata-rata dalam 3 bulan',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      icon: Bot,
      title: 'Efisiensi Waktu',
      value: '60%',
      description: 'Hemat waktu untuk konten',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      icon: ChartBar,
      title: 'Data-Driven Decision',
      value: '100%',
      description: 'Insights bisnis yang akurat',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    }
  ];

  return (
    <motion.section
      className="py-24 lg:py-32"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              💡 Keunggulan Platform
            </Badge>
            <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-8 tracking-tight">
              Mengapa Memilih AI UMKM?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed font-light">
              Kami memahami tantangan UMKM dan menyediakan solusi yang tepat sasaran
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-center gap-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-foreground font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl transform rotate-3 scale-105"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-3xl transform -rotate-2 scale-105"></div>
            
            <Card className="relative bg-white/90 backdrop-blur-xl border-0 p-8 shadow-2xl overflow-hidden">
              <div className="space-y-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    className="flex items-center gap-6"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.15, duration: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center`}>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="font-bold text-foreground text-lg">{stat.title}</h3>
                        <span className={`text-3xl font-bold ${stat.color}`}>+{stat.value}</span>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
