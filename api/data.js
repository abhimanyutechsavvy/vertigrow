// GLOBAL STORAGE (safe for Vercel serverless)
globalThis.__VERTIGROW_HISTORY__ =
  globalThis.__VERTIGROW_HISTORY__ || [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const entry = {
      ph: req.body.ph,
      tds: req.body.tds,
      time: new Date().toISOString()
    };

    globalThis.__VERTIGROW_HISTORY__.push(entry);

    // keep last 500 records
    if (globalThis.__VERTIGROW_HISTORY__.length > 500) {
      globalThis.__VERTIGROW_HISTORY__.shift();
    }

    return res.json({ ok: true });
  }

  // GET → latest reading
  const history = globalThis.__VERTIGROW_HISTORY__;

  if (!history || history.length === 0) {
    return res.json({ ph: 0, tds: 0 });
  }

  return res.json(history[history.length - 1]);
}
