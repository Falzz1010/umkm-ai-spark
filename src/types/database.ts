
export type UserRole = 'admin' | 'user';

export interface Profile {
  id: string;
  full_name: string;
  business_name?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  price?: number;
  cost?: number;
  category?: string;
  image_url?: string;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIGeneration {
  id: string;
  user_id: string;
  product_id?: string;
  generation_type: 'description' | 'promotion' | 'pricing' | 'tip';
  input_data: Record<string, any>;
  generated_content: string;
  created_at: string;
}
