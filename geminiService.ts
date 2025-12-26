
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "./constants";
import { SuggestedCaption } from "./types";

export const generateMagicCaptions = async (base64Image: string, isKidMode: boolean): Promise<SuggestedCaption[]> => {
  // 直接从 process.env 获取，无需额外配置，Netlify 会自动注入
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(',')[1] || base64Image
              }
            },
            {
              text: `Mode: ${isKidMode ? 'KID_PHONICS' : 'WITY_MEME'}. Analyze image and give 5 caption pairs.`
            }
          ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              top: { type: Type.STRING },
              bottom: { type: Type.STRING }
            },
            required: ["top", "bottom"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]") as SuggestedCaption[];
  } catch (error) {
    console.error("AI Error:", error);
    throw error;
  }
};
