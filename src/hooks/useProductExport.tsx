
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/database';
import { exportToExcel, generateProductReport } from '@/lib/exportUtils';

export function useProductExport() {
  const { profile } = useAuth();
  const { toast } = useToast();

  const handleExportExcel = (products: Product[]) => {
    if (products.length === 0) {
      toast({
        title: "Tidak ada data",
        description: "Belum ada produk untuk diekspor.",
        variant: "destructive"
      });
      return;
    }

    exportToExcel(products, `produk_${profile?.full_name?.replace(/\s+/g, '_').toLowerCase()}`);
    toast({
      title: "Export Berhasil",
      description: "Data produk berhasil diekspor ke Excel!"
    });
  };

  const handleExportReport = (products: Product[]) => {
    if (products.length === 0) {
      toast({
        title: "Tidak ada data",
        description: "Belum ada produk untuk dibuat laporan.",
        variant: "destructive"
      });
      return;
    }

    const report = generateProductReport(products);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan_produk_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Laporan Berhasil Dibuat",
      description: "Laporan produk berhasil diunduh!"
    });
  };

  return {
    handleExportExcel,
    handleExportReport
  };
}
