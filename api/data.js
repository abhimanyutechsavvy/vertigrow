// /api/data.js
// Stores latest data in request lifecycle-safe way

let latest = { ph: 0, tds: 0, time: null };

export default function handler(req, res) {
  if (req.method === "POST") {
    latest = {
      ph: Number(req.body.ph),
      tds: Number(req.body.tds),
      time: new Date().toISOString()
    };
    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    return res.status(200).json(latest);
  }

  return res.status(405).end();
}
