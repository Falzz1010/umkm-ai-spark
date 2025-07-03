
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Plus } from 'lucide-react';
import { ProductList } from './ProductList';
import { ProductFilters } from './ProductFilters';
import { AddProductDialog } from './AddProductDialog';

interface TabProductsProps {
  products: any[];
  filteredProducts: any[];
  filterCategory: string;
  filterSearch: string;
  filterStatus: string;
  filterStok: string;
  setFilterCategory: (val: string) => void;
  setFilterSearch: (val: string) => void;
  setFilterStatus: (val: string) => void;
  setFilterStok: (val: string) => void;
  handleExportExcel: () => void;
  handleExportReport: () => void;
  refreshData: () => void;
}

export function TabProducts(props: TabProductsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <CardTitle>Produk Saya</CardTitle>
          <CardDescription>Kelola produk bisnis Anda</CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={props.handleExportExcel}
            size="sm"
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button 
            variant="outline" 
            onClick={props.handleExportReport}
            size="sm"
            className="w-full sm:w-auto"
          >
            <FileText className="h-4 w-4 mr-2" />
            Download Laporan
          </Button>
          <AddProductDialog onProductAdded={props.refreshData}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Produk
          </AddProductDialog>
        </div>
      </CardHeader>
      <CardContent>
        <ProductFilters
          products={props.products}
          category={props.filterCategory}
          onCategoryChange={props.setFilterCategory}
          search={props.filterSearch}
          onSearchChange={props.setFilterSearch}
          showActive={props.filterStatus}
          onShowActiveChange={props.setFilterStatus}
          stokStatus={props.filterStok}
          onStokStatusChange={props.setFilterStok}
        />
        <ProductList products={props.filteredProducts} onRefresh={props.refreshData} />
      </CardContent>
    </Card>
  );
}
