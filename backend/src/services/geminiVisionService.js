// services/geminiVisionService.js

import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const analyzeImage = async (imagePath, prompt) => {
  try {
    // Read image file
    const imageBuffer = fs.readFileSync(imagePath);

    // Convert to base64
    const base64Image = imageBuffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",

      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt || "Describe this image in detail",
            },
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    return response.text;

  } catch (error) {
    console.error(error);
    throw error;
  }
};