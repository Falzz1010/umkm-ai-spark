
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Product } from '@/types/database';
import { Package, Trash2, User, Calendar, DollarSign } from 'lucide-react';

interface ProductWithProfile extends Product {
  profiles?: { full_name: string } | null;
}

interface AdminProductsTabProps {
  products: ProductWithProfile[];
  onDeleteProduct: (productId: string) => void;
}

export function AdminProductsTab({ products, onDeleteProduct }: AdminProductsTabProps) {
  return (
    <Card className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm border-border/50 shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Produk Terbaru
            </CardTitle>
            <CardDescription>Daftar produk yang baru ditambahkan pengguna</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {products.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-lg">Belum ada produk yang ditambahkan</p>
                <p className="text-sm text-muted-foreground/80 mt-1">Produk baru akan muncul di sini</p>
              </div>
            )}
            {products.map((product, index) => (
              <div
                key={product.id}
                className="
                  group p-4 border border-border/50 rounded-xl shadow-sm 
                  bg-gradient-to-r from-background/80 to-background/60 
                  backdrop-blur-sm hover:shadow-lg transition-all duration-300 
                  hover:scale-[1.02] hover:-translate-y-1
                  animate-slide-up
                "
                style={{'--index': index} as any}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <Badge 
                        variant={product.is_active ? "default" : "secondary"}
                        className="ml-2 group-hover:scale-105 transition-transform"
                      >
                        {product.is_active ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>{product.category || 'Kategori tidak diset'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium text-foreground">
                          Rp {product.price?.toLocaleString() || 'Belum diset'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{product.profiles?.full_name || 'Unknown User'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(product.created_at).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 lg:ml-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="
                        transition-all duration-200 hover:scale-105 
                        hover:shadow-md group/btn
                      "
                      onClick={() => onDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2 group-hover/btn:animate-bounce-subtle" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
