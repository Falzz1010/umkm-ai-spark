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

export function LandingChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      content:
        "Hai! 👋 Saya asisten AI Gemini. Tanyakan apapun tentang bisnis UMKM, promosi, atau produk Anda di sini.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
    setErrorMsg(null);

    try {
      const res = await fetch("/functions/v1/gemini-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          type: "",
        }),
      });

      let data: any;
      // Cek response type
      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        // Coba baca text dulu
        const errorText = await res.text();
        // Tampilkan status code dan informasi error di chat
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            content: `❌ [${res.status}] Error dari server: ${errorText?.slice(0,80) || "Unknown error, silakan cek backend Gemini AI"}`,
          }
        ]);
        setErrorMsg(`Error dari server (status: ${res.status})`);
        return;
      }

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        // Respon tidak berupa JSON
        const rawText = await res.text();
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            content: `❌ [Server bukan JSON]: ${rawText?.slice(0,80) || "(empty response)"}`,
          }
        ]);
        setErrorMsg("Respons server bukan dalam format JSON.");
        return;
      }

      // For debugging, log response
      console.log("[Chatbot Gemini] Response", data);

      if (data?.success && data.generatedText) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            content: data.generatedText,
          },
        ]);
      } else if (data?.error) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            content: `❌ ${data.error}`,
          },
        ]);
        setErrorMsg(data.error);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            content:
              "Maaf, saya belum dapat menjawab saat ini. Coba lagi nanti.",
          },
        ]);
        setErrorMsg("Tidak ada respons dari Gemini.");
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          content: "Terjadi kesalahan saat parsing jawaban server. Silakan coba lagi.",
        },
      ]);
      setErrorMsg(err?.message || "Unknown Error");
      console.error("[Chatbot Gemini] Fetch error:", err);
    } finally {
      setLoading(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="secondary"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full shadow-lg z-50 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105 transition"
        aria-label="Buka Chatbot AI Gemini"
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
                <CardTitle className="text-lg">ChatBot Gemini AI</CardTitle>
                <Badge variant="outline" className="ml-auto text-xs">Beta</Badge>
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
                Dapatkan bantuan instan untuk ide, deskripsi, dan strategi UMKM Anda.
              </p>
              {errorMsg && (
                <div className="mt-2 text-red-600 text-xs font-medium">
                  {errorMsg}
                </div>
              )}
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
