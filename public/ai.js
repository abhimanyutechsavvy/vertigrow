async function fetchVitals() {
  try {
    const res = await fetch("/api/data");
    const data = await res.json();

    // Update values
    document.getElementById("phValue").innerText =
      data.ph ? data.ph.toFixed(2) : "--";

    document.getElementById("tdsValue").innerText =
      data.tds ? data.tds : "--";

    // Health logic
    let health = "GOOD";
    if (data.ph < 5.8 || data.ph > 6.5 || data.tds < 800 || data.tds > 1200) {
      health = "BAD";
    }

    document.getElementById("healthValue").innerText = health;

  } catch (err) {
    console.error("Vitals fetch failed", err);
  }
}

/* ================= AI CHAT ================= */
async function sendAICommand() {
  const input = document.getElementById("aiInput");
  const replyBox = document.getElementById("aiReply");

  replyBox.innerText = "Thinking...";

  try {
    const sensorRes = await fetch("/api/data");
    const sensorData = await sensorRes.json();

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input.value,
        sensorData
      })
    });

    const data = await res.json();
    replyBox.innerText = data.reply;

  } catch (err) {
    replyBox.innerText = "AI is offline or error occurred";
  }
}

/* ================= AUTO REFRESH ================= */
setInterval(fetchVitals, 3000);
fetchVitals();
