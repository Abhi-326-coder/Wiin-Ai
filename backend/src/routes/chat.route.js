import express from "express";
import { protectRoute } from "../utils/protectRoute.js";
import { sendMessage } from "../controller/chat.controller.js";
const router = express.Router();

router.post('/', protectRoute, sendMessage);

export default router;