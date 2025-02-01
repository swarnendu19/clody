const mqtt = require("mqtt");
const WebSocket = require("ws");
const express = require("express");

const app = express();
const PORT = 3000;

// Serve static files for the UI
app.use(express.static("public"));

// MQTT Client
const mqttClient = mqtt.connect("mqtt://broker.hivemq.com");
mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  mqttClient.subscribe("sensor/data");
});

// WebSocket Server
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  mqttClient.on("message", (topic, message) => {
    if (topic === "sensor/data") {
      ws.send(message.toString());
    }
  });
});

// Integrate WebSocket with Express
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
