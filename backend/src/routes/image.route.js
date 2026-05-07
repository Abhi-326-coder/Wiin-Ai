// routes/imageRoutes.js

import express from "express";

import { generateImageController } from "../controllers/imageController.js";

const router = express.Router();

router.post("/", generateImageController);

export default router;