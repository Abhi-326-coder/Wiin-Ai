// controllers/imageController.js

import Image from "../models/image.model.js";
import { generateImage } from "../services/geminiImageService.js";
import cloudinary from "../config/cloudinary.js";

export const generateImageController = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!prompt?.trim()) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const trimmedPrompt = prompt.trim();
    const generated = await generateImage(trimmedPrompt);
    const base64Image = `data:${generated.mimeType};base64,${generated.data}`;

    const uploaded = await cloudinary.uploader.upload(base64Image, {
      folder: "ai-images",
      resource_type: "image",
    });

    const imageDoc = await Image.create({
      userId,
      prompt: trimmedPrompt,
      imageUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
    });

    res.status(200).json({
      success: true,
      image: imageDoc,
    });
  } catch (error) {
    console.error(error);

    const status = error.status >= 400 && error.status < 500 ? error.status : 500;

    res.status(status).json({
      error: "Image generation failed",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
