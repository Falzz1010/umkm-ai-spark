
import { useState, useEffect } from 'react';
import { Product } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useSweetAlert } from '@/hooks/useSweetAlert';

interface EditProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditProductDialog({ product, open, onOpenChange, onSuccess }: EditProductDialogProps) {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showLoading, closeLoading } = useSweetAlert();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    cost: '',
    stock: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        price: product.price?.toString() || '',
        cost: product.cost?.toString() || '',
        stock: product.stock?.toString() || ''
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    showLoading("Mengupdate produk...");
    
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description || null,
          category: formData.category || null,
          price: formData.price ? parseFloat(formData.price) : null,
          cost: formData.cost ? parseFloat(formData.cost) : null,
          stock: formData.stock ? parseInt(formData.stock) : 0
        })
        .eq('id', product.id);

      closeLoading();

      if (error) throw error;

      showSuccess("Berhasil", "Produk berhasil diupdate");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      closeLoading();
      showError("Error", "Gagal mengupdate produk: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Produk</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Nama Produk</label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description">Deskripsi</label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="category">Kategori</label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <label htmlFor="price">Harga Jual</label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="cost">Harga Modal</label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="stock">Stok</label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="relative">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
