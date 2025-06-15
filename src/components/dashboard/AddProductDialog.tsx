
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSweetAlert } from '@/hooks/useSweetAlert';

interface AddProductDialogProps {
  onProductAdded: () => void;
  children: React.ReactNode;
}

export function AddProductDialog({ onProductAdded, children }: AddProductDialogProps) {
  const { user } = useAuth();
  const { showSuccess, showError, showLoading, closeLoading } = useSweetAlert();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost: '',
    category: '',
    stock: '0'
  });

  const categories = [
    'Makanan & Minuman',
    'Fashion & Pakaian',
    'Elektronik',
    'Kecantikan & Kesehatan',
    'Rumah Tangga',
    'Olahraga & Hobi',
    'Lainnya'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    showLoading("Menambahkan produk...");
    
    try {
      const { error } = await supabase.from('products').insert([
        {
          user_id: user.id,
          name: formData.name,
          description: formData.description || null,
          price: formData.price ? parseFloat(formData.price) : null,
          cost: formData.cost ? parseFloat(formData.cost) : null,
          category: formData.category || null,
          stock: parseInt(formData.stock) || 0
        }
      ]);

      closeLoading();

      if (error) throw error;

      showSuccess("Berhasil", "Produk berhasil ditambahkan");

      setFormData({
        name: '',
        description: '',
        price: '',
        cost: '',
        category: '',
        stock: '0'
      });
      setOpen(false);
      onProductAdded();
    } catch (error: any) {
      closeLoading();
      showError("Error", "Gagal menambahkan produk: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={loading}>{children}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Produk Baru</DialogTitle>
          <DialogDescription>
            Isi informasi produk yang ingin Anda tambahkan
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Produk *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Kopi Arabica Premium"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Deskripsi singkat produk..."
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Modal (Rp)</Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="50000"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Harga Jual (Rp)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="75000"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stok</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="100"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="relative">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                'Simpan Produk'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
