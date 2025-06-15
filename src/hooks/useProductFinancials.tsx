
import { useMemo } from 'react';
import { Product } from '@/types/database';
import { ProductFinancials } from '@/types/dashboard';

export function useProductFinancials(products: Product[]): ProductFinancials {
  return useMemo(() => {
    let totalOmzet = 0;
    let totalLaba = 0;

    // Filter active products once and calculate in single loop
    products
      .filter(product => product.is_active)
      .forEach(product => {
        const price = Number(product.price) || 0;
        const cost = Number(product.cost) || 0;
        const stock = Number(product.stock) || 0;
        
        totalOmzet += price * stock;
        totalLaba += (price - cost) * stock;
      });

    return { 
      omzet: totalOmzet, 
      laba: totalLaba 
    };
  }, [products]);
}
