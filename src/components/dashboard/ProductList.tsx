
import { useState } from 'react';
import { Product } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductListProps {
  products: Product[];
  onRefresh: () => void;
}

export function ProductList({ products, onRefresh }: ProductListProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    setLoading(productId);
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: `Produk ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengubah status produk",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    setLoading(productId);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Produk berhasil dihapus"
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus produk",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Belum ada produk. Tambahkan produk pertama Anda!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Badge variant={product.is_active ? "default" : "secondary"}>
                {product.is_active ? "Aktif" : "Tidak Aktif"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description || 'Belum ada deskripsi'}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span>Kategori: {product.category || '-'}</span>
                <span className="font-medium">
                  Rp {product.price?.toLocaleString() || '-'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Modal: Rp {product.cost?.toLocaleString() || '-'}</span>
                <span>Stok: {product.stock}</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleProductStatus(product.id, product.is_active)}
                disabled={loading === product.id}
              >
                {product.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => deleteProduct(product.id)}
                disabled={loading === product.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
