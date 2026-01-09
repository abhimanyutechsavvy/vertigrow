async function sendAICommand() {
  const input = document.getElementById("aiInput");
  const replyBox = document.getElementById("aiReply");

  const message = input.value.trim();
  if (!message) return;

  replyBox.innerText = "Thinking…";

  try {
    const sensorRes = await fetch("/api/data");
    const sensorData = await sensorRes.json();

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sensorData })
    });

    if (!res.ok) {
      throw new Error("AI server error");
    }

    const data = await res.json();

    replyBox.innerText = data.reply || "AI gave no reply.";

  } catch (err) {
    console.error(err);
    replyBox.innerText = "AI is offline or error occurred.";
  }
}
