const aiRes = await fetch("/api/ai", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message,
    sensorData: sensor   // 👈 THIS LINE MATTERS
  })
});
