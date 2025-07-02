
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Sparkles } from 'lucide-react';
import { Product } from '@/types/database';
import { generationTypes } from './AITypeSelector';

interface AIGenerationFormProps {
  selectedType: string;
  selectedProduct: string;
  onProductChange: (productId: string) => void;
  input: string;
  onInputChange: (input: string) => void;
  products: Product[];
  loading: boolean;
  aiUsageCount: number;
  dailyLimit: number;
  onGenerate: () => void;
}

export function AIGenerationForm({
  selectedType,
  selectedProduct,
  onProductChange,
  input,
  onInputChange,
  products,
  loading,
  aiUsageCount,
  dailyLimit,
  onGenerate
}: AIGenerationFormProps) {
  const canGenerate = aiUsageCount < dailyLimit && (selectedType === 'custom' || selectedProduct);

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {(selectedType !== 'custom') && (
        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-medium text-gray-900 dark:text-blue-200">
            Pilih Produk
          </label>
          <Select value={selectedProduct} onValueChange={onProductChange}>
            <SelectTrigger className="w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-blue-700 h-10 sm:h-11">
              <SelectValue placeholder="Pilih produk..." />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-blue-700 z-50">
              {products.map((product) => (
                <SelectItem 
                  key={product.id} 
                  value={product.id} 
                  className="hover:bg-gray-50 dark:hover:bg-blue-900 text-sm sm:text-base"
                >
                  {product.name} - {product.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm sm:text-base font-medium text-gray-900 dark:text-blue-200">
          {selectedType === 'custom' ? 'Prompt Kustom' : 'Instruksi Tambahan (Opsional)'}
        </label>
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={
            selectedType === 'custom' 
              ? "Contoh: Buatkan email marketing untuk pelanggan lama agar mereka beli ulang produk A..."
              : "Contoh: Tonjolkan keunggulan kualitas dan bahan organik..."
          }
          rows={3}
          className="resize-none bg-white dark:bg-slate-800 border-gray-200 dark:border-blue-700 text-gray-900 dark:text-blue-100 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
        />
      </div>

      <Button 
        onClick={onGenerate}
        disabled={loading || !canGenerate}
        className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-sm sm:text-base"
        size="lg"
      >
        {loading ? (
          <>
            <Bot className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate {generationTypes.find(t => t.value === selectedType)?.label}
          </>
        )}
      </Button>
    </div>
  );
}
