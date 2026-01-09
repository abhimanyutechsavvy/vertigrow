async function fetchVitals() {
  try {
    const res = await fetch("/api/data");
    const data = await res.json();

    document.getElementById("phValue").innerText =
      data.ph ? Number(data.ph).toFixed(2) : "--";

    document.getElementById("tdsValue").innerText =
      data.tds ?? "--";

  } catch {}
}

async function sendAICommand() {
  const input = document.getElementById("aiInput");
  const replyBox = document.getElementById("aiReply");

  const message = input.value.trim();
  if (!message) return;

  replyBox.innerText = "Thinking…";

  try {
    const sensorRes = await fetch("/api/data");
    const sensor = await sensorRes.json();

    const aiRes = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        sensorData: sensor
      })
    });

    const data = await aiRes.json();
    replyBox.innerText = data.reply;
  } catch {
    replyBox.innerText = "AI error";
  }

  input.value = "";
}

// ✅ FINAL EXCEL EXPORT (NO SERVERLESS STATE)
async function downloadReport() {
  try {
    // Example history (Arduino can send real one)
    const history = [
      { ph: 6.1, tds: 980, time: new Date().toISOString() },
      { ph: 6.0, tds: 970, time: new Date().toISOString() }
    ];

    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history })
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "vertigrow_report.xlsx";
    a.click();

    URL.revokeObjectURL(url);

  } catch {
    alert("Excel export failed");
  }
}

setInterval(fetchVitals, 3000);
fetchVitals();
