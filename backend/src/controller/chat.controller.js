// controllers/chatController.js
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { generateResponse } from "../services/geminiService.js";

export const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const userId = req.user.id; // from auth middleware

    let chat;

    // Create new chat if not exists
    if (!chatId) {
      chat = await Chat.create({ userId, title: message.slice(0, 20) });
    } else {
      chat = await Chat.findById(chatId);
    }

    // Save user message
    await Message.create({
      chatId: chat._id,
      role: "user",
      content: message,
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
    res.status(500).json({ error: "Something went wrong" });
  }
};