
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIGeneration } from '@/types/database';
import { Bot, User, Package, Calendar, Sparkles } from 'lucide-react';

interface AIGenerationWithDetails extends AIGeneration {
  profiles?: { full_name: string } | null;
  products?: { name: string } | null;
}

interface AdminAITabProps {
  aiGenerations: AIGenerationWithDetails[];
}

const getTypeColor = (type: string) => {
  const colors = {
    description: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    promotion: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    pricing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    campaign: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    schedule: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    custom: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    tip: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
  };
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
};

export function AdminAITab({ aiGenerations }: AdminAITabProps) {
  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm border-border/50 shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              AI Generations Terbaru
            </CardTitle>
            <CardDescription>Aktivitas penggunaan AI assistant terbaru</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {aiGenerations.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-lg">Belum ada aktivitas AI</p>
                <p className="text-sm text-muted-foreground/80 mt-1">Aktivitas AI akan muncul di sini</p>
              </div>
            )}
            {aiGenerations.map((generation, index) => (
              <div
                key={generation.id}
                className="
                  group p-4 border border-border/50 rounded-xl shadow-sm
                  bg-gradient-to-r from-background/80 to-background/60 
                  backdrop-blur-sm hover:shadow-lg transition-all duration-300
                  hover:scale-[1.02] hover:-translate-y-1
                  animate-slide-up
                "
                style={{'--index': index} as any}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <Badge 
                      className={`${getTypeColor(generation.generation_type)} w-fit group-hover:scale-105 transition-transform`}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      {generation.generation_type}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(generation.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-muted/30 rounded-lg p-3 group-hover:bg-muted/50 transition-colors">
                    <p className="text-sm text-foreground/90 line-clamp-3 group-hover:text-primary transition-colors">
                      {generation.generated_content}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>{generation.profiles?.full_name || 'Unknown User'}</span>
                    </div>
                    {generation.products && (
                      <div className="flex items-center gap-2">
                        <Package className="h-3 w-3" />
                        <span>Produk: {generation.products.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
