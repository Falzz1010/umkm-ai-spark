
import { supabase } from '@/integrations/supabase/client';
import { BusinessContext } from '@/types/gemini';

export const callGeminiAI = async (businessContext: BusinessContext) => {
  try {
    const geminiResponse = await supabase.functions.invoke('gemini-ai', {
      body: {
        prompt: `Analisis data bisnis UMKM dan berikan 3-4 insight strategis yang actionable`,
        type: 'business_insights',
        businessData: businessContext
      }
    });

    if (geminiResponse.data?.success) {
      return geminiResponse.data.generatedText;
    } else {
      console.error('Gemini insights error:', geminiResponse.error);
      return null;
    }
  } catch (error) {
    console.error('Error calling Gemini AI:', error);
    return null;
  }
};
