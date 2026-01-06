let latestData = {
  ph: 0,
  tds: 0,
  waterPump: false,
  npkA: false,
  npkB: false,
  time: ""
};

export default function handler(req, res) {
  if (req.method === "POST") {
    const { ph, tds, waterPump, npkA, npkB } = req.body;

    latestData = {
      ph,
      tds,
      waterPump,
      npkA,
      npkB,
      time: new Date().toISOString()
    };

    return res.status(200).json({ status: "ok" });
  }

  if (req.method === "GET") {
    return res.status(200).json(latestData);
  }

  res.status(405).json({ error: "Method not allowed" });
}
