// /api/data.js
// THIS FILE MUST NOT RETURN "reply"

let lastData = {
  ph: 0,
  tds: 0
};

export default function handler(req, res) {

  // Arduino sends data here
  if (req.method === "POST") {
    lastData = {
      ph: Number(req.body.ph) || 0,
      tds: Number(req.body.tds) || 0
    };

    return res.status(200).json({ ok: true });
  }

  // Website reads data here
  if (req.method === "GET") {
    return res.status(200).json(lastData);
  }

  // Anything else
  return res.status(405).end("Method Not Allowed");
}
