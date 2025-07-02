
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SalesTransactionsForm } from './SalesTransactionsForm';
import { SalesOmzetChart } from './SalesOmzetChart';
import { SalesTransactionsHistory } from './SalesTransactionsHistory';

interface TabSalesProps {
  products: any[];
  salesKey: number;
  setSalesKey: (v: (v: number) => number) => void;
}

export function TabSales({ products, salesKey, setSalesKey }: TabSalesProps) {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
        <Card className="w-full">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Catat Transaksi Penjualan</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Catat penjualan manual produk yang sudah terjual.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <SalesTransactionsForm
              products={products}
              onFinished={() => setSalesKey((v) => v + 1)}
            />
          </CardContent>
        </Card>
        
        <div className="w-full">
          <SalesOmzetChart />
        </div>
      </div>
      
      <div className="w-full">
        <SalesTransactionsHistory refreshKey={salesKey} />
      </div>
    </div>
  );
}
