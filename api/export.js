export const config = {
  runtime: "nodejs"
};

export default function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).end();
    }

    const XLSX = require("xlsx");
    const history = globalThis.__VERTIGROW_HISTORY__ || [];

    if (!history.length) {
      return res.end();
    }

    const ws = XLSX.utils.json_to_sheet(history);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "VertiGrow");

    const buffer = XLSX.write(wb, {
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

    res.end(buffer);
  } catch {
    res.end();
  }
}
