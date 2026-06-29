import { GoogleGenAI } from "@google/genai";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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

    console.log("Step 4: Calling Gemini");

    const response = await ai.models.generateContent({
      
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `
You are an AI civic issue detector.

Analyze this image.

Return ONLY valid JSON.

{
  "issueType":"",
  "severity":"",
  "description":""
}

Possible issueType values:
Pothole
Garbage
Water Leakage
Broken Street Light
Traffic Signal Damage
Fallen Tree
Other

Severity:
Low
Medium
High

Return only JSON.
          `,
        },
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: imageBuffer.toString("base64"),
          },
        },
      ],
    });
    let text = response.text;

text = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

console.log("Gemini Response:");
console.log(text);

fs.unlinkSync(req.file.path);

res.json({
  success: true,
  imageUrl: uploadResult.secure_url,
  result: JSON.parse(text),
});

console.log("Step 5: Response sent");
  } catch (error) {
    console.error("❌ ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};