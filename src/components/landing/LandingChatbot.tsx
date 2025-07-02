
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Bot, SendHorizontal, Loader2, X, Sparkles } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  sender: "user" | "ai";
  content: string;
}

export function LandingChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      content: "Hai! 👋 Saya AI Assistant untuk UMKM. Tanyakan apapun tentang bisnis, produk, atau strategi pemasaran Anda!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const newMessages: ChatMessage[] = [
      ...messages,
      { sender: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Call Gemini AI function
      const response = await supabase.functions.invoke('gemini-ai', {
        body: {
          prompt: userMessage,
          type: 'general_chat',
          businessData: null
        }
      });

      if (response.data?.success && response.data?.generatedText) {
        setMessages(prev => [
          ...prev,
          { sender: "ai", content: response.data.generatedText }
        ]);
      } else {
        console.error('Gemini AI error:', response.error);
        setMessages(prev => [
          ...prev,
          { sender: "ai", content: "Maaf, saya mengalami gangguan sementara. Silakan coba lagi dalam beberapa saat." }
        ]);
      }
    } catch (error) {
      console.error('Error calling Gemini AI:', error);
      setMessages(prev => [
        ...prev,
        { sender: "ai", content: "Terjadi kesalahan dalam menghubungi AI. Silakan coba lagi nanti." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="secondary"
        size="icon"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-full shadow-lg z-40 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105 transition-all duration-200"
        aria-label="Buka AI Chatbot"
        style={{ boxShadow: "0 4px 20px 0 rgba(59, 130, 246, 0.3)" }}
      >
        <div className="relative">
          <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
        </div>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg w-full p-0 overflow-hidden h-[90vh] sm:h-auto max-h-[85vh] sm:max-h-[600px] fixed bottom-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:translate-x-[-50%] sm:translate-y-[-50%] translate-x-0 translate-y-0 rounded-t-lg sm:rounded-lg">
          <Card className="bg-background/95 border-0 shadow-xl h-full flex flex-col">
            <CardHeader className="pb-2 px-3 sm:px-6 flex-shrink-0 border-b">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </span>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg truncate">AI Assistant UMKM</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs hidden sm:inline-flex">Powered by Gemini</Badge>
                <DialogClose asChild>
                  <button
                    className="p-1.5 sm:p-2 rounded hover:bg-accent focus:outline-none transition"
                    aria-label="Tutup Chatbot"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </DialogClose>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Dapatkan bantuan AI untuk mengembangkan bisnis UMKM Anda
              </p>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col min-h-0 px-3 sm:px-6 pt-4">
              <div 
                className="flex-1 overflow-y-auto rounded-md border bg-muted/20 p-3 sm:p-4 space-y-3 sm:space-y-4 transition-colors scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                style={{ scrollbarWidth: "thin" }}
              >
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl max-w-[85%] sm:max-w-[80%] text-sm sm:text-base ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-muted text-foreground"
                      } ${msg.sender === "ai" ? "rounded-bl-sm" : "rounded-br-sm"} shadow-sm`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground px-3 py-2 sm:px-4 sm:py-3 rounded-xl rounded-bl-sm shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">AI sedang berpikir...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="mt-4 flex gap-2 flex-shrink-0 pb-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanyakan tentang bisnis UMKM..."
                  disabled={loading}
                  className="flex-1 bg-background rounded-full px-4 py-3 border border-border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                  autoFocus={open}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={loading || !input.trim()}
                  className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  aria-label="Kirim"
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <SendHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
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
