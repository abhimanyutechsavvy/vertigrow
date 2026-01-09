// FORCE NODE RUNTIME (CRITICAL FOR OPENAI)
export const config = {
  runtime: "nodejs"
};

import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    // Allow only POST
    if (req.method !== "POST") {
      return res.status(200).json({
        reply: "Use POST method"
      });
    }

    // Check OpenAI key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        reply: "OpenAI API key missing on server"
      });
    }

    // Read request body safely
    const body = req.body || {};
    const message = body.message || "hi";
    const sensorData = body.sensorData || {};

    // Init OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are VertiGrow AI.
Explain everything in very simple language.

Current system vitals:
- pH: ${sensorData.ph ?? "unknown"}
- TDS: ${sensorData.tds ?? "unknown"}

If values are bad, suggest what to do.
          `
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    // Extract reply safely
    const reply =
      completion &&
      completion.choices &&
      completion.choices[0] &&
      completion.choices[0].message &&
      completion.choices[0].message.content
        ? completion.choices[0].message.content
        : "AI responded but no text was returned.";

    // Send response
    return res.status(200).json({ reply });

  } catch (error) {
    console.error("AI FUNCTION ERROR:", error);

    return res.status(500).json({
      reply: "AI crashed internally. Check Vercel logs."
    });
  }
}
