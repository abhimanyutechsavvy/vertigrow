// FORCE NODE RUNTIME (REQUIRED FOR OPENAI)
export const config = {
  runtime: "nodejs"
};

import OpenAI from "openai";

// ───────────────── RATE LIMITING (simple in-memory) ─────────────────
const RATE_LIMIT_WINDOW = 10_000; // 10 seconds
const MAX_REQUESTS = 5;
const clients = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const record = clients.get(ip) || { count: 0, start: now };

  if (now - record.start > RATE_LIMIT_WINDOW) {
    record.count = 1;
    record.start = now;
  } else {
    record.count += 1;
  }

  clients.set(ip, record);
  return record.count > MAX_REQUESTS;
}

// ───────────────── MAIN HANDLER ─────────────────
export default async function handler(req, res) {
  try {
    // Allow only POST
    if (req.method !== "POST") {
      return res.status(200).json({ reply: "Use POST method" });
    }

    // Rate limit
    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "unknown";

    if (isRateLimited(ip)) {
      return res.status(200).json({
        reply: "Too many requests. Please wait a few seconds."
      });
    }

    // Check OpenAI key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        reply: "OpenAI API key missing on server"
      });
    }

    // Read body safely
    const body = req.body || {};
    const message = body.message || "hi";
    const sensorData = body.sensorData || {};

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // System safety rules
    const systemPrompt = `
You are VertiGrow AI, a hydroponics assistant.

STRICT RULES:
- NEVER give electrical wiring instructions.
- NEVER give chemical quantities.
- NEVER say "turn on pump now".
- ONLY give advice and explanations.
- Explain in very simple language.
- Assume the user is a beginner.

Current vitals:
pH: ${sensorData.ph ?? "unknown"}
TDS: ${sensorData.tds ?? "unknown"}

If values are bad, explain what they mean and what generally helps.
`;

    // OpenAI call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "AI responded but no text was returned.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("AI FUNCTION ERROR:", error);
    return res.status(500).json({
      reply: "AI crashed internally. Please try again."
    });
  }
}
