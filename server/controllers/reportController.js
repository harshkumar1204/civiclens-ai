import { analyzeWithGemini } from "../services/geminiService.js";
import { analyzeWithGroq } from "../services/groqService.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
console.log("API Key exists:", !!process.env.GEMINI_API_KEY);
console.log("API Key prefix:", process.env.GEMINI_API_KEY?.substring(0, 5));


export const analyzeImage = async (req, res) => {
  console.log("✅ Analyze API called");

  try {
    console.log("Step 1: Request received");

    if (!req.file) {
      console.log("❌ No file");

      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    console.log("Step 2: File received");

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "civiclens-ai",
    });

    console.log("Step 3: Cloudinary upload complete");

    const imageBuffer = fs.readFileSync(req.file.path);

    console.log("Step 4: Starting AI Analysis");

    let result;

try {
  console.log("🤖 Trying Gemini...");
  result = await analyzeWithGemini(
    imageBuffer.toString("base64"),
    req.file.mimetype
  );
  console.log("✅ Gemini Success");
} catch (error) {
  console.log("❌ Gemini Failed");
  console.log("Trying Groq...");

  result = await analyzeWithGroq(
    imageBuffer.toString("base64"),
    req.file.mimetype
  );

  console.log("✅ Groq Success");
}


fs.unlinkSync(req.file.path);

res.json({
  success: true,
  imageUrl: uploadResult.secure_url,
  result,
});

console.log("Step 5: Response sent");
  } catch (error) {
  console.error("❌ Gemini Error:", error.message);
  console.log("🤖 Trying Groq...");

  result = await analyzeWithGroq(
    imageBuffer.toString("base64"),
    req.file.mimetype
  );

  console.log("✅ Groq Success");
}