import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeWithGemini(base64Image, mimeType) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
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
          mimeType: mimeType,
          data: base64Image,
        },
      },
    ],
  });

  let text = response.text;

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
  return JSON.parse(text);
} catch (err) {
  console.error("Gemini returned invalid JSON:");
  console.log(text);
  throw new Error("Gemini returned invalid JSON");
}
}