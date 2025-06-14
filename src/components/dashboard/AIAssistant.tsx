
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, DollarSign, Megaphone } from 'lucide-react';
import { Product } from '@/types/database';

interface AIAssistantProps {
  products: Product[];
  onGenerationComplete: () => void;
}

export function AIAssistant({ products, onGenerationComplete }: AIAssistantProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generationTypes = [
    { value: 'description', label: 'Deskripsi Produk', icon: Sparkles, description: 'Generate deskripsi menarik untuk produk' },
    { value: 'promotion', label: 'Caption Promosi', icon: Megaphone, description: 'Buat caption promosi untuk social media' },
    { value: 'pricing', label: 'Saran Harga', icon: DollarSign, description: 'Dapatkan saran harga jual optimal' },
    { value: 'tip', label: 'Tips Bisnis', icon: Bot, description: 'Tips harian untuk mengembangkan bisnis' }
  ];

  // Demo function - will be replaced with actual AI integration
  const generateContent = async () => {
    setLoading(true);
    setResult('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    let demoResult = '';
    const selectedProductData = products.find(p => p.id === selectedProduct);

    switch (selectedType) {
      case 'description':
        demoResult = `${selectedProductData?.name || 'Produk Anda'} adalah solusi terbaik untuk kebutuhan sehari-hari. Dengan kualitas premium dan harga terjangkau, produk ini cocok untuk semua kalangan. Dilengkapi dengan fitur unggulan yang memberikan nilai lebih bagi pelanggan. Tersedia dalam berbagai pilihan yang sesuai dengan preferensi Anda.`;
        break;
      case 'promotion':
        demoResult = `🌟 PROMO SPESIAL! 🌟\n\n${selectedProductData?.name || 'Produk Amazing'} kini hadir dengan penawaran terbaik! 💝\n\n✨ Kualitas premium\n💰 Harga terjangkau\n🚚 Gratis ongkir\n\nJangan sampai kehabisan! Order sekarang juga 📱\n\n#PromoSpesial #KualitasTerbaik #UMKM`;
        break;
      case 'pricing':
        demoResult = `Berdasarkan analisis pasar, berikut saran harga untuk ${selectedProductData?.name || 'produk Anda'}:\n\n• Harga Modal: Rp ${selectedProductData?.cost?.toLocaleString() || '50.000'}\n• Markup yang disarankan: 50-70%\n• Range harga jual: Rp ${((selectedProductData?.cost || 50000) * 1.5).toLocaleString()} - Rp ${((selectedProductData?.cost || 50000) * 1.7).toLocaleString()}\n\nPertimbangkan juga harga kompetitor dan positioning produk Anda di pasar.`;
        break;
      case 'tip':
        demoResult = `💡 Tips Bisnis Hari Ini:\n\n1. Manfaatkan media sosial untuk promosi gratis\n2. Berikan pelayanan pelanggan yang excellent\n3. Dokumentasikan testimoni positif dari pembeli\n4. Buat konten edukasi seputar produk Anda\n5. Jalin kerjasama dengan UMKM lain untuk cross-promotion\n\nIngat: Konsistensi adalah kunci kesuksesan bisnis! 🚀`;
        break;
      default:
        demoResult = 'Silakan pilih jenis konten yang ingin di-generate.';
    }

    setResult(demoResult);
    setLoading(false);
    onGenerationComplete();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Assistant untuk UMKM
          </CardTitle>
          <CardDescription>
            Dapatkan bantuan AI untuk mengembangkan konten dan strategi bisnis Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {generationTypes.map((type) => (
              <Card 
                key={type.value} 
                className={`cursor-pointer transition-colors ${selectedType === type.value ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedType(type.value)}
              >
                <CardContent className="p-4 text-center">
                  <type.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">{type.label}</h3>
                  <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedType && (
            <div className="space-y-4">
              {(selectedType === 'description' || selectedType === 'promotion' || selectedType === 'pricing') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Pilih Produk</label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih produk..." />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedType === 'tip' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Ceritakan tentang bisnis Anda</label>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Contoh: Saya menjual kopi online, target customer usia 25-35 tahun..."
                    rows={3}
                  />
                </div>
              )}

              <Button 
                onClick={generateContent}
                disabled={loading || (selectedType !== 'tip' && !selectedProduct)}
                className="w-full"
              >
                {loading ? 'Generating...' : `Generate ${generationTypes.find(t => t.value === selectedType)?.label}`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Hasil AI Generation
              <Badge>{generationTypes.find(t => t.value === selectedType)?.label}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(result)}>
                Copy
              </Button>
              <Button variant="outline" onClick={() => setResult('')}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
