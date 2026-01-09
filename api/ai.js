import OpenAI from "openai";

export default async function handler(req, res) {
  // Always respond, no silent exits
  try {
    console.log("AI endpoint hit");

    if (req.method !== "POST") {
      return res.status(200).json({ reply: "Use POST method" });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.log("Missing API key");
      return res.status(200).json({
        reply: "Server missing OpenAI key"
      });
    }

    const body = req.body || {};
    console.log("Request body:", body);

    const message = body.message || "hi";
    const sensorData = body.sensorData || body.sensor || {};

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are VertiGrow AI.
pH=${sensorData.ph ?? "unknown"}
TDS=${sensorData.tds ?? "unknown"}`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "AI responded but no text.";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("AI ERROR FULL:", err);
    return res.status(200).json({
      reply: "AI error occurred, check backend logs"
    });
  }
}
