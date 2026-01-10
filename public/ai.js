async function updateVitals() {
  const res = await fetch("/api/data", { method: "POST" });
  const data = await res.json();

  document.getElementById("phValue").innerText = data.ph.toFixed(2);
  document.getElementById("tdsValue").innerText = data.tds;

  const healthEl = document.getElementById("healthValue");

  let health = "GOOD";
  let className = "good";

  if (data.ph < 5.5 || data.ph > 6.8 || data.tds < 600 || data.tds > 1400) {
    health = "BAD";
    className = "bad";
  } else if (
    (data.ph >= 5.5 && data.ph < 5.8) ||
    (data.ph > 6.5 && data.ph <= 6.8)
  ) {
    health = "MODERATE";
    className = "warn";
  }

  healthEl.innerText = health;
  healthEl.className = "value " + className;
}

async function sendAI() {
  const msg = document.getElementById("aiInput").value;
  document.getElementById("aiReply").innerText = "Thinking…";

  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  });

  const data = await res.json();
  document.getElementById("aiReply").innerText = data.reply;
}

function downloadExcel() {
  window.location.href = "/api/export";
}

setInterval(updateVitals, 3000);
updateVitals();
