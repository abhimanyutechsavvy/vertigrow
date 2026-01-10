// /api/data.js
// FINAL: stores ONLY latest reading (serverless-safe)

globalThis.__VERTIGROW_LATEST__ =
  globalThis.__VERTIGROW_LATEST__ || { ph: 0, tds: 0, time: null };

export default function handler(req, res) {

  // Arduino sends data
  if (req.method === "POST") {
    globalThis.__VERTIGROW_LATEST__ = {
      ph: Number(req.body.ph),
      tds: Number(req.body.tds),
      time: new Date().toISOString()
    };

    return res.status(200).json({ ok: true });
  }

  // Dashboard reads data
  if (req.method === "GET") {
    return res.status(200).json(globalThis.__VERTIGROW_LATEST__);
  }

  return res.status(405).end();
}
