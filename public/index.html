let history = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const entry = {
      ph: req.body.ph,
      tds: req.body.tds,
      time: new Date().toISOString()
    };

    history.push(entry);

    // keep last 500 records
    if (history.length > 500) history.shift();

    return res.json({ ok: true });
  }

  // GET → return latest reading
  if (history.length === 0) {
    return res.json({ ph: 0, tds: 0 });
  }

  return res.json(history[history.length - 1]);
}

// used by export.js
export function getHistory() {
  return history;
}
