export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  try {
    // Allow POST only
    if (req.method !== "POST") {
      return res.status(200).json({ reply: "Use POST method" });
    }

    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        reply: "OPENAI KEY NOT FOUND"
      });
    }

    const body = req.body || {};
    const message = body.message || "hi";
    const sensorData = body.sensorData || {};

    // Build prompt
    const systemPrompt = `
You are VertiGrow AI, a beginner-friendly hydroponics assistant.

Current sensor vitals:
pH: ${sensorData.ph ?? "unknown"}
TDS: ${sensorData.tds ?? "unknown"}

Explain things simply. Do not give electrical wiring or chemical quantities.
`;

    // Call OpenAI using fetch (NO SDK)
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.4
      })
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("OpenAI API error:", errText);
      return res.status(200).json({
        reply: "OpenAI API error"
      });
    }

    const aiData = await aiResponse.json();
    const reply =
      aiData?.choices?.[0]?.message?.content ||
      "AI responded but no text.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("AI FUNCTION ERROR:", error);
    return res.status(200).json({
      reply: "AI backend error"
    });
  }
}
