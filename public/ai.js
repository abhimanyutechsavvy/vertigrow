async function fetchVitals() {
  try {
    const res = await fetch("/api/data");
    const data = await res.json();

    const ph = Number(data.ph);
    const tds = Number(data.tds);

    document.getElementById("phValue").innerText =
      isNaN(ph) ? "--" : ph.toFixed(2);

    document.getElementById("tdsValue").innerText =
      isNaN(tds) ? "--" : tds;

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

    const healthEl = document.getElementById("healthValue");
    healthEl.innerText = health;
    healthEl.className = `value ${cls}`;

  } catch (e) {
    console.error("Vitals error:", e);
  }
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
    replyBox.innerText = data.reply || "No reply from AI";

  } catch (err) {
    console.error(err);
    replyBox.innerText = "AI is offline or error occurred";
  }

  input.value = "";
}

setInterval(fetchVitals, 3000);
fetchVitals();
