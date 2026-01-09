import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message, sensor } = req.body;

  const prompt = `
You control a hydroponics system.

Sensor data:
pH: ${sensor.ph}
TDS: ${sensor.tds}

User says:
"${message}"

Choose ONLY ONE action:
- npkA_on
- npkA_off
- npkB_on
- npkB_off
- status
- none

Reply ONLY JSON:
{
  "action": "...",
  "reply": "short explanation"
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  });

  res.json(JSON.parse(completion.choices[0].message.content));
}
