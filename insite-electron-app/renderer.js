async function testBackend() {
  try {
    const result = await window.backend.ping();
    console.log("Backend says:", result);
  } catch (e) {
    console.error("Backend error:", e);
  }
}
async function fetchStats() {
  const res = await fetch("http://localhost:8080/api/stats");
  const data = await res.json();
  console.log("IDS stats:", data);
}

setInterval(fetchStats, 1000);
testBackend();
