import { Card, CardContent } from '@/components/ui/card';
import { Bot, Sparkles, DollarSign, Megaphone, Calendar, Zap } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface GenerationType {
  value: string;
  label: string;
  icon: LucideIcon;
  description: string;
  color: string;
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
    description: 'Generate deskripsi menarik untuk produk',
    color: 'bg-blue-500'
  },
  { 
    value: 'promotion', 
    label: 'Caption Promosi', 
    icon: Megaphone, 
    description: 'Buat caption promosi untuk social media',
    color: 'bg-green-500'
  },
  { 
    value: 'pricing', 
    label: 'Saran Harga', 
    icon: DollarSign, 
    description: 'Dapatkan saran harga jual optimal',
    color: 'bg-yellow-500'
  },
  { 
    value: 'campaign', 
    label: 'Campaign Generator', 
    icon: Zap, 
    description: 'Buat strategi kampanye lengkap',
    color: 'bg-purple-500'
  },
  { 
    value: 'schedule', 
    label: 'Jadwal Promosi', 
    icon: Calendar, 
    description: 'Rencana posting 7 hari ke depan',
    color: 'bg-orange-500'
  },
  { 
    value: 'custom', 
    label: 'Custom Prompt', 
    icon: Bot, 
    description: 'Prompt kustom untuk kebutuhan spesifik',
    color: 'bg-pink-500'
  }
];

export function AITypeSelector({ selectedType, onTypeSelect }: AITypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {generationTypes.map((type) => (
        <Card 
          key={type.value} 
          className={`cursor-pointer transition-all hover:shadow-md border ${
            selectedType === type.value 
              ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-600' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
          }`}
          onClick={() => onTypeSelect(type.value)}
        >
          <CardContent className="p-4 text-center">
            <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${type.color} flex items-center justify-center`}>
              <type.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-medium text-sm mb-1 text-gray-900 dark:text-blue-100">{type.label}</h3>
            <p className="text-xs text-gray-600 dark:text-blue-200">{type.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
export { generationTypes };
