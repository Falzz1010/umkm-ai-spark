
export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  aiGenerations: number;
}

export interface ProductFinancials {
  omzet: number;
  laba: number;
}

export interface RealtimeSubscriptionConfig {
  table: string;
  event: '*' | 'INSERT' | 'UPDATE' | 'DELETE';
  filter?: string;
  callback: (payload: any) => void;
}
