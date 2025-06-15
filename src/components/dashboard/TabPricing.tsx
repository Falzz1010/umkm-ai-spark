
import React from 'react';
import { SmartPricingAssistant } from './SmartPricingAssistant';
import { PriceAlerts } from './PriceAlerts';
import { Product } from '@/types/database';

interface TabPricingProps {
  products: Product[];
  onPriceUpdate: (productId: string, newPrice: number) => void;
}

export function TabPricing({ products, onPriceUpdate }: TabPricingProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SmartPricingAssistant 
          products={products} 
          onPriceUpdate={onPriceUpdate}
        />
        <PriceAlerts products={products} />
      </div>
    </div>
  );
}
