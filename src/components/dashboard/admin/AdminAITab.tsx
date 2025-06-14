
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIGeneration } from '@/types/database';

interface AIGenerationWithDetails extends AIGeneration {
  profiles?: { full_name: string } | null;
  products?: { name: string } | null;
}

interface AdminAITabProps {
  aiGenerations: AIGenerationWithDetails[];
}

export function AdminAITab({ aiGenerations }: AdminAITabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Generations Terbaru</CardTitle>
        <CardDescription>Aktivitas penggunaan AI terbaru</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {aiGenerations.map((generation) => (
            <div key={generation.id} className="p-4 border rounded-lg">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2 space-y-1 lg:space-y-0">
                <Badge>{generation.generation_type}</Badge>
                <span className="text-sm text-gray-500">
                  {new Date(generation.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {generation.generated_content}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Oleh: {generation.profiles?.full_name || 'Unknown User'}
                {generation.products && (
                  <span> • Produk: {generation.products.name}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
