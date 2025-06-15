
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Apa itu AI UMKM?",
    answer: "AI UMKM adalah platform berbasis kecerdasan buatan yang membantu UMKM meningkatkan bisnis dengan otomatisasi konten, manajemen produk, dan insight analytics."
  },
  {
    question: "Bagaimana cara mulai menggunakan platform ini?",
    answer: "Anda cukup klik 'Mulai Gratis Sekarang' di landing page dan lakukan pendaftaran tanpa kartu kredit untuk mendapatkan uji coba gratis."
  },
  {
    question: "Apakah data saya aman di AI UMKM?",
    answer: "Tentu! Keamanan dan privasi data adalah prioritas kami. Semua data dienkripsi dan hanya Anda yang bisa mengaksesnya."
  },
  {
    question: "Apa keunggulan utama platform ini dibanding aplikasi lain?",
    answer: "Fitur AI assistant, dashboard analytics real-time, dan kemudahan manajemen produk di satu tempat memudahkan UMKM berkembang secara digital."
  }
];

export function LandingFAQ() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="py-20 bg-background"
    >
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Badge variant="secondary" className="mb-3">❓ ASK / FAQ</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <p className="text-lg text-muted-foreground">
            Temukan jawaban atas pertanyaan umum mengenai platform AI UMKM!
          </p>
        </motion.div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 + idx * 0.08 }}
            >
              <AccordionItem value={`faq-${idx}`} className="mb-2 border-muted">
                <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-md text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </motion.section>
  );
}

