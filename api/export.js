import XLSX from "xlsx";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).end();
    }

    // 🔥 FETCH LATEST DATA DIRECTLY
    const dataRes = await fetch(
      "https://vertigrow-dusky.vercel.app/api/data"
    );
    const data = await dataRes.json();

    if (!data || !data.time) {
      return res.status(200).send("No data available");
    }

    const worksheet = XLSX.utils.json_to_sheet([data]);
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

    return res.status(200).send(buffer);

  } catch (e) {
    return res.status(500).send("Excel export failed");
  }
}
