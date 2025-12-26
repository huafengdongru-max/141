import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "./constants";
import { SuggestedCaption } from "./types";

/**
 * Generates magic meme captions using Gemini 3 Flash.
 * @param base64Image The base64 encoded image data.
 * @param isKidMode Whether to prioritize educational/phonics captions.
 */
export const generateMagicCaptions = async (base64Image: string, isKidMode: boolean): Promise<SuggestedCaption[]> => {
  // Always initialize with apiKey from process.env
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.includes(',') ? base64Image.split(',')[1] : base64Image
            }
          },
          {
            text: `Mode: ${isKidMode ? 'KID_MODE (Phonics/CVC)' : 'SOCIAL_MEDIA (Witty/Trending)'}. Please analyze the image and generate 5 sets of captions in JSON format.`
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              top: { 
                type: Type.STRING, 
                description: "Short, catchy phrase for the top of the meme" 
              },
              bottom: { 
                type: Type.STRING, 
                description: "The main punchline or educational focus for the bottom" 
              }
            },
            required: ["top", "bottom"]
          }
        }
      }
    });

    // Access .text property directly
    const text = response.text;
    if (!text) return [];

    // Parse JSON response. responseMimeType: "application/json" ensures it's valid JSON.
    try {
      return JSON.parse(text) as SuggestedCaption[];
    } catch (parseError) {
      console.error("Failed to parse AI JSON response:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Gemini Magic Error:", error);
    throw error;
  }
};
