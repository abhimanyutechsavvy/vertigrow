let data = { ph: 0, tds: 0 };

export default function handler(req, res) {
  if (req.method === "POST") {
    data = req.body;
    return res.json({ ok: true });
  }
  res.json(data);
}

