
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Package, ChartBar, Users } from 'lucide-react';
import { motion } from "framer-motion";

export function LandingFeatures() {
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="py-20 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Badge variant="outline" className="mb-4">✨ Fitur Unggulan</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Semua yang Anda Butuhkan dalam Satu Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Solusi lengkap untuk mengoptimalkan operasional dan marketing UMKM Anda
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ scale: 1.04 }}
              className="relative group"
            >
              <Card className="relative border-0 bg-background/70 backdrop-blur transition-all duration-300 group-hover:shadow-2xl hover-scale">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-background to-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow">
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
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
