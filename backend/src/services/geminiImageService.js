// services/geminiImageService.js

import { GoogleGenAI } from "@google/genai";

export const generateImage = async (prompt) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_IMAGE_MODEL || "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: ["IMAGE"],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData?.data
    );

    if (imagePart?.inlineData?.data) {
      return {
        mimeType: imagePart.inlineData.mimeType || "image/png",
        data: imagePart.inlineData.data,
      };
    }

    throw new Error("No image generated");
  } catch (error) {
    throw error;
  }
};
