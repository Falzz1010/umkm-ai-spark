
export interface GeminiInsight {
  id: string;
  type: 'prediction' | 'strategy' | 'market_trend' | 'optimization';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  actionable: boolean;
  timestamp: Date;
  data?: any;
}

export interface BusinessContext {
  totalProducts: number;
  activeProducts: number;
  totalStock: number;
  lowStockProducts: number;
  categories: string[];
  weeklyRevenue: number;
  monthlyRevenue: number;
  weeklyTransactions: number;
  monthlyTransactions: number;
  topSellingProducts: Array<{ name: string; quantity: number }>;
  priceRanges: { min: number; max: number; avg: number };
  marginAnalysis: { avg: number; low: number; high: number };
}
