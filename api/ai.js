// /api/ai.js
// VertiGrow AI backend (POST only)

export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  try {
    // Allow POST only
    if (req.method !== "POST") {
      return res.status(200).json({ reply: "Use POST" });
    }

    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        reply: "OPENAI KEY MISSING"
      });
    }

    // Read body safely
    const body = req.body || {};
    const message = body.message || "hi";
    const sensorData = body.sensorData || {};

    // System prompt with vitals
    const systemPrompt = `
You are VertiGrow AI.
Explain in very simple words.

Current system vitals:
- pH: ${sensorData.ph ?? "unknown"}
- TDS: ${sensorData.tds ?? "unknown"}

Do not give wiring instructions.
Do not give exact chemical quantities.
Give only general advice.
`;

    // Call OpenAI (NO SDK, fetch only)
    const aiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.4,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ]
        })
      }
    );

    // Handle OpenAI error
    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("OpenAI error:", errText);
      return res.status(200).json({
        reply: "AI service error"
      });
    }

    // Parse response
    const data = await aiRes.json();
    const reply =
      data?.choices?.[0]?.message?.content ||
      "No reply from AI";

    // Send to frontend
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("AI BACKEND ERROR:", err);
    return res.status(200).json({
      reply: "AI backend error"
    });
  }
}
