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

    // ✅ Check API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        reply: "AI not configured"
      });
    }

    // ✅ Read request safely
    const body = req.body || {};
    const message =
      typeof body.message === "string" ? body.message : "hi";

    const sensorData =
      typeof body.sensorData === "object" ? body.sensorData : {};

    const ph = sensorData.ph ?? "unknown";
    const tds = sensorData.tds ?? "unknown";

    // ✅ Smart fallback (if API fails)
    function getSmartReply() {
      if (ph !== "unknown") {
        if (ph > 7) return "Water pH is high. Try lowering it slowly.";
        if (ph < 5.5) return "Water pH is low. Try increasing it slightly.";
      }

      if (tds !== "unknown") {
        if (tds < 300) return "Nutrients are low. Plants may need feeding.";
        if (tds > 1200) return "Nutrients are too high. Dilute the solution.";
      }

      return "System looks stable. Plants should grow well.";
    }

    // ✅ System prompt
    const systemPrompt = `
You are VertiGrow AI.

Explain in very simple words for students.

Current system vitals:
- pH: ${ph}
- TDS: ${tds}

Rules:
- No wiring instructions
- No exact chemical quantities
- Give only safe, general advice
- Keep answers short and clear
`;

    // ✅ Call OpenAI (NO temperature!)
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

    // ❌ If API error → fallback
    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("OpenAI error:", errText);

      return res.status(200).json({
        reply: getSmartReply()
      });
    }

    const data = await aiRes.json();

    const reply =
      data?.output_text ||
      data?.output?.[0]?.content?.[0]?.text ||
      getSmartReply();

    // ✅ Send response
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("AI BACKEND ERROR:", err);

    // ❌ If crash → fallback
    return res.status(200).json({
      reply: "System running in safe mode. Plants look okay."
    });
  }
}
