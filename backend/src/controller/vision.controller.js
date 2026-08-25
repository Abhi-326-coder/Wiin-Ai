// controllers/visionController.js

import fs from "fs";
import { analyzeImage } from "../services/geminiVisionService.js";

export const analyzeImageController = async (req, res) => {
  let file;

  try {
    file = req.file;
    const { prompt } = req.body ?? {};

    if (!file) {
      return res.status(400).json({
        error: "Image is required",
      });
    }

    const response = await analyzeImage(
      file.path,
      file.mimetype,
      prompt
    );

    res.status(200).json({
      success: true,
      response,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Image analysis failed",
    });
  } finally {
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};
