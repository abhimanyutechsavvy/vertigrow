// /api/ai.js

export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  try {
    // ✅ Allow only POST
    if (req.method !== "POST") {
      return res.status(200).json({ reply: "Use POST" });
    }

    // ✅ DEBUG: check API key
    console.log("API KEY EXISTS:", !!process.env.OPENAI_API_KEY);

    // ❌ If no API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        reply: "AI NOT CONFIGURED"
      });
    }

    // ✅ Read request
    const body = req.body || {};
    const message =
      typeof body.message === "string" ? body.message : "hi";

    const sensorData =
      typeof body.sensorData === "object" ? body.sensorData : {};

    const ph = sensorData.ph ?? "unknown";
    const tds = sensorData.tds ?? "unknown";

    // ✅ System prompt
    const systemPrompt = `
You are VertiGrow AI.

Explain in very simple words.

Current system vitals:
- pH: ${ph}
- TDS: ${tds}

Rules:
- No wiring instructions
- No exact chemical quantities
- Keep answers short
`;

    // ✅ OpenAI call
    const aiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: `${systemPrompt}\nUser: ${message}`
      })
    });

    // ✅ DEBUG: status
    console.log("OPENAI STATUS:", aiRes.status);

    // ❌ If error
    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("OPENAI ERROR:", errText);

      return res.status(200).json({
        reply: "AI FAILED"
      });
    }

    const data = await aiRes.json();

    console.log("FULL RESPONSE:", JSON.stringify(data));

    const reply =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "No reply";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("BACKEND ERROR:", err);

    return res.status(200).json({
      reply: "SERVER ERROR"
    });
  }
}
