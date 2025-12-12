import { GoogleGenAI, Type } from "@google/genai";
import { SleepEntry, AnalysisResult, Language } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeSleepData = async (entries: SleepEntry[], language: Language): Promise<AnalysisResult> => {
  const ai = getAiClient();
  
  // Prepare data for the model
  const recentEntries = entries.slice(-7); // Analyze last week
  const dataSummary = JSON.stringify(recentEntries.map(e => ({
    date: e.date,
    duration: (new Date(e.wakeTime).getTime() - new Date(e.bedTime).getTime()) / (1000 * 60 * 60),
    quality: e.quality,
    notes: e.notes
  })));

  const prompt = `
    Analyze the following sleep data JSON. The user wants insights on their sleep health.
    Language: ${language === 'en' ? 'English' : 'Arabic'}.
    
    Data:
    ${dataSummary}
    
    Provide:
    1. A short summary of their week.
    2. 3 actionable recommendations to improve sleep.
    3. An overall sleep health score from 1-100 based on consistency and duration.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            score: { type: Type.NUMBER }
          },
          required: ["summary", "recommendations", "score"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      summary: result.summary || "No summary available.",
      recommendations: result.recommendations || [],
      score: result.score || 0
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      summary: language === 'en' ? "Could not analyze data at this time." : "تعذر تحليل البيانات في الوقت الحالي.",
      recommendations: [],
      score: 0
    };
  }
};
