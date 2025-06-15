
export interface SalesTransaction {
  id: string;
  created_at: string;
  product_id: string;
  quantity: number;
  price: number;
  total: number;
  product_name: string;
  user_id: string;
}

export interface DailySalesData {
  sale_date: string;
  total_omzet: number;
  total_laba: number;
}

export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
}
