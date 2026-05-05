import express from "express";
import { protectRoute } from "../utils/protectRoute.js";
import { sendMessage, getUserChats, getChatMessages } from "../controller/chat.controller.js";

const router = express.Router();

router.post('/', protectRoute, sendMessage);
router.get('/', protectRoute, getUserChats);
router.get('/:chatId', protectRoute, getChatMessages);
export default router;