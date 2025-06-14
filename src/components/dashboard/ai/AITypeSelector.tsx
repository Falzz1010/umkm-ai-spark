
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Sparkles, DollarSign, Megaphone, Calendar, Zap, Brain, Target, TrendingUp } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface GenerationType {
  value: string;
  label: string;
  icon: LucideIcon;
  description: string;
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
    features: ['SEO Optimized', 'Conversion Focused', 'Emotional Appeal']
  },
  { 
    value: 'promotion', 
    label: 'Caption Promosi', 
    icon: Megaphone, 
    description: 'Buat caption viral untuk social media',
    features: ['Viral Content', 'Hashtag Strategy', 'CTA Optimization']
  },
  { 
    value: 'pricing', 
    label: 'Strategi Harga', 
    icon: DollarSign, 
    description: 'Analisis harga kompetitif dan profitable',
    features: ['Market Analysis', 'Profit Optimization', 'Competitive Edge']
  },
  { 
    value: 'campaign', 
    label: 'Campaign 360°', 
    icon: Target, 
    description: 'Strategi kampanye marketing holistik',
    features: ['Multi-Platform', 'ROI Focused', 'Brand Building']
  },
  { 
    value: 'schedule', 
    label: 'Content Calendar', 
    icon: Calendar, 
    description: 'Jadwal konten strategis 30 hari',
    features: ['Content Planning', 'Engagement Timing', 'Trend Analysis']
  },
  { 
    value: 'analytics', 
    label: 'Business Intelligence', 
    icon: TrendingUp, 
    description: 'Analisis performa dan insight bisnis',
    features: ['Performance Metrics', 'Growth Insights', 'Data-Driven']
  },
  { 
    value: 'branding', 
    label: 'Brand Identity', 
    icon: Brain, 
    description: 'Bangun identitas brand yang kuat',
    features: ['Brand Voice', 'Visual Identity', 'Market Position']
  },
  { 
    value: 'custom', 
    label: 'AI Consultant', 
    icon: Bot, 
    description: 'Konsultasi bisnis dengan AI expert',
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
            className={`cursor-pointer transition-all duration-200 border ${
              isSelected 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => onTypeSelect(type.value)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  isSelected 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                  <type.icon className="h-4 w-4" />
                </div>
                <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {type.label}
                </h3>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                {type.description}
              </p>
              
              <div className="space-y-1">
                {type.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              
              {isSelected && (
                <div className="mt-3 py-1 px-2 bg-blue-100 dark:bg-blue-900 rounded text-center">
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    Terpilih
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
