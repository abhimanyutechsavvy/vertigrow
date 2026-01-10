import XLSX from "xlsx";

export default function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).end();
    }

    const latest = globalThis.__VERTIGROW_LATEST__;

    if (!latest || !latest.time) {
      return res.status(200).send("No data available");
    }

    const worksheet = XLSX.utils.json_to_sheet([latest]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "VertiGrow");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer"
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=vertigrow_report.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.status(200).send(buffer);

  } catch (err) {
    console.error("EXCEL ERROR:", err);
    res.status(500).send("Excel export failed");
  }
}
