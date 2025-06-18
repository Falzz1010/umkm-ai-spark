
import { Product } from '@/types/database';

export interface PriceSuggestion {
  productId: string;
  currentPrice: number;
  suggestedPrice: number;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
  applied: boolean;
}

export const generateSimulatedSuggestions = (products: Product[]): PriceSuggestion[] => {
  return products.map(product => {
    const currentPrice = product.price || 0;
    const cost = product.cost || 0;
    
    // More intelligent algorithm for price suggestion
    let suggestedPrice = currentPrice;
    let reason = '';
    let trend: 'up' | 'down' | 'stable' = 'stable';
    
    const currentMargin = currentPrice > 0 ? (currentPrice - cost) / cost * 100 : 0;
    
    if (currentMargin < 20 && cost > 0) {
      // Margin terlalu rendah
      suggestedPrice = Math.round(cost * 1.3 / 1000) * 1000;
      reason = `Margin profit terlalu rendah (${currentMargin.toFixed(1)}%). Tingkatkan harga untuk profit optimal.`;
      trend = 'up';
    } else if (currentMargin > 70 && cost > 0) {
      // Margin sangat tinggi, mungkin mempengaruhi daya saing
      suggestedPrice = Math.round(cost * 1.65 / 1000) * 1000;
      reason = `Margin sangat tinggi (${currentMargin.toFixed(1)}%). Pertimbangkan harga lebih kompetitif.`;
      trend = 'down';
    } else {
      // Harga sudah cukup optimal, kenaikan kecil
      const variation = 0.05 + Math.random() * 0.12;
      const isIncrease = Math.random() > 0.4; // Slight bias toward price increases
      suggestedPrice = Math.round(currentPrice * (1 + (isIncrease ? variation : -variation)) / 1000) * 1000;
      
      const reasons = [
        'Analisis kompetitor menunjukkan harga lebih tinggi',
        'Demand tinggi untuk kategori ini',
        'Margin profit dapat dioptimalkan',
        'Harga pasar sedang naik',
        'Kualitas produk mendukung harga premium',
        'Kompetitor menurunkan harga'
      ];
      
      reason = reasons[Math.floor(Math.random() * reasons.length)];
      trend = suggestedPrice > currentPrice ? 'up' : suggestedPrice < currentPrice ? 'down' : 'stable';
    }

    return {
      productId: product.id,
      currentPrice,
      suggestedPrice,
      reason,
      confidence: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
      trend,
      applied: false
    };
  });
};

export const parseAIPriceResponse = (aiResponse: string, product: Product): number => {
  // Parse AI response to extract pricing information
  const suggestedPriceMatch = aiResponse.match(/Rp\s?(\d{1,3}(,\d{3})*(\.\d+)?)/i);
  
  // Extract numbers with regex and convert to numeric value
  const priceNumbers = aiResponse.match(/\d{4,}/g);
  
  let suggestedPrice = product.price;
  if (suggestedPriceMatch && suggestedPriceMatch[1]) {
    const extractedPrice = suggestedPriceMatch[1].replace(/,/g, '');
    suggestedPrice = parseFloat(extractedPrice);
  } else if (priceNumbers && priceNumbers.length > 0) {
    // Take the first number that looks like a price
    suggestedPrice = parseInt(priceNumbers[0]);
  }
  
  // Ensure the suggested price is reasonable
  if (suggestedPrice < product.cost) {
    suggestedPrice = Math.round(product.cost * 1.2); // at least 20% profit margin
  }

  return suggestedPrice;
};

export const extractReasonFromAI = (aiResponse: string): string => {
  // Extract most reasonable part of response for reason
  let reason = aiResponse.split('.')[0];
  if (reason.length > 80) {
    reason = reason.substring(0, 80) + '...';
  }
  return reason;
};
