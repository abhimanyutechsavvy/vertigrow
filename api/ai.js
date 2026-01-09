export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  try {
    // Allow only POST requests
    if (req.method !== "POST") {
      return res.status(200).json({
        reply: "Use POST method"
      });
    }

    // Check OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        reply: "OPENAI KEY NOT FOUND"
      });
    }

    // Read request body safely
    const body = req.body || {};
    const message = body.message || "hi";
    const sensorData = body.sensorData || {};

    // System prompt (safe, beginner friendly)
    const systemPrompt = `
You are VertiGrow AI, a beginner-friendly hydroponics assistant.

Current system vitals:
- pH: ${sensorData.ph ?? "unknown"}
- TDS: ${sensorData.tds ?? "unknown"}

Rules:
- Explain in simple words
- Do NOT give wiring instructions
- Do NOT give chemical quantities
- Only give general advice and explanations
`;

    // Call OpenAI using fetch (NO SDK)
    const aiResponse = await fetch(
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

    // Handle OpenAI API errors safely
    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("OpenAI API error:", errorText);

      return res.status(200).json({
        reply: "OpenAI API error"
      });
    }

    // Parse AI response
    const aiData = await aiResponse.json();
    const reply =
      aiData?.choices?.[0]?.message?.content ||
      "AI replied but no text was returned.";

    // Send reply to frontend
    return res.status(200).json({ reply });

  } catch (error) {
    console.error("AI BACKEND ERROR:", error);

    return res.status(200).json({
      reply: "AI backend error"
    });
  }
}
