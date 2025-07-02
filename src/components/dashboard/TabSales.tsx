
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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Catat Transaksi Penjualan</CardTitle>
            <CardDescription>Catat penjualan manual produk yang sudah terjual.</CardDescription>
          </CardHeader>
          <CardContent>
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
      <div className="mt-8">
        <SalesTransactionsHistory refreshKey={salesKey} />
      </div>
    </>
  );
}
