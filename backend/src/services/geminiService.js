import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const GEMINI_MODELS = [
  process.env.GEMINI_MODEL || "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-flash-lite-latest",
].filter((model, index, models) => model && models.indexOf(model) === index);
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

const getGeminiClient = () => {
  // whole meaning of this function is 
  // const ai = new GoogleGenAI({ apiKey });
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    const error = new Error(
      "Missing GEMINI_API_KEY. Add it to backend/.env and restart the backend server."
    );
    error.status = 500;
    throw error;
  }

  return new GoogleGenAI({ apiKey });
};

const toGeminiRole = (role) => (role === "assistant" ? "model" : "user");

const buildGeminiContents = (messages) => {
  const contents = [];

  for (const msg of messages) {
    const text = msg?.content?.trim();
    if (!text) continue;

    const role = toGeminiRole(msg.role);
    const previous = contents[contents.length - 1];

    if (previous?.role === role) {
      previous.parts[0].text = `${previous.parts[0].text}\n\n${text}`;
      continue;
    }

    contents.push({
      role,
      parts: [{ text }],
    });
  }

  while (contents[0]?.role === "model") {
    contents.shift();
  }

  return contents;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableGeminiError = (error) =>
  RETRYABLE_STATUSES.has(error?.status) ||
  error?.message?.includes("UNAVAILABLE") ||
  error?.message?.includes("quota");

const generateWithFallback = async (ai, contents) => {
  let lastError;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        return await ai.models.generateContent({
          model,
          contents,
        });
      } catch (error) {
        lastError = error;
        error.model = model;

        if (!isRetryableGeminiError(error) || attempt === 2) {
          break;
        }

        await sleep(600 * attempt);
      }
    }
  }

  throw lastError;
};

export const generateResponse = async (messages) => {
  try {
    const ai = getGeminiClient();
    const contents = buildGeminiContents(messages);

    if (!contents.length) {
      throw new Error("Message content is required.");
    }

    const response = await generateWithFallback(ai, contents);

    const text = response.text?.trim();
    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
