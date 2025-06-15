
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    <Card className="bg-card/90 shadow-md border-0 rounded-xl">
      <CardHeader>
        <CardTitle>AI Generations Terbaru</CardTitle>
        <CardDescription>Aktivitas penggunaan AI terbaru</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea
          className="max-h-[400px] overflow-y-auto pr-1 border rounded-lg bg-background/90"
          style={{ minHeight: '120px' }}
          type="always"
        >
          <div className="space-y-4">
            {aiGenerations.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                Belum ada aktivitas AI yang tercatat.
              </div>
            )}
            {aiGenerations.map((generation) => (
              <div
                key={generation.id}
                className="p-4 border border-border rounded-lg shadow-sm bg-card/80 hover:shadow-lg transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2 space-y-1 lg:space-y-0">
                  <Badge>{generation.generation_type}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(generation.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 line-clamp-2 group-hover:text-primary transition">
                  {generation.generated_content}
                </p>
                <div className="mt-2 text-xs text-muted-foreground">
                  Oleh: {generation.profiles?.full_name || 'Unknown User'}
                  {generation.products && (
                    <span> • Produk: {generation.products.name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

