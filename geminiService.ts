import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "./constants";
import { SuggestedCaption } from "./types";

export const generateMagicCaptions = async (base64Image: string, isKidMode: boolean): Promise<SuggestedCaption[]> => {
  // 必须确保 API_KEY 已在 Netlify 环境变量中设置
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
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
                data: base64Image.includes(',') ? base64Image.split(',')[1] : base64Image
              }
            },
            {
              text: `当前模式: ${isKidMode ? '儿童拼读学习 (CVC 单词)' : '幽默创意梗图'}。请分析图片并生成 5 组 JSON 格式的配文。`
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
              top: { type: Type.STRING, description: "顶部短语" },
              bottom: { type: Type.STRING, description: "底部核心笑点" }
            },
            required: ["top", "bottom"]
          }
        }
      }
    });

    const text = response.text;
    return JSON.parse(text || "[]") as SuggestedCaption[];
  } catch (error) {
    console.error("Gemini 魔法施法失败:", error);
    throw error;
  }
};
