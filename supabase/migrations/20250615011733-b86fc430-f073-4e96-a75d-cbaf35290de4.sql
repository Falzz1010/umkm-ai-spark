
-- 1. Buat tabel transaksi penjualan
CREATE TABLE public.sales_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(12,2) NOT NULL, -- harga jual per unit
  total NUMERIC(14,2) GENERATED ALWAYS AS (quantity * price) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sales_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their sales" ON public.sales_transactions
  FOR ALL
  USING (auth.uid() = user_id);
