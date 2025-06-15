
// Define valid table names for type safety
export type TableName = 
  | 'products' 
  | 'ai_generations' 
  | 'business_members' 
  | 'businesses' 
  | 'notifications' 
  | 'profiles' 
  | 'sales_transactions' 
  | 'user_roles';

export type ViewName = 'daily_sales_summary';

// Define filter operators
export type FilterOperator = 
  | 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' 
  | 'like' | 'ilike' | 'is' | 'in' | 'cs' | 'cd';

export interface DatabaseFilter {
  column: string;
  operator: FilterOperator;
  value: any;
}

export interface OrderByConfig {
  column: string;
  ascending?: boolean;
}

// Improved type definitions with better organization
export interface BaseTableInsert {
  user_id?: string;
  created_at?: string;
}

export interface ProductInsert extends BaseTableInsert {
  name: string;
  description?: string;
  price?: number;
  cost?: number;
  category?: string;
  image_url?: string;
  stock?: number;
  is_active?: boolean;
}

export interface SalesTransactionInsert extends BaseTableInsert {
  product_id: string;
  quantity: number;
  price: number;
  // Removed total since it's a generated column
}

export interface AIGenerationInsert extends BaseTableInsert {
  product_id?: string;
  generation_type: string;
  input_data: any;
  generated_content: string;
}

export interface NotificationInsert extends BaseTableInsert {
  title: string;
  message: string;
  type?: string;
  read?: boolean;
}

export interface ProfileInsert {
  id: string;
  full_name: string;
  business_name?: string;
  phone?: string;
  address?: string;
}

// Generic type for table inserts with better type safety
export type TableInsert<T extends TableName> = 
  T extends 'products' ? ProductInsert :
  T extends 'sales_transactions' ? SalesTransactionInsert :
  T extends 'ai_generations' ? AIGenerationInsert :
  T extends 'notifications' ? NotificationInsert :
  T extends 'profiles' ? ProfileInsert :
  Record<string, any>;
