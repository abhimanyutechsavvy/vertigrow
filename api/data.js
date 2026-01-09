export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({ reply: "Use POST" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({ reply: "OPENAI KEY MISSING" });
    }

    const { message, sensorData } = req.body || {};
    const userMessage = message || "hi";

    const systemPrompt = `
You are VertiGrow AI.
Explain simply.

Current vitals:
pH: ${sensorData?.ph ?? "unknown"}
TDS: ${sensorData?.tds ?? "unknown"}
`;

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
            { role: "user", content: userMessage }
          ]
        })
      }
    );

    const data = await aiRes.json();
    const reply =
      data?.choices?.[0]?.message?.content || "No AI reply";

    return res.json({ reply });

  } catch (err) {
    console.error(err);
    return res.json({ reply: "AI error" });
  }
}
