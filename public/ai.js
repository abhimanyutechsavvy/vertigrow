console.log("✅ Frontend ai.js loaded");

async function fetchVitals() {
  const r = await fetch("/api/data");
  const d = await r.json();

  document.getElementById("phValue").innerText =
    d.ph ? d.ph.toFixed(2) : "--";
  document.getElementById("tdsValue").innerText =
    d.tds || "--";

  let h = "GOOD";
  if (d.ph < 5.8 || d.ph > 6.5 || d.tds < 800 || d.tds > 1200) h = "BAD";
  document.getElementById("healthValue").innerText = h;
}

async function sendAI() {
  const input = document.getElementById("aiInput");
  const reply = document.getElementById("aiReply");

  reply.innerText = "Thinking…";

  const sensor = await fetch("/api/data").then(r => r.json());

  const r = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: input.value,
      sensorData: sensor
    })
  });

  const d = await r.json();
  reply.innerText = d.reply;
  input.value = "";
}

async function downloadExcel() {
  const r = await fetch("/api/export");
  const blob = await r.blob();

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "vertigrow_report.xlsx";
  a.click();
}

setInterval(fetchVitals, 3000);
fetchVitals();

window.sendAI = sendAI;
window.downloadExcel = downloadExcel;
