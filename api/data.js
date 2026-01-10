// /api/data.js
// FINAL: stores latest + history for Excel

globalThis.__VERTIGROW_STORE__ =
  globalThis.__VERTIGROW_STORE__ || {
    latest: null,
    history: []
  };

export default function handler(req, res) {

  // ===== ARDUINO SENDS DATA =====
  if (req.method === "POST") {
    const ph = Number(req.body.ph);
    const tds = Number(req.body.tds);

    const record = {
      ph,
      tds,
      time: new Date().toISOString()
    };

    // save latest
    globalThis.__VERTIGROW_STORE__.latest = record;

    // save history
    globalThis.__VERTIGROW_STORE__.history.push(record);

    // keep history size safe
    if (globalThis.__VERTIGROW_STORE__.history.length > 1000) {
      globalThis.__VERTIGROW_STORE__.history.shift();
    }

    return res.status(200).json({ ok: true });
  }

  // ===== DASHBOARD READS DATA =====
  if (req.method === "GET") {
    return res.status(200).json(
      globalThis.__VERTIGROW_STORE__.latest || { ph: 0, tds: 0 }
    );
  }

  return res.status(405).end();
}
