
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Catat Transaksi Penjualan</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Catat penjualan manual produk yang sudah terjual.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <SalesTransactionsForm
              products={products}
              onFinished={() => setSalesKey((v) => v + 1)}
            />
          </CardContent>
        </Card>
        <div>
          <SalesOmzetChart />
        </div>
      </div>
      <div>
        <SalesTransactionsHistory refreshKey={salesKey} />
      </div>
    </div>
  );
}
