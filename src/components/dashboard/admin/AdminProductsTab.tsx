
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product, Profile } from '@/types/database';

interface ProductWithProfile extends Product {
  profiles?: { full_name: string } | null;
}

interface AdminProductsTabProps {
  products: ProductWithProfile[];
  onDeleteProduct: (productId: string) => void;
}

export function AdminProductsTab({ products, onDeleteProduct }: AdminProductsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Produk Terbaru</CardTitle>
        <CardDescription>Daftar produk yang baru ditambahkan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg space-y-2 lg:space-y-0">
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{product.category || 'Kategori tidak diset'}</p>
                <p className="text-sm text-gray-500">
                  Harga: Rp {product.price?.toLocaleString() || 'Belum diset'}
                </p>
                <p className="text-sm text-gray-400">
                  Oleh: {product.profiles?.full_name || 'Unknown User'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={product.is_active ? "default" : "secondary"}>
                  {product.is_active ? "Aktif" : "Tidak Aktif"}
                </Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteProduct(product.id)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
