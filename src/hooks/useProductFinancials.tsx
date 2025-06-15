
import { useMemo } from 'react';
import { Product } from '@/types/database';

export function useProductFinancials(products: Product[]) {
  const { omzet, laba } = useMemo(() => {
    // Omzet = total harga produk aktif (harga*stock), Laba = (harga - HPP)*stock
    let totalOmzet = 0;
    let totalLaba = 0;
    products
      .filter((p) => p.is_active)
      .forEach((p) => {
        const price = Number(p.price) || 0;
        const cost = Number(p.cost) || 0;
        const stock = Number(p.stock) || 0;
        totalOmzet += price * stock;
        totalLaba += (price - cost) * stock;
      });
    return { omzet: totalOmzet, laba: totalLaba };
  }, [products]);

  return { omzet, laba };
}
