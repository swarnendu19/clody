import express from "express";
import mqtt from "mqtt";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();  
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",  
        methods: ["GET", "POST"]
    }
});
 
app.use(cors());
 
app.use(express.json());

const MQTT_BROKER = process.env.MQTT_BROKER || "mqtt://broker.hivemq.com";
const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker, subscribing to topic...");
    mqttClient.subscribe("swarnendu/data", (err) => {
        if (err) {
            console.error("Failed to subscribe:", err);
        } else {
            console.log("Successfully subscribed to swarnendu/data");
        }
    });
});


mqttClient.on("message", (topic, message) => {
    try {
        const sensorData = JSON.parse(message.toString());
        console.log("Received:", sensorData);
        io.emit("sensor-update", sensorData);
    } catch (error) {
        console.error("Error parsing MQTT message:", error);
    }
});

app.post("/data", (req, res) => {
    console.log("Received Data:", req.body);
    res.status(200).json({ message: "Data received successfully" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
