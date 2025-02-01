const ws = new WebSocket("ws://localhost:3000");

ws.onopen = () => {
  console.log("WebSocket connection established");
};

ws.onmessage = (event) => {
  const sensorData = event.data;
  document.getElementById("sensor-data").textContent = sensorData;
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};
