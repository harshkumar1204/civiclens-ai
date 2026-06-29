import express from "express";
import multer from "multer";
import { analyzeImage } from "../controllers/reportController.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/analyze-image", upload.single("image"), analyzeImage);

export default router;