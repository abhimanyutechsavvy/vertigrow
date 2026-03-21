// /api/ai.js
export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  try {
    // Only POST
    if (req.method !== "POST") {
      return res.status(200).json({ reply: "Use POST" });
    }

    // API key check
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        reply: "OPENAI KEY MISSING"
      });
    }

    // Safe body parsing
    const body = req.body || {};
    const message =
      typeof body.message === "string" ? body.message : "hi";

    const sensorData =
      typeof body.sensorData === "object" ? body.sensorData : {};

    // System prompt
    const systemPrompt = `
You are VertiGrow AI.
Explain in very simple words.

Current system vitals:
- pH: ${sensorData.ph ?? "unknown"}
- TDS: ${sensorData.tds ?? "unknown"}

Rules:
- No wiring instructions
- No exact chemical quantities
- Give only safe, general advice
`;

    // Timeout protection (5s)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const aiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        temperature: 0.4,
        input: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    clearTimeout(timeout);

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("OpenAI error:", errText);

      return res.status(200).json({
        reply: "AI service error"
      });
    }

    const data = await aiRes.json();

    const reply =
      data?.output_text ||
      data?.output?.[0]?.content?.[0]?.text ||
      "No reply from AI";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("AI BACKEND ERROR:", err);

    return res.status(200).json({
      reply: "AI backend error"
    });
  }
}
