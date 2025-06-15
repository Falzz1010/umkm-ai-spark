
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HandCoins, Calculator } from 'lucide-react';

export function ProductFinanceCards({ omzet, laba }: { omzet: number; laba: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-3">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-100 dark:border-green-950">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Omzet Produk Aktif</CardTitle>
          <HandCoins className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            Rp {omzet.toLocaleString('id-ID')}
          </div>
          <p className="text-xs text-muted-foreground">
            Penjualan potensial ('price × stock')
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border border-yellow-100 dark:border-yellow-950">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Perkiraan Total Laba</CardTitle>
          <Calculator className="h-5 w-5 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-700">
            Rp {laba.toLocaleString('id-ID')}
          </div>
          <p className="text-xs text-muted-foreground">
            Perkiraan ('(price - cost) × stock')
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
