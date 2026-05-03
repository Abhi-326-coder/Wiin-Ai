// services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateResponse = async (messages) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const formatted = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  const result = await model.generateContent({
    contents: formatted,
  });

  return result.response.text();
};