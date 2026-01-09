import * as XLSX from "xlsx";
import { getHistory } from "./data";

export const config = {
  runtime: "nodejs"
};

export default function handler(req, res) {
  const history = getHistory();

  if (!history || history.length === 0) {
    return res.status(200).send("No data available");
  }

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

  res.send(buffer);
}
