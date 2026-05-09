// routes/imageRoutes.js

import express from "express";

import { generateImageController } from "../controller/image.controller.js";
import { protectRoute } from "../utils/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, generateImageController);

export default router;
