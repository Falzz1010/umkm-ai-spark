
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
