
-- TRIGGER: Kurangi stok produk setiap kali ada penjualan masuk
CREATE OR REPLACE FUNCTION public.decrement_product_stock_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
    SET stock = stock - NEW.quantity
    WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop jika sudah ada agar tidak dobel
DROP TRIGGER IF EXISTS trg_decrement_product_stock_on_sale ON public.sales_transactions;
CREATE TRIGGER trg_decrement_product_stock_on_sale
AFTER INSERT ON public.sales_transactions
FOR EACH ROW
EXECUTE FUNCTION public.decrement_product_stock_on_sale();
