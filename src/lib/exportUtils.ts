import * as XLSX from 'xlsx';
import { Product } from '@/types/database';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToExcel = (products: Product[], filename: string = 'products') => {
  const data = products.map(product => ({
    'Nama Produk': product.name,
    'Kategori': product.category || 'Tidak dikategorikan',
    'Harga Modal': product.cost || 0,
    'Harga Jual': product.price || 0,
    'Stok': product.stock || 0,
    'Status': product.is_active ? 'Aktif' : 'Tidak Aktif',
    'Tanggal Dibuat': new Date(product.created_at).toLocaleDateString('id-ID'),
    'Deskripsi': product.description || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Produk');

  // Auto-size columns
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  const cols = [];
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let max_width = 10;
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cell_address = XLSX.utils.encode_cell({ c: C, r: R });
      const cell = worksheet[cell_address];
      if (cell && cell.v) {
        const cell_width = cell.v.toString().length;
        if (cell_width > max_width) max_width = cell_width;
      }
    }
    cols.push({ width: Math.min(max_width + 2, 50) });
  }
  worksheet['!cols'] = cols;

  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToPDF = (products: Product[], userName?: string) => {
  const doc = new jsPDF();
  // Title
  doc.setFontSize(16);
  doc.text("LAPORAN PRODUK UMKM", 14, 16);
  doc.setFontSize(10);
  doc.text(
    `Tanggal Export: ${new Date().toLocaleDateString("id-ID")}    User: ${userName || "-"}`,
    14,
    22
  );

  // Table
  autoTable(doc, {
    head: [
      [
        "No",
        "Nama Produk",
        "Kategori",
        "Harga Modal",
        "Harga Jual",
        "Stok",
        "Status",
        "Tanggal Ditambah",
      ],
    ],
    body: products.map((p, i) => [
      String(i + 1),
      p.name,
      p.category || "-",
      "Rp " + (p.cost ?? 0).toLocaleString("id-ID"),
      "Rp " + (p.price ?? 0).toLocaleString("id-ID"),
      p.stock ?? 0,
      p.is_active ? "Aktif" : "Tidak Aktif",
      new Date(p.created_at).toLocaleDateString("id-ID"),
    ]),
    startY: 28,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [22, 163, 74] }, // green 600
    margin: { left: 10, right: 10 },
  });

  doc.save(`laporan_produk_${new Date().toISOString().split("T")[0]}.pdf`);
};

export const generateProductReport = (products: Product[]): string => {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.is_active).length;
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);

  return `
LAPORAN PRODUK UMKM
Tanggal: ${new Date().toLocaleDateString('id-ID')}

RINGKASAN:
- Total Produk: ${totalProducts}
- Produk Aktif: ${activeProducts}
- Produk Tidak Aktif: ${totalProducts - activeProducts}
- Kategori Tersedia: ${categories.length}
- Total Nilai Jual: Rp ${totalValue.toLocaleString('id-ID')}

KATEGORI:
${categories.map(cat => `- ${cat}: ${products.filter(p => p.category === cat).length} produk`).join('\n')}

DAFTAR PRODUK:
${products.map((p, i) => `
${i + 1}. ${p.name}
   Kategori: ${p.category || 'Tidak dikategorikan'}
   Harga Modal: Rp ${(p.cost || 0).toLocaleString('id-ID')}
   Harga Jual: Rp ${(p.price || 0).toLocaleString('id-ID')}
   Stok: ${p.stock || 0}
   Status: ${p.is_active ? 'Aktif' : 'Tidak Aktif'}
`).join('\n')}
  `;
};
