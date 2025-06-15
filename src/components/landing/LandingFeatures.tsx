
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
      color: 'text-blue-600 dark:text-blue-400',
      gradient: 'from-blue-500/20 to-blue-600/20'
    },
    {
      icon: Package,
      title: 'Manajemen Produk',
      description: 'Kelola produk, harga, stok, dan kategori dengan mudah',
      color: 'text-green-600 dark:text-green-400',
      gradient: 'from-green-500/20 to-green-600/20'
    },
    {
      icon: ChartBar,
      title: 'Analytics Dashboard',
      description: 'Monitor performa bisnis dengan grafik dan insights mendalam',
      color: 'text-purple-600 dark:text-purple-400',
      gradient: 'from-purple-500/20 to-purple-600/20'
    },
    {
      icon: Users,
      title: 'Role Management',
      description: 'Sistem role Admin dan User dengan akses berbeda',
      color: 'text-orange-600 dark:text-orange-400',
      gradient: 'from-orange-500/20 to-orange-600/20'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="py-24 lg:py-32 bg-gradient-to-b from-muted/30 to-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            ✨ Fitur Unggulan
          </Badge>
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Semua yang Anda Butuhkan dalam Satu Platform
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Solusi lengkap untuk mengoptimalkan operasional dan marketing UMKM Anda
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className="relative group"
            >
              <Card className="relative border-0 bg-white/70 backdrop-blur-xl transition-all duration-500 group-hover:shadow-2xl overflow-hidden h-full">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <CardHeader className="text-center pb-6 relative z-10">
                  <motion.div 
                    className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-gradient-to-br from-white to-gray-50 flex items-center justify-center shadow-lg"
                    whileHover={{ 
                      rotate: [0, -10, 10, 0],
                      scale: 1.1 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className={`h-10 w-10 ${feature.color}`} />
                  </motion.div>
                  <CardTitle className="text-xl font-bold mb-2">{feature.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="text-center relative z-10 pb-8">
                  <CardDescription className="text-base leading-relaxed font-medium text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
