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
    },

    imageUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      default: "gemini-image",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Image", imageSchema);