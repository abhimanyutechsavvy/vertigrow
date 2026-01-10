// ===============================
// FRONTEND LOGIC FOR VERTIGROW
// ===============================

console.log("✅ Frontend ai.js loaded");

// ---------- FETCH & DISPLAY VITALS ----------
async function fetchVitals() {
  try {
    const res = await fetch("/api/data");
    const data = await res.json();

    console.log("Vitals received:", data);

    // Update pH
    const phEl = document.getElementById("phValue");
    const tdsEl = document.getElementById("tdsValue");
    const healthEl = document.getElementById("healthValue");

    if (data.ph && data.ph !== 0) {
      phEl.innerText = Number(data.ph).toFixed(2);
    } else {
      phEl.innerText = "--";
    }

    if (data.tds && data.tds !== 0) {
      tdsEl.innerText = data.tds;
    } else {
      tdsEl.innerText = "--";
    }

    // Health logic
    let health = "GOOD";
    let cls = "good";

    if (
      data.ph < 5.8 || data.ph > 6.5 ||
      data.tds < 800 || data.tds > 1200
    ) {
      health = "BAD";
      cls = "bad";
    }

    healthEl.innerText = health;
    healthEl.className = "value " + cls;

  } catch (err) {
    console.error("❌ fetchVitals error:", err);
  }
}

// ---------- SEND AI MESSAGE ----------
async function sendAI() {
  console.log("✅ Send button clicked");

  const input = document.getElementById("aiInput");
  const replyBox = document.getElementById("aiReply");

  const message = input.value.trim();
  if (!message) {
    replyBox.innerText = "Type something first";
    return;
  }

  replyBox.innerText = "Thinking…";

  try {
    // Get latest sensor data
    const sensorRes = await fetch("/api/data");
    const sensorData = await sensorRes.json();

    console.log("Sending to AI:", {
      message,
      sensorData
    });

    // Send to AI backend
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        sensorData
      })
    });

    const data = await res.json();
    console.log("AI backend reply:", data);

    replyBox.innerText = data.reply || "No reply from AI";

  } catch (err) {
    console.error("❌ sendAI error:", err);
    replyBox.innerText = "AI is offline or error occurred";
  }

  input.value = "";
}

// ---------- AUTO REFRESH ----------
setInterval(fetchVitals, 3000);
fetchVitals();

// Expose function to HTML button
window.sendAI = sendAI;
