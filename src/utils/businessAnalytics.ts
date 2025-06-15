
import { Product } from '@/types/database';

export const getTopSellingProducts = (sales: any[]) => {
  const productSales = sales.reduce((acc, sale) => {
    const name = sale.products?.name || 'Unknown';
    acc[name] = (acc[name] || 0) + sale.quantity;
    return acc;
  }, {});
  
  return Object.entries(productSales)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([name, qty]) => ({ name, quantity: qty }));
};

export const getPriceRanges = (products: Product[]) => {
  const prices = products.map(p => Number(p.price) || 0).filter(p => p > 0);
  if (prices.length === 0) return { min: 0, max: 0, avg: 0 };
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: prices.reduce((a, b) => a + b, 0) / prices.length
  };
};

export const getMarginAnalysis = (products: Product[]) => {
  const margins = products.map(p => {
    const cost = Number(p.cost) || 0;
    const price = Number(p.price) || 0;
    return cost > 0 ? ((price - cost) / cost) * 100 : 0;
  }).filter(m => m > 0);
  
  if (margins.length === 0) return { avg: 0, low: 0, high: 0 };
  
  return {
    avg: margins.reduce((a, b) => a + b, 0) / margins.length,
    low: margins.filter(m => m < 20).length,
    high: margins.filter(m => m > 50).length
  };
};
