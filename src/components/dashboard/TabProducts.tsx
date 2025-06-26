
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
      <CardHeader className="flex flex-col space-y-3 sm:space-y-2 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl">Produk Saya</CardTitle>
            <CardDescription className="text-sm">Kelola produk bisnis Anda</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <Button 
              variant="outline" 
              onClick={props.handleExportExcel}
              size="sm"
              className="w-full sm:w-auto text-sm h-9"
            >
              <Download className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Export Excel</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={props.handleExportReport}
              size="sm"
              className="w-full sm:w-auto text-sm h-9"
            >
              <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Download Laporan</span>
            </Button>
            <AddProductDialog onProductAdded={props.refreshData}>
              <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Tambah Produk</span>
            </AddProductDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
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
