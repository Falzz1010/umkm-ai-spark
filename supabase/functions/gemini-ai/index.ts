
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
        systemPrompt = `Analisis data UMKM berikut dan berikan 3 insight singkat:

Data: Produk ${businessData?.totalProducts || 0}, Stok ${businessData?.totalStock || 0}, Revenue Rp${(businessData?.weeklyRevenue || 0).toLocaleString()}, Transaksi ${businessData?.weeklyTransactions || 0}/minggu

Format jawaban:
1. [Judul] - [1-2 kalimat saran spesifik]
2. [Judul] - [1-2 kalimat saran spesifik] 
3. [Judul] - [1-2 kalimat saran spesifik]

Fokus: stok, penjualan, dan pertumbuhan. Bahasa sederhana.`;
        break;
      case 'description':
        systemPrompt = `Buat deskripsi produk singkat untuk: ${productData?.name || 'produk'}. Kategori: ${productData?.category || 'umum'}. Maksimal 100 kata, fokus manfaat dan kualitas.`;
        break;
      case 'promotion':
        systemPrompt = `Buat caption Instagram singkat untuk: ${productData?.name || 'produk'}. Sertakan emoji dan hashtag. Maksimal 150 kata.`;
        break;
      case 'pricing':
        systemPrompt = `Saran harga jual untuk: ${productData?.name || 'produk'} dengan modal Rp ${productData?.cost || 0}. Berikan 2-3 opsi harga dengan alasan singkat.`;
        break;
      case 'campaign':
        systemPrompt = `Strategi promosi 7 hari untuk: ${productData?.name || 'produk'}. Format: Hari - Aktivitas - Platform. Singkat dan praktis.`;
        break;
      case 'schedule':
        systemPrompt = `Jadwal posting 7 hari untuk: ${productData?.name || 'produk'}. Format: Hari - Konten - Waktu. Variasi: promo, tips, testimoni.`;
        break;
      default:
        systemPrompt = `Jawab singkat untuk UMKM: ${prompt}`;
    }

    const fullPrompt = `${systemPrompt}\n\nPertanyaan: ${prompt || 'Berikan analisis singkat'}`;
    console.log('Full prompt:', fullPrompt);

    const geminiBody = {
      contents: [{
        parts: [{ text: fullPrompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512,
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
