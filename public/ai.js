async function fetchVitals() {
  const res = await fetch("/api/data");
  const data = await res.json();

  const ph = Number(data.ph);
  const tds = Number(data.tds);

  document.getElementById("phValue").innerText =
    isNaN(ph) ? "--" : ph.toFixed(2);

  document.getElementById("tdsValue").innerText =
    isNaN(tds) ? "--" : tds;

  let health = "GOOD";
  if (ph < 5.5 || ph > 6.8 || tds < 700 || tds > 1400) {
    health = "WARN";
  }
  if (ph < 5 || ph > 7.2 || tds < 500 || tds > 1800) {
    health = "BAD";
  }

  document.getElementById("healthValue").innerText = health;
}

async function sendAI() {
  const input = document.getElementById("aiInput");
  const reply = document.getElementById("aiReply");

  const message = input.value.trim();
  if (!message) return;

  reply.innerText = "Thinking…";

  const sensorRes = await fetch("/api/data");
  const sensorData = await sensorRes.json();

  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sensorData })
  });

  const data = await res.json();
  reply.innerText = data.reply || "No reply";

  input.value = "";
}

setInterval(fetchVitals, 3000);
fetchVitals();
