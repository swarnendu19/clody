import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Sensor Schema
const sensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  timestamp: { type: Date, default: Date.now },
});
const SensorData = mongoose.model("SensorData", sensorSchema);

// API Endpoint to Receive Sensor Data
app.post("/api/sensor", async (req, res) => {
  try {
    const { temperature, humidity } = req.body;
    const newData = new SensorData({ temperature, humidity });
    await newData.save();
    res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// API to Fetch Data
app.get("/api/sensor", async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(50);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
