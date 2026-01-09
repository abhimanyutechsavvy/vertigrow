let command = { action: "none" };

export default function handler(req, res) {
  if (req.method === "POST") {
    command = req.body;
    return res.json({ ok: true });
  }
  res.json(command);
}
