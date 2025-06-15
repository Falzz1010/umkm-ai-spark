
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const DUMMY_CONTACTS = [
  { id: "1", name: "Bu Siti", phone: "+6281234567890" },
  { id: "2", name: "Pak Budi", phone: "+6281122334455" },
  { id: "3", name: "Toko Maju", phone: "+6282233445566" },
];

export function WhatsAppBroadcastTab() {
  const { toast } = useToast();
  const [selected, setSelected] = useState<string[]>([]);
  const [pesan, setPesan] = useState("");

  const handleChangeContact = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    setSelected(prev => 
      e.target.checked
        ? [...prev, id]
        : prev.filter(i => i !== id)
    );
  };

  const handleSelectAll = () => {
    if (selected.length === DUMMY_CONTACTS.length) {
      setSelected([]);
    } else {
      setSelected(DUMMY_CONTACTS.map(c => c.id));
    }
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesan || selected.length === 0) {
      toast({
        title: "Lengkapi data",
        description: "Pilih minimal satu kontak dan isi pesan.",
        variant: "destructive",
      });
      return;
    }
    // Simulasi pengiriman
    toast({
      title: "Broadcast Terkirim!",
      description: `Pesan ke ${selected.length} kontak berhasil disimulasikan.`,
    });
    setPesan("");
    setSelected([]);
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Broadcast WhatsApp</CardTitle>
          <CardDescription>
            Kirim pesan promosi atau info stok ke pelanggan Anda!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selected.length === DUMMY_CONTACTS.length}
                  onChange={handleSelectAll}
                  id="select-all"
                  className="mr-2"
                />
                <label htmlFor="select-all" className="font-semibold">
                  Pilih Semua Kontak
                </label>
              </div>
              <div className="grid gap-2 pl-2">
                {DUMMY_CONTACTS.map(contact => (
                  <label key={contact.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(contact.id)}
                      onChange={e => handleChangeContact(e, contact.id)}
                    />
                    <span>
                      {contact.name} <span className="text-xs text-muted-foreground">{contact.phone}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="pesan" className="block mb-1 font-medium">
                Pesan Broadcast
              </label>
              <textarea
                id="pesan"
                value={pesan}
                onChange={e => setPesan(e.target.value)}
                rows={3}
                className="w-full border px-3 py-2 rounded text-sm"
                placeholder="Tulis pesan promosi, info stok, dsb..."
              ></textarea>
            </div>
            <Button type="submit" className="w-full">
              Kirim Broadcast
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
