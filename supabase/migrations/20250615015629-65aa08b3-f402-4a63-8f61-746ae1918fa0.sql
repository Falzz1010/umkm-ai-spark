
-- RLS POLICIES FOR SUPABASE (wajib agar data user bisa diakses sesuai user_id)

-- PRODUCTS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User dapat melihat produknya sendiri" ON public.products
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User dapat menambah produk" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User dapat mengubah produknya sendiri" ON public.products
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "User dapat hapus produknya sendiri" ON public.products
  FOR DELETE USING (auth.uid() = user_id);

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User dapat lihat/mengubah profilenya sendiri" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "User dapat update profilenya sendiri" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- SALES TRANSACTIONS
ALTER TABLE public.sales_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User dapat mengelola transaksi miliknya" ON public.sales_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User dapat insert transaksi miliknya" ON public.sales_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User dapat update transaksi miliknya" ON public.sales_transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "User dapat hapus transaksi miliknya" ON public.sales_transactions
  FOR DELETE USING (auth.uid() = user_id);

-- AI GENERATIONS
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User dapat mengakses AI generations miliknya" ON public.ai_generations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User dapat insert AI generations miliknya" ON public.ai_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- NOTIFICATIONS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User dapat mengelola notifikasi miliknya" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User dapat update notifikasi miliknya" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "User dapat delete notifikasi miliknya" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

