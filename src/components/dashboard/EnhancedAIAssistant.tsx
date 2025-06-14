
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { AIUsageCard } from './ai/AIUsageCard';
import { AITypeSelector } from './ai/AITypeSelector';
import { AIGenerationForm } from './ai/AIGenerationForm';
import { AIResultCard } from './ai/AIResultCard';

interface EnhancedAIAssistantProps {
  products: Product[];
  onGenerationComplete: () => void;
}

export function EnhancedAIAssistant({ products, onGenerationComplete }: EnhancedAIAssistantProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiUsageCount, setAiUsageCount] = useState(0);
  const [dailyLimit] = useState(10);

  useEffect(() => {
    fetchAIUsage();
  }, [user]);

  const fetchAIUsage = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { count } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today);

      setAiUsageCount(count || 0);
    } catch (error) {
      console.error('Error fetching AI usage:', error);
    }
  };

  const generateContent = async () => {
    if (aiUsageCount >= dailyLimit) {
      toast({
        title: "Limit Tercapai",
        description: `Anda sudah mencapai batas ${dailyLimit} penggunaan AI hari ini.`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const selectedProductData = products.find(p => p.id === selectedProduct);
      
      console.log('Sending request to Gemini AI...');
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: {
          prompt: input || `Generate ${selectedType} untuk produk ini`,
          type: selectedType,
          productData: selectedProductData
        }
      });

      console.log('Gemini AI response:', data);

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data?.success) {
        setResult(data.generatedText);
        
        // Log AI usage with proper type conversion
        await supabase.from('ai_generations').insert({
          user_id: user?.id,
          product_id: selectedProduct || null,
          generation_type: selectedType,
          input_data: JSON.parse(JSON.stringify({ prompt: input, productData: selectedProductData })),
          generated_content: data.generatedText
        });

        fetchAIUsage();
        onGenerationComplete();
        
        toast({
          title: "AI Generation Berhasil",
          description: "Konten telah berhasil di-generate!"
        });
      } else {
        throw new Error(data?.error || 'Unknown error from AI service');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal menggenerate konten. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AIUsageCard aiUsageCount={aiUsageCount} dailyLimit={dailyLimit} />

      <Card className="border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Bot className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            AI Assistant UMKM - Powered by Gemini
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Dapatkan bantuan AI untuk mengembangkan konten dan strategi bisnis Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AITypeSelector selectedType={selectedType} onTypeSelect={setSelectedType} />

          {selectedType && (
            <AIGenerationForm
              selectedType={selectedType}
              selectedProduct={selectedProduct}
              onProductChange={setSelectedProduct}
              input={input}
              onInputChange={setInput}
              products={products}
              loading={loading}
              aiUsageCount={aiUsageCount}
              dailyLimit={dailyLimit}
              onGenerate={generateContent}
            />
          )}
        </CardContent>
      </Card>

      <AIResultCard 
        result={result} 
        selectedType={selectedType} 
        onClear={() => setResult('')} 
      />
    </div>
  );
}
