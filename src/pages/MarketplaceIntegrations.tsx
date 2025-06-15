
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function MarketplaceIntegrations() {
  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Integrasi Marketplace</CardTitle>
          <CardDescription>
            Fitur ini akan memungkinkan Anda menghubungkan produk dengan marketplace. (Placeholder)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Di sini nanti akan tersedia pengaturan dan status integrasi ke marketplace seperti Tokopedia, Shopee, dsb.</p>
          <div className="mt-4 text-xs text-muted-foreground">Silakan request detail fitur jika ingin dikembangkan lebih lanjut.</div>
        </CardContent>
      </Card>
    </div>
  );
}
