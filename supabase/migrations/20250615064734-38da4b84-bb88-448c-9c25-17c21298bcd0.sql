
-- Drop existing view
DROP VIEW IF EXISTS public.daily_sales_summary;

-- Recreate view without SECURITY DEFINER and without trying to add RLS to it
CREATE VIEW public.daily_sales_summary AS
SELECT
  s.user_id,
  date(s.created_at) AS sale_date,
  SUM(s.total) AS total_omzet,
  SUM((COALESCE(p.price,0) - COALESCE(p.cost,0)) * s.quantity) AS total_laba
FROM public.sales_transactions s
JOIN public.products p ON s.product_id = p.id
GROUP BY s.user_id, date(s.created_at);

-- Set security_barrier on the view to ensure proper security
ALTER VIEW public.daily_sales_summary SET (security_barrier = true);
