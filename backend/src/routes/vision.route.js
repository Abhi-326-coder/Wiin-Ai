// routes/visionRoutes.js

import express from "express";
import upload from "../utils/upload.js";
import { analyzeImageController } from "../controller/vision.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    route: "/api/vision",
    methods: {
      "POST /api/vision": {
        contentType: "multipart/form-data",
        fields: {
          image: "required file field",
          prompt: "optional text field",
        },
      },
    },
  });
});

router.post(
  "/",
  upload.single("image"),
  analyzeImageController
);

router.post(
  "/analyze",
  upload.single("image"),
  analyzeImageController
);

export default router;
