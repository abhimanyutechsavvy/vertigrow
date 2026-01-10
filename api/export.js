import XLSX from "xlsx";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Use GET" });
  }

  try {
    const history = globalThis.__VERTIGROW_HISTORY__ || [];

    if (!history.length) {
      return res.status(200).send("No data available");
    }

    const worksheet = XLSX.utils.json_to_sheet(history);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "VertiGrow");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx"
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=vertigrow_report.xlsx"
    );

    res.status(200).send(buffer);
  } catch (err) {
    console.error("EXCEL ERROR:", err);
    res.status(500).send("Excel export failed");
  }
}
