
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

// Generic type for table inserts
export type TableInsert<T extends TableName> = 
  T extends 'products' ? {
    name: string;
    user_id: string;
    description?: string;
    price?: number;
    cost?: number;
    category?: string;
    image_url?: string;
    stock?: number;
    is_active?: boolean;
  } :
  T extends 'sales_transactions' ? {
    product_id: string;
    user_id: string;
    quantity: number;
    price: number;
    total?: number;
  } :
  T extends 'ai_generations' ? {
    user_id: string;
    product_id?: string;
    generation_type: string;
    input_data: any;
    generated_content: string;
  } :
  T extends 'notifications' ? {
    user_id: string;
    title: string;
    message: string;
    type?: string;
    read?: boolean;
  } :
  T extends 'profiles' ? {
    id: string;
    full_name: string;
    business_name?: string;
    phone?: string;
    address?: string;
  } :
  Record<string, any>;
