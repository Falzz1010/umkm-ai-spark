
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Bot, SendHorizontal, Loader2, X } from "lucide-react";

interface ChatMessage {
  sender: "user" | "ai";
  content: string;
}

const DUMMY_RESPONSES: { [key: string]: string } = {
  "hai": "Halo! 👋 Saya chatbot demo UMKM. Silakan ajukan pertanyaan seputar bisnis, promosi, atau produk Anda.",
  "siapa kamu": "Saya chatbot manual dummy tanpa AI. Jawaban saya tidak otomatis, hanya berdasarkan data statis.",
  "produk": "Produk UMKM sebaiknya punya keunikan (unique selling point) dan promosi kreatif.",
  "promosi": "Promosi efektif bisa dilakukan lewat media sosial, diskon khusus, dan testimoni pelanggan.",
  "harga": "Tentukan harga jual dengan memperhitungkan modal, markup, dan harga pasar.",
  "default": "Terima kasih atas pertanyaannya! (Ini jawaban dummy, chatbot AI telah diganti dengan manual response.)"
};

function getDummyResponse(input: string): string {
  const cleaned = input.trim().toLowerCase();
  for (const key in DUMMY_RESPONSES) {
    if (cleaned.includes(key) && key !== "default") {
      return DUMMY_RESPONSES[key];
    }
  }
  return DUMMY_RESPONSES["default"];
}

export function LandingChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      content:
        "Hai! 👋 Saya chatbot demo UMKM, tanpa AI. Tanyakan apapun tentang bisnis UMKM, promosi, atau produk Anda di sini.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { sender: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Simulasi delay agar terasa seperti loading ke server/AI.
    setTimeout(() => {
      const response = getDummyResponse(input);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", content: response }
      ]);
      setLoading(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }, 700);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="secondary"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-50 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105 transition"
        aria-label="Buka Chatbot Dummy"
        style={{ boxShadow: "0 2px 12px 0 rgba(80,0,220,.14)" }}
      >
        <Bot className="w-7 h-7 text-white" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg w-full p-0 overflow-hidden">
          <Card className="bg-background/80 border-0 shadow-xl">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow">
                  <Bot className="w-5 h-5 text-white" />
                </span>
                <CardTitle className="text-lg">ChatBot Demo Manual</CardTitle>
                <Badge variant="outline" className="ml-auto text-xs">Demo</Badge>
                <DialogClose asChild>
                  <button
                    className="ml-3 p-2 rounded hover:bg-accent focus:outline-none transition"
                    aria-label="Tutup Chatbot"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </DialogClose>
              </div>
              <p className="text-sm text-muted-foreground">
                Chatbot ini hanya menggunakan data manual statis untuk keperluan demo.
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-64 max-h-80 overflow-y-auto rounded-md border bg-muted/20 p-3 space-y-3 transition-colors"
                style={{ scrollbarWidth: "thin" }}
              >
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`px-4 py-2 rounded-xl max-w-[80%] text-sm ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-muted text-foreground"
                      } ${msg.sender === "ai" ? "rounded-bl-sm" : "rounded-br-sm"} shadow`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="mt-4 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tulis pesan atau pertanyaan..."
                  disabled={loading}
                  className="flex-1 bg-background rounded-full px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                  autoFocus={open}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={loading || !input.trim()}
                  className="flex-shrink-0"
                  aria-label="Kirim"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <SendHorizontal className="w-5 h-5" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LandingChatbot;

