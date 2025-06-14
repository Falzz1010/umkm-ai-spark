
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generationTypes } from './AITypeSelector';

interface AIResultCardProps {
  result: string;
  selectedType: string;
  onClear: () => void;
}

export function AIResultCard({ result, selectedType, onClear }: AIResultCardProps) {
  const { toast } = useToast();

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

  if (!result) return null;

  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Sparkles className="h-5 w-5 text-green-500" />
          Hasil AI Generation
          <Badge variant="secondary">
            {generationTypes.find(t => t.value === selectedType)?.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-700">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900 dark:text-gray-100">{result}</pre>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={copyToClipboard} className="flex-1 sm:flex-none">
            <span className="mr-2">📋</span>
            Copy
          </Button>
          <Button variant="outline" onClick={shareToWhatsApp} className="flex-1 sm:flex-none">
            <Share2 className="h-4 w-4 mr-2" />
            Share ke WhatsApp
          </Button>
          <Button variant="outline" onClick={onClear} className="flex-1 sm:flex-none">
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
