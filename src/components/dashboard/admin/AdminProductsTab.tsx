
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/database';

interface ProductWithProfile extends Product {
  profiles?: { full_name: string } | null;
}

interface AdminProductsTabProps {
  products: ProductWithProfile[];
  onDeleteProduct: (productId: string) => void;
}

export function AdminProductsTab({ products, onDeleteProduct }: AdminProductsTabProps) {
  return (
    <Card className="bg-card/90 shadow-md border-0 rounded-xl">
      <CardHeader>
        <CardTitle>Produk Terbaru</CardTitle>
        <CardDescription>Daftar produk yang baru ditambahkan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.length === 0 && (
            <div className="text-center text-muted-foreground py-12">Belum ada produk yang ditambahkan.</div>
          )}
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg shadow-sm bg-background/70 hover:shadow-lg transition-all cursor-pointer group space-y-2 lg:space-y-0"
            >
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-primary transition">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{product.category || 'Kategori tidak diset'}</p>
                <p className="text-sm text-gray-500">
                  Harga: <span className="font-medium text-foreground">Rp {product.price?.toLocaleString() || 'Belum diset'}</span>
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
                  className="transition-transform hover:scale-105"
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
