
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, SendHorizontal, Loader2 } from "lucide-react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { sender: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/functions/v1/gemini-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          type: "", // tipe default buat chat bebas
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          content: data.generatedText ||
            "Maaf, saya belum dapat menjawab saat ini. Coba lagi nanti.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          content: "Terjadi kesalahan, coba lagi nanti.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  };

  return (
    <div className="mt-14 max-w-lg mx-auto w-full">
      <Card className="bg-background/80 border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow">
              <Bot className="w-5 h-5 text-white" />
            </span>
            <CardTitle className="text-lg">ChatBot Gemini AI</CardTitle>
            <Badge variant="outline" className="ml-auto text-xs">Beta</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Dapatkan bantuan instan untuk ide, deskripsi, dan strategi UMKM Anda.
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
              autoFocus={false}
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
    </div>
  );
}

export default LandingChatbot;
