
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/database';
import { BusinessContext } from '@/types/gemini';
import { getTopSellingProducts, getPriceRanges, getMarginAnalysis } from '@/utils/businessAnalytics';

export const buildBusinessContext = async (
  user: any,
  products: Product[]
): Promise<BusinessContext | null> => {
  if (!user || products.length === 0) return null;

  try {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch sales data
    const [weekSalesResult, monthSalesResult] = await Promise.all([
      supabase
        .from('sales_transactions')
        .select('product_id, quantity, total, price, created_at, products(name, category, cost)')
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString()),
      
      supabase
        .from('sales_transactions')
        .select('product_id, quantity, total, created_at')
        .eq('user_id', user.id)
        .gte('created_at', monthAgo.toISOString())
    ]);

    const weekSales = weekSalesResult.data || [];
    const monthSales = monthSalesResult.data || [];

    return {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.is_active).length,
      totalStock: products.reduce((sum, p) => sum + (p.stock || 0), 0),
      lowStockProducts: products.filter(p => (p.stock || 0) < 5).length,
      categories: [...new Set(products.map(p => p.category))],
      weeklyRevenue: weekSales.reduce((sum, s) => sum + (Number(s.total) || 0), 0),
      monthlyRevenue: monthSales.reduce((sum, s) => sum + (Number(s.total) || 0), 0),
      weeklyTransactions: weekSales.length,
      monthlyTransactions: monthSales.length,
      topSellingProducts: getTopSellingProducts(weekSales),
      priceRanges: getPriceRanges(products),
      marginAnalysis: getMarginAnalysis(products)
    };
  } catch (error) {
    console.error('Error building business context:', error);
    return null;
  }
};
