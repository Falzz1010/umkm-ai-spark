
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Sparkles, DollarSign, Megaphone, Calendar, Zap, Brain, Target, TrendingUp } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface GenerationType {
  value: string;
  label: string;
  icon: LucideIcon;
  description: string;
  gradient: string;
  features: string[];
}

interface AITypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

const generationTypes: GenerationType[] = [
  { 
    value: 'description', 
    label: 'Deskripsi Produk', 
    icon: Sparkles, 
    description: 'Generate deskripsi yang menarik dan persuasif',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['SEO Optimized', 'Conversion Focused', 'Emotional Appeal']
  },
  { 
    value: 'promotion', 
    label: 'Caption Promosi', 
    icon: Megaphone, 
    description: 'Buat caption viral untuk social media',
    gradient: 'from-green-500 to-emerald-500',
    features: ['Viral Content', 'Hashtag Strategy', 'CTA Optimization']
  },
  { 
    value: 'pricing', 
    label: 'Strategi Harga', 
    icon: DollarSign, 
    description: 'Analisis harga kompetitif dan profitable',
    gradient: 'from-yellow-500 to-orange-500',
    features: ['Market Analysis', 'Profit Optimization', 'Competitive Edge']
  },
  { 
    value: 'campaign', 
    label: 'Campaign 360°', 
    icon: Target, 
    description: 'Strategi kampanye marketing holistik',
    gradient: 'from-purple-500 to-pink-500',
    features: ['Multi-Platform', 'ROI Focused', 'Brand Building']
  },
  { 
    value: 'schedule', 
    label: 'Content Calendar', 
    icon: Calendar, 
    description: 'Jadwal konten strategis 30 hari',
    gradient: 'from-orange-500 to-red-500',
    features: ['Content Planning', 'Engagement Timing', 'Trend Analysis']
  },
  { 
    value: 'analytics', 
    label: 'Business Intelligence', 
    icon: TrendingUp, 
    description: 'Analisis performa dan insight bisnis',
    gradient: 'from-indigo-500 to-purple-600',
    features: ['Performance Metrics', 'Growth Insights', 'Data-Driven']
  },
  { 
    value: 'branding', 
    label: 'Brand Identity', 
    icon: Brain, 
    description: 'Bangun identitas brand yang kuat',
    gradient: 'from-pink-500 to-rose-500',
    features: ['Brand Voice', 'Visual Identity', 'Market Position']
  },
  { 
    value: 'custom', 
    label: 'AI Consultant', 
    icon: Bot, 
    description: 'Konsultasi bisnis dengan AI expert',
    gradient: 'from-gray-600 to-gray-800',
    features: ['Custom Solutions', 'Expert Advice', 'Flexible Approach']
  }
];

export function AITypeSelector({ selectedType, onTypeSelect }: AITypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {generationTypes.map((type) => {
        const isSelected = selectedType === type.value;
        return (
          <Card 
            key={type.value} 
            className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 overflow-hidden ${
              isSelected 
                ? 'ring-2 ring-blue-500 shadow-2xl transform scale-105' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => onTypeSelect(type.value)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
            
            <CardContent className="relative p-6 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${type.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <type.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {type.label}
                  </h3>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 flex-1">
                {type.description}
              </p>
              
              <div className="space-y-1">
                {type.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${type.gradient}`} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              
              {isSelected && (
                <div className="mt-4 py-2 px-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                    ✨ Terpilih
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export { generationTypes };
