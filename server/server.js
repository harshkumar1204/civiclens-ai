import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { GoogleGenAI } from "@google/genai";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 CivicLens AI Backend Running",
  });
});

// Test Gemini
app.get("/test-gemini", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Reply with only: Gemini Connected Successfully",
    });

    res.json({
      success: true,
      response: response.text,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

// Report Routes
app.use("/", reportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});