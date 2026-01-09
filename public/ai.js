export const config = {
  runtime: "nodejs"
};

export default function handler(req, res) {
  try {
    // ALLOW GET ONLY (downloads are GET)
    if (req.method !== "GET") {
      res.statusCode = 405;
      return res.end("Method Not Allowed");
    }

    const XLSX = require("xlsx");

    const history = globalThis.__VERTIGROW_HISTORY__ || [];

    if (history.length === 0) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      return res.end("No data available");
    }

    // Create Excel
    const worksheet = XLSX.utils.json_to_sheet(history);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "VertiGrow Report");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx"
    });

    // Send file
    res.statusCode = 200;
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=vertigrow_report.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Length", buffer.length);

    return res.end(buffer);

  } catch (err) {
    console.error("EXPORT ERROR:", err);
    res.statusCode = 500;
    return res.end("Excel export failed");
  }
}
