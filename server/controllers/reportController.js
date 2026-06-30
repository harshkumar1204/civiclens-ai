import { analyzeWithGemini } from "../services/geminiService.js";
import { analyzeWithGroq } from "../services/groqService.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
console.log("API Key exists:", !!process.env.GEMINI_API_KEY);
console.log("API Key prefix:", process.env.GEMINI_API_KEY?.substring(0, 5));


export const analyzeImage = async (req, res) => {
  console.log("✅ Analyze API called");

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    console.log("Step 1: Uploading to Cloudinary...");

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "civiclens-ai",
    });

    console.log("✅ Cloudinary Upload Complete");

    const imageBuffer = fs.readFileSync(req.file.path);

    let result;

    try {
      console.log("🤖 Trying Gemini...");

      result = await analyzeWithGemini(
        imageBuffer.toString("base64"),
        req.file.mimetype
      );

      console.log("✅ Gemini Success");
    } catch (geminiError) {
  console.error("❌ Gemini Failed:", geminiError.message);

  console.log("🤖 Trying Groq...");

  try {
    result = await analyzeWithGroq(
      imageBuffer.toString("base64"),
      req.file.mimetype
    );

    console.log("✅ Groq Success");
  } catch (groqError) {
    console.error("❌ Groq Failed:", groqError.message);

    throw new Error("Both Gemini and Groq are unavailable.");
  }
}

    fs.unlinkSync(req.file.path);

    return res.json({
      success: true,
      imageUrl: uploadResult.secure_url,
      result,
    });

  } catch (error) {
    console.error("❌ Backend Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};