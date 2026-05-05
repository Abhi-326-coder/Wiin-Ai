// controllers/chatController.js
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { generateResponse } from "../services/geminiService.js";

const getErrorMessage = (err) => err?.message || "Something went wrong";

const sendChatError = (res, err) => {
  const details = err?.errorDetails;
  const message = getErrorMessage(err);
  const invalidKey =
    err?.status === 400 &&
    (message.includes("API key not valid") ||
      message.includes("API_KEY_INVALID") ||
      (Array.isArray(details) &&
        details.some((detail) => detail?.reason === "API_KEY_INVALID")));

  if (invalidKey) {
    return res.status(502).json({
      error:
        "Gemini rejected your API key. Create a key at https://aistudio.google.com/apikey, set GEMINI_API_KEY in backend/.env (no spaces), and restart the server.",
    });
  }

  if (message.includes("Missing GEMINI_API_KEY")) {
    return res.status(500).json({ error: message });
  }

  if (
    err?.name === "MongoServerSelectionError" ||
    message.includes("buffering timed out") ||
    message.includes("ECONNREFUSED")
  ) {
    return res.status(503).json({
      error:
        "Database is not connected. Check MONGODB_URI and restart the backend server.",
    });
  }

  if (err?.status === 429 || message.includes("quota")) {
    return res.status(429).json({
      error:
        "Gemini quota was exceeded for this API key. Check your Google AI Studio quota/billing or use another GEMINI_API_KEY.",
      details: process.env.NODE_ENV === "development" ? message : undefined,
    });
  }

  if (err?.status === 503 || message.includes("UNAVAILABLE")) {
    return res.status(503).json({
      error:
        "Gemini is temporarily unavailable or under high demand. Try again in a moment.",
      details: process.env.NODE_ENV === "development" ? message : undefined,
    });
  }

  if (err?.name === "CastError") {
    return res.status(400).json({ error: "Invalid chat id" });
  }

  if (
    err?.status >= 400 ||
    message.includes("not found") ||
    message.includes("Could not load the default credentials")
  ) {
    return res.status(502).json({
      error:
        "Gemini request failed. Check GEMINI_API_KEY and use a supported GEMINI_MODEL such as gemini-2.5-flash.",
      details: process.env.NODE_ENV === "development" ? message : undefined,
    });
  }

  return res.status(500).json({
    error: "Something went wrong",
    details: process.env.NODE_ENV === "development" ? message : undefined,
  });
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const userId = req.user._id; 

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    let chat;

    // Create new chat if not exists
    if (!chatId) {
      chat = await Chat.create({ userId, title: message.trim().slice(0, 40) });
    } else {
      chat = await Chat.findOne({ _id: chatId, userId });
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
    }

    // Save user message
    await Message.create({
      chatId: chat._id,
      role: "user",
      content: message.trim(),
    });

    // Get all messages for context
    const messages = await Message.find({ chatId: chat._id }).sort("createdAt");

    // Generate AI response
    const aiResponse = await generateResponse(messages);

    // Save AI message
    await Message.create({
      chatId: chat._id,
      role: "assistant",
      content: aiResponse,
    });

    res.json({
      chatId: chat._id,
      response: aiResponse,
    });

  } catch (err) {
    console.error(err);
    return sendChatError(res, err);
  }
};

// controllers/chatController.js
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const messages = await Message.find({ chatId }).sort("createdAt");

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
