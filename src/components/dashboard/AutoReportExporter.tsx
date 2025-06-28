
import { useState } from 'react';
import { FileText, Download, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

export function AutoReportExporter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [period, setPeriod] = useState('7');
  const [isExporting, setIsExporting] = useState(false);

  const exportReport = async () => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      const days = parseInt(period);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch data
      const [productsRes, salesRes] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('sales_transactions')
          .select('*, products(name)')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString())
      ]);

      const products = productsRes.data || [];
      const sales = salesRes.data || [];

      // Prepare data for Excel
      const reportData = {
        summary: [{
          'Total Produk': products.length,
          'Produk Aktif': products.filter(p => p.is_active).length,
          'Total Penjualan': sales.length,
          'Total Revenue': sales.reduce((sum, s) => sum + (s.total_amount || 0), 0),
          'Periode': `${days} hari terakhir`,
          'Tanggal Export': new Date().toLocaleDateString('id-ID')
        }],
        products: products.map(p => ({
          'Nama Produk': p.name,
          'Kategori': p.category || '-',
          'Harga': p.price || 0,
          'HPP': p.cost || 0,
          'Stok': p.stock,
          'Status': p.is_active ? 'Aktif' : 'Nonaktif',
          'Dibuat': new Date(p.created_at).toLocaleDateString('id-ID')
        })),
        sales: sales.map(s => ({
          'Tanggal': new Date(s.created_at).toLocaleDateString('id-ID'),
          'Produk': s.products?.name || '-',
          'Jumlah': s.quantity,
          'Harga Satuan': s.unit_price,
          'Total': s.total_amount,
          'Catatan': s.notes || '-'
        }))
      };

      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Add sheets
      XLSX.utils.book_append_sheet(
        wb, 
        XLSX.utils.json_to_sheet(reportData.summary), 
        'Ringkasan'
      );
      XLSX.utils.book_append_sheet(
        wb, 
        XLSX.utils.json_to_sheet(reportData.products), 
        'Produk'
      );
      XLSX.utils.book_append_sheet(
        wb, 
        XLSX.utils.json_to_sheet(reportData.sales), 
        'Penjualan'
      );

      // Export file
      const fileName = `laporan-umkm-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast({
        title: "Export Berhasil",
        description: `Laporan ${days} hari terakhir berhasil diexport.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Gagal",
        description: "Terjadi kesalahan saat export laporan.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Export Laporan Otomatis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">
              Periode Laporan
            </label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Hari Terakhir</SelectItem>
                <SelectItem value="30">30 Hari Terakhir</SelectItem>
                <SelectItem value="90">3 Bulan Terakhir</SelectItem>
                <SelectItem value="365">1 Tahun Terakhir</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={exportReport}
            disabled={isExporting}
            className="flex-shrink-0"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export Excel
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Laporan akan berisi ringkasan, data produk, dan transaksi penjualan 
          dalam format Excel yang siap untuk analisis.
        </p>
      </CardContent>
    </Card>
  );
}
