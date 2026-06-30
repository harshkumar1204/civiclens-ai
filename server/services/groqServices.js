import groq from "../config/groq.js";

export async function analyzeWithGroq(base64Image, mimeType) {
  const response = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",

    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
You are an AI civic issue detector.

Analyze this image.

Return ONLY valid JSON.

{
  "issueType":"",
  "severity":"",
  "description":""
}

Possible issue types:
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
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ],
      },
    ],
  });

  let text = response.choices[0].message.content;
  console.log("========== GROQ RESPONSE ==========");
console.log(text);
console.log("==================================");

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
  return JSON.parse(text);
} catch (err) {
  console.error("Groq returned invalid JSON:");
  console.log(text);
  throw new Error("Groq returned invalid JSON");
}
}