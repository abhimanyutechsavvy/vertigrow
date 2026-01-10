// /api/data.js
// Stores latest reading + history (Excel-safe)

globalThis.__VERTIGROW_DATA__ =
  globalThis.__VERTIGROW_DATA__ || {
    latest: { ph: 0, tds: 0 },
    history: []
  };

export default function handler(req, res) {

  // ===== ARDUINO SENDS DATA =====
  if (req.method === "POST") {
    const ph = Number(req.body.ph);
    const tds = Number(req.body.tds);

    // store latest
    globalThis.__VERTIGROW_DATA__.latest = {
      ph,
      tds,
      time: new Date().toISOString()
    };

    // store history
    globalThis.__VERTIGROW_DATA__.history.push(
      globalThis.__VERTIGROW_DATA__.latest
    );

    // limit history
    if (globalThis.__VERTIGROW_DATA__.history.length > 500) {
      globalThis.__VERTIGROW_DATA__.history.shift();
    }

    return res.status(200).json({ ok: true });
  }

  // ===== DASHBOARD READS DATA =====
  if (req.method === "GET") {
    return res.status(200).json(
      globalThis.__VERTIGROW_DATA__.latest
    );
  }

  return res.status(405).end();
}
