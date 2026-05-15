// routes/visionRoutes.js

import express from "express";
import upload from "../middleware/upload.js";
import { analyzeImageController } from "../controllers/visionController.js";

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  analyzeImageController
);

export default router;