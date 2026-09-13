import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: 'What is the current tomato price in Delhi NCR?',
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          basePrice: { type: Type.NUMBER },
          sources: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  console.log(response.text);
}
run().catch(console.error);
