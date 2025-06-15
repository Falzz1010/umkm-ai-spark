
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Gemini AI function called');
    
    const { prompt, type, productData, businessData } = await req.json();
    console.log('Request data:', { prompt, type, productData, businessData });

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    console.log('API key exists:', !!apiKey);

    if (!apiKey) {
      console.error('GEMINI_API_KEY not found');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'GEMINI_API_KEY not configured' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let systemPrompt = '';
    switch (type) {
      case 'business_insights':
        systemPrompt = `Anda adalah AI Business Intelligence untuk UMKM Indonesia yang sangat berpengalaman. Analisis data bisnis berikut dan berikan 3-4 insight strategis yang actionable:

Data Bisnis:
- Total Produk: ${businessData?.totalProducts || 0}
- Produk Aktif: ${businessData?.activeProducts || 0}
- Total Stok: ${businessData?.totalStock || 0}
- Produk Stok Rendah: ${businessData?.lowStockProducts || 0}
- Revenue Mingguan: Rp${(businessData?.weeklyRevenue || 0).toLocaleString()}
- Revenue Bulanan: Rp${(businessData?.monthlyRevenue || 0).toLocaleString()}
- Transaksi Minggu ini: ${businessData?.weeklyTransactions || 0}
- Kategori: ${businessData?.categories?.join(', ') || 'N/A'}
- Produk Terlaris: ${businessData?.topSellingProducts?.map(p => `${p.name} (${p.quantity} terjual)`).join(', ') || 'N/A'}
- Range Harga: Rp${(businessData?.priceRanges?.min || 0).toLocaleString()} - Rp${(businessData?.priceRanges?.max || 0).toLocaleString()}

Berikan insight dalam format:
1. [Judul Insight] - [Penjelasan detail dengan angka spesifik dan rekomendasi actionable]
2. [Judul Insight] - [Penjelasan detail dengan angka spesifik dan rekomendasi actionable]
3. [Judul Insight] - [Penjelasan detail dengan angka spesifik dan rekomendasi actionable]

Fokus pada: prediksi trends, optimasi stok, strategi pricing, peluang growth, dan risk management. Gunakan bahasa Indonesia yang mudah dipahami UMKM.`;
        break;
      case 'description':
        systemPrompt = `Anda adalah AI assistant untuk UMKM Indonesia. Buatkan deskripsi produk yang menarik dan profesional untuk produk: ${productData?.name || 'produk'}. Kategori: ${productData?.category || 'umum'}. Harga modal: Rp ${productData?.cost || 0}. Fokus pada manfaat, kualitas, dan nilai jual. Maksimal 150 kata.`;
        break;
      case 'promotion':
        systemPrompt = `Buatkan caption promosi untuk social media (Instagram/Facebook) yang engaging untuk produk: ${productData?.name || 'produk'}. Sertakan emoji, hashtag yang relevan, dan call-to-action yang kuat. Gaya bahasa santai tapi profesional.`;
        break;
      case 'pricing':
        systemPrompt = `Analisis harga jual optimal untuk produk: ${productData?.name || 'produk'} dengan modal Rp ${productData?.cost || 0}. Berikan saran markup 30-70% sesuai kategori ${productData?.category || 'umum'}. Sertakan pertimbangan kompetitor dan positioning.`;
        break;
      case 'campaign':
        systemPrompt = `Buatkan strategi kampanye promosi lengkap untuk produk: ${productData?.name || 'produk'}. Sertakan: 1) Judul kampanye, 2) Target audiens, 3) Platform yang cocok, 4) Timeline 7 hari, 5) Content calendar, 6) CTA yang efektif.`;
        break;
      case 'schedule':
        systemPrompt = `Buatkan jadwal promosi 7 hari untuk UMKM dengan produk: ${productData?.name || 'produk'}. Format: Hari - Jenis konten - Platform - Waktu posting optimal. Variasi konten: diskon, testimoni, behind the scenes, tips, giveaway.`;
        break;
      default:
        systemPrompt = `Anda adalah AI assistant untuk UMKM Indonesia. Bantu dengan pertanyaan: ${prompt}`;
    }

    const fullPrompt = `${systemPrompt}\n\nPertanyaan: ${prompt || 'Tolong berikan analisis dan saran untuk data bisnis ini'}`;
    console.log('Full prompt:', fullPrompt);

    const geminiBody = {
      contents: [{
        parts: [{ text: fullPrompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    // Use the correct Gemini 2.0 Flash model with v1beta endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    console.log('Calling Gemini API (v1beta, gemini-2.0-flash)...');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiBody),
    });

    console.log('Gemini API response status:', response.status);
    const data = await response.json();
    console.log('Gemini API response data:', data);

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return new Response(JSON.stringify({ 
        success: false,
        error: `Gemini API error: ${data.error?.message || 'Unknown error'}`,
        details: data
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('Generated text:', generatedText);

    if (!generatedText) {
      console.error('No generated text found');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Tidak ada respons dari AI. Silakan coba lagi.',
        data: data
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Returning successful response');
    return new Response(JSON.stringify({ 
      success: true,
      generatedText,
      type 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: `Server error: ${error.message}`,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
