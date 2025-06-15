
-- 2. Buat view ringkasan omzet & laba harian per user (untuk tren grafik dashboard)
CREATE OR REPLACE VIEW public.daily_sales_summary AS
SELECT
  s.user_id,
  date(s.created_at) AS sale_date,
  SUM(s.total) AS total_omzet,
  SUM((COALESCE(p.price,0) - COALESCE(p.cost,0)) * s.quantity) AS total_laba
FROM public.sales_transactions s
JOIN public.products p ON s.product_id = p.id
GROUP BY s.user_id, date(s.created_at);

-- 3. NOTIFIKASI: Trigger otomatis stok hampir habis & produk dinonaktifkan

CREATE OR REPLACE FUNCTION public.trigger_product_critical_notification()
RETURNS TRIGGER AS $$
DECLARE
  notif_exists boolean;
BEGIN
  -- Stok kritis
  IF NEW.stock IS NOT NULL AND NEW.stock < 5 AND NEW.is_active IS TRUE THEN
    SELECT EXISTS(
      SELECT 1 FROM public.notifications 
      WHERE user_id = NEW.user_id 
        AND title = 'Stok Hampir Habis'
        AND message LIKE '%' || NEW.name || '%'
        AND read = false
    ) INTO notif_exists;
    IF NOT notif_exists THEN
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (
        NEW.user_id,
        'Stok Hampir Habis',
        'Stok produk "' || NEW.name || '" menipis (' || NEW.stock || ' tersisa). Segera restock!',
        'warning'
      );
    END IF;
  END IF;

  -- Produk dinonaktifkan  
  IF NEW.is_active IS FALSE AND (OLD.is_active IS TRUE OR OLD.is_active IS NULL) THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.user_id,
      'Produk Dinonaktifkan',
      'Produk "' || NEW.name || '" telah dinonaktifkan.',
      'warning'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_product_critical_notification ON public.products;
CREATE TRIGGER trg_product_critical_notification
AFTER INSERT OR UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.trigger_product_critical_notification();
