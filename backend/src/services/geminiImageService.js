// services/geminiImageService.js

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateImage = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    // Extract image
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return {
          mimeType: part.inlineData.mimeType,
          data: part.inlineData.data,
        };
      }
    }

    throw new Error("No image generated");

  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};