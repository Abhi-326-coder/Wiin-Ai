// controllers/imageController.js

import Image from "../models/Image.js";
import { generateImage } from "../services/geminiImageService.js";
import cloudinary from "../config/cloudinary.js";

export const generateImageController = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const generated = await generateImage(prompt);

    // Convert base64 → Data URI
    const base64Image = `data:${generated.mimeType};base64,${generated.data}`;

    // Upload to Cloudinary
    const uploaded = await cloudinary.uploader.upload(base64Image, {
      folder: "ai-images",
    });

    // Save in MongoDB
    const imageDoc = await Image.create({
      userId: req.user.id,
      prompt,
      imageUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
    });

    res.status(200).json({
      success: true,
      image: imageDoc,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Image generation failed",
    });
  }
};