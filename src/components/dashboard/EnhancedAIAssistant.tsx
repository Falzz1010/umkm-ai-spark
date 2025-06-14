
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot, Sparkles, DollarSign, Megaphone, Calendar, Share2, AlertTriangle, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

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

  const generationTypes = [
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
      
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: {
          prompt: input || `Generate ${selectedType} untuk produk ini`,
          type: selectedType,
          productData: selectedProductData
        }
      });

      if (error) throw error;

      if (data.success) {
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
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Gagal menggenerate konten. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(result);
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast({
        title: "Tersalin",
        description: "Konten telah disalin ke clipboard!"
      });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const usagePercentage = (aiUsageCount / dailyLimit) * 100;

  return (
    <div className="space-y-6">
      {/* AI Usage Limit */}
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Penggunaan AI Hari Ini</CardTitle>
            <Badge variant={usagePercentage >= 80 ? "destructive" : "secondary"}>
              {aiUsageCount}/{dailyLimit}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={usagePercentage} className="h-2" />
          {usagePercentage >= 80 && (
            <Alert className="mt-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Anda hampir mencapai batas harian. Tersisa {dailyLimit - aiUsageCount} penggunaan.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* AI Assistant Main Card */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            AI Assistant UMKM - Powered by Gemini
          </CardTitle>
          <CardDescription>
            Dapatkan bantuan AI untuk mengembangkan konten dan strategi bisnis Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {generationTypes.map((type) => (
              <Card 
                key={type.value} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedType === type.value 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setSelectedType(type.value)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${type.color} flex items-center justify-center`}>
                    <type.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{type.label}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedType && (
            <div className="space-y-4">
              {(selectedType !== 'custom') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Pilih Produk</label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
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
                  onChange={(e) => setInput(e.target.value)}
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
                onClick={generateContent}
                disabled={loading || aiUsageCount >= dailyLimit || (selectedType !== 'custom' && !selectedProduct)}
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
          )}
        </CardContent>
      </Card>

      {/* Result Card */}
      {result && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-500" />
              Hasil AI Generation
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {generationTypes.find(t => t.value === selectedType)?.label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">{result}</pre>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={copyToClipboard} className="flex-1 sm:flex-none">
                <span className="mr-2">📋</span>
                Copy
              </Button>
              <Button variant="outline" onClick={shareToWhatsApp} className="flex-1 sm:flex-none bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
                <Share2 className="h-4 w-4 mr-2" />
                Share ke WhatsApp
              </Button>
              <Button variant="outline" onClick={() => setResult('')} className="flex-1 sm:flex-none">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
