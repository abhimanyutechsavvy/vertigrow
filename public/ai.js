async function fetchVitals() {
  const res = await fetch("/api/data");
  const data = await res.json();

  const phEl = document.getElementById("phValue");
  const tdsEl = document.getElementById("tdsValue");
  const healthEl = document.getElementById("healthValue");

  const ph = data.ph;
  const tds = data.tds;

  phEl.innerText = ph.toFixed(2);
  tdsEl.innerText = tds;

  // Health logic
  let health = "GOOD";
  let cls = "good";

  if (ph < 5.5 || ph > 6.8 || tds < 700 || tds > 1400) {
    health = "WARNING";
    cls = "warn";
  }

  if (ph < 5.0 || ph > 7.2 || tds < 500 || tds > 1800) {
    health = "CRITICAL";
    cls = "bad";
  }

  healthEl.innerText = health;
  healthEl.className = `value ${cls}`;
}

async function sendAICommand() {
  const input = document.getElementById("aiInput");
  const replyBox = document.getElementById("aiReply");
  const message = input.value.trim();
  if (!message) return;

  replyBox.innerText = "Thinking…";

  const sensorRes = await fetch("/api/data");
  const sensor = await sensorRes.json();

  const aiRes = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sensor })
  });

  const ai = await aiRes.json();
  replyBox.innerText = ai.reply;

  await fetch("/api/command", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: ai.action })
  });

  input.value = "";
}

// Auto-refresh vitals every 3 seconds
setInterval(fetchVitals, 3000);
fetchVitals();
