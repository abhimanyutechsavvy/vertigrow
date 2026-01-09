export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(200).json({ error: "Use POST" });
      return;
    }

    const XLSX = require("xlsx");

    const body = req.body || {};
    const history = body.history || [];

    if (!Array.isArray(history) || history.length === 0) {
      res.status(200).json({ error: "NO_DATA" });
      return;
    }

    // Create Excel
    const worksheet = XLSX.utils.json_to_sheet(history);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "VertiGrow Report");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx"
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=vertigrow_report.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.status(200).end(buffer);

  } catch (err) {
    console.error("EXPORT ERROR:", err);
    res.status(500).json({ error: "EXPORT_FAILED" });
  }
}
