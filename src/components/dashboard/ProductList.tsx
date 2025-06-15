
import { useState } from 'react';
import { Product } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { EditProductDialog } from './EditProductDialog';
import { SecureDataTable } from '@/components/common/SecureDataTable';
import { ActionButton } from '@/components/common/ActionButton';
import { useSecureActions } from '@/hooks/common/useSecureActions';
import { useSweetAlert } from '@/hooks/useSweetAlert';

interface ProductListProps {
  products: Product[];
  onRefresh: () => void;
}

export function ProductList({ products, onRefresh }: ProductListProps) {
  const { updateItem, deleteItem, loading } = useSecureActions();
  const { showConfirm } = useSweetAlert();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const toggleProductStatus = async (product: Product) => {
    const result = await updateItem(
      'products',
      product.id,
      { is_active: !product.is_active },
      ['user'],
      'Status produk',
      true
    );
    
    if (result.success) {
      onRefresh();
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const result = await showConfirm(
      'Hapus Produk',
      `Yakin ingin menghapus produk "${product.name}"? Data ini tidak dapat dikembalikan.`
    );

    if (!result.isConfirmed) return;

    const deleteResult = await deleteItem(
      'products',
      product.id,
      ['user'],
      'Produk',
      true
    );
    
    if (deleteResult.success) {
      onRefresh();
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setEditDialogOpen(true);
  };

  const columns = [
    {
      key: 'name' as keyof Product,
      label: 'Nama Produk',
      render: (product: Product) => (
        <div className="font-medium">{product.name}</div>
      )
    },
    {
      key: 'category' as keyof Product,
      label: 'Kategori',
      render: (product: Product) => (
        <span className="text-sm text-muted-foreground">
          {product.category || '-'}
        </span>
      )
    },
    {
      key: 'price' as keyof Product,
      label: 'Harga',
      render: (product: Product) => (
        <span className="font-medium">
          Rp {product.price?.toLocaleString() || '-'}
        </span>
      )
    },
    {
      key: 'stock' as keyof Product,
      label: 'Stok',
      render: (product: Product) => (
        <span className={`font-medium ${
          (product.stock || 0) < 5 ? 'text-red-600' : 'text-green-600'
        }`}>
          {product.stock}
        </span>
      )
    },
    {
      key: 'is_active' as keyof Product,
      label: 'Status',
      render: (product: Product) => (
        <Badge variant={product.is_active ? "default" : "secondary"}>
          {product.is_active ? "Aktif" : "Tidak Aktif"}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (product: Product) => (
        <div className="flex gap-2">
          <ActionButton
            requiredRoles={['user']}
            onClick={() => toggleProductStatus(product)}
            variant="outline"
            size="sm"
            disabled={loading === `update-${product.id}`}
          >
            {product.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </ActionButton>
          <ActionButton
            requiredRoles={['user']}
            onClick={() => handleEditProduct(product)}
            variant="outline"
            size="sm"
            disabled={loading === `update-${product.id}`}
          >
            <Edit className="h-4 w-4" />
          </ActionButton>
          <ActionButton
            requiredRoles={['user']}
            onClick={() => handleDeleteProduct(product)}
            variant="destructive"
            size="sm"
            disabled={loading === `delete-${product.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </ActionButton>
        </div>
      )
    }
  ];

  return (
    <>
      <ScrollArea className="h-[600px] w-full">
        <SecureDataTable
          data={products}
          columns={columns}
          emptyMessage="Belum ada produk. Tambahkan produk pertama Anda!"
        />
      </ScrollArea>

      <EditProductDialog
        product={editProduct}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={onRefresh}
      />
    </>
  );
}
