
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
    <div className="space-y-4">
      {(selectedType !== 'custom') && (
        <div>
          <label className="block text-sm font-medium mb-2">Pilih Produk</label>
          <Select value={selectedProduct} onValueChange={onProductChange}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih produk..." />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - {product.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">
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
          className="resize-none"
        />
      </div>

      <Button 
        onClick={onGenerate}
        disabled={loading || !canGenerate}
        className="w-full h-11"
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
