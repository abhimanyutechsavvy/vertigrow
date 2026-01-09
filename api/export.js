export const config = {
  runtime: "nodejs"
};

export default function handler(req, res) {
  try {
    // Load XLSX safely (Node only)
    const XLSX = require("xlsx");

    // Read global history
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

    // IMPORTANT: set headers BEFORE ending
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

    // Send binary correctly
    return res.end(buffer);

  } catch (err) {
    console.error("EXPORT ERROR:", err);
    res.statusCode = 500;
    return res.end("Excel export failed");
  }
}
