
import { GeminiInsight, BusinessContext } from '@/types/gemini';

export const parseGeminiInsights = (aiText: string): GeminiInsight[] => {
  const insights: GeminiInsight[] = [];
  
  // Split by common insight indicators
  const sections = aiText.split(/(?=\d+\.|•|-)/).filter(s => s.trim());
  
  sections.forEach((section, index) => {
    if (section.trim().length < 20) return; // Skip short sections
    
    const lines = section.trim().split('\n').filter(l => l.trim());
    if (lines.length === 0) return;
    
    // Extract title and message
    const firstLine = lines[0].replace(/^\d+\.\s*|^[•-]\s*/, '').trim();
    const restLines = lines.slice(1).join(' ').trim();
    
    // Determine insight type based on content
    let type: GeminiInsight['type'] = 'optimization';
    let priority: GeminiInsight['priority'] = 'medium';
    
    if (firstLine.toLowerCase().includes('prediksi') || firstLine.toLowerCase().includes('akan')) {
      type = 'prediction';
      priority = 'high';
    } else if (firstLine.toLowerCase().includes('strategi') || firstLine.toLowerCase().includes('rekomendasi')) {
      type = 'strategy';
      priority = 'medium';
    } else if (firstLine.toLowerCase().includes('trend') || firstLine.toLowerCase().includes('pasar')) {
      type = 'market_trend';
      priority = 'medium';
    }
    
    // Determine priority based on urgency keywords
    if (section.toLowerCase().includes('urgent') || section.toLowerCase().includes('segera') || 
        section.toLowerCase().includes('kritis') || section.toLowerCase().includes('habis')) {
      priority = 'high';
    }
    
    insights.push({
      id: `gemini-${index}-${Date.now()}`,
      type,
      title: firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine,
      message: restLines || firstLine,
      priority,
      confidence: 85 + Math.floor(Math.random() * 15), // 85-100% confidence
      actionable: true,
      timestamp: new Date(),
      data: { source: 'gemini-ai' }
    });
  });
  
  return insights.slice(0, 4); // Limit to 4 insights
};

export const generateBasicInsights = (context: BusinessContext): GeminiInsight[] => {
  const insights: GeminiInsight[] = [];
  
  if (context.lowStockProducts > 0) {
    insights.push({
      id: 'basic-stock-alert',
      type: 'optimization',
      title: 'Perhatian Stok Produk',
      message: `${context.lowStockProducts} produk memiliki stok rendah. Segera lakukan restok untuk menghindari kehabisan.`,
      priority: 'high',
      confidence: 95,
      actionable: true,
      timestamp: new Date(),
      data: { source: 'fallback' }
    });
  }
  
  if (context.weeklyRevenue > 0) {
    const dailyAvg = context.weeklyRevenue / 7;
    insights.push({
      id: 'basic-revenue-trend',
      type: 'market_trend',
      title: 'Analisis Penjualan Mingguan',
      message: `Rata-rata penjualan harian Rp${dailyAvg.toLocaleString()}. Pertahankan momentum dengan promosi konsisten.`,
      priority: 'medium',
      confidence: 90,
      actionable: true,
      timestamp: new Date(),
      data: { source: 'fallback' }
    });
  }
  
  return insights;
};
