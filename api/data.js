globalThis.__VERTIGROW_HISTORY__ =
  globalThis.__VERTIGROW_HISTORY__ || [];

export default function handler(req, res) {
  if (req.method === "POST") {
    globalThis.__VERTIGROW_HISTORY__.push({
      ph: Number(req.body.ph) || 0,
      tds: Number(req.body.tds) || 0,
      time: new Date().toISOString()
    });

    if (globalThis.__VERTIGROW_HISTORY__.length > 500) {
      globalThis.__VERTIGROW_HISTORY__.shift();
    }

    return res.json({ ok: true });
  }

  const h = globalThis.__VERTIGROW_HISTORY__;
  if (!h.length) return res.json({ ph: 0, tds: 0 });

  return res.json(h[h.length - 1]);
}
