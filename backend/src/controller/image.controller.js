// models/Image.js

import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    prompt: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      default: null,
    },

    imageBase64: {
      type: String,
      default: null,
    },

    mimeType: {
      type: String,
      default: "image/png",
    },

    model: {
      type: String,
      default: "gemini-2.0-flash-preview-image-generation",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Image", imageSchema);