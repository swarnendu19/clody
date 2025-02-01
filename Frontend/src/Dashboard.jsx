import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    socket.on("sensor-update", (data) => {
      setSensorData((prev) => [...prev, data.temperature]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h1>Sensor Data</h1>
      {sensorData.map((temp, i) => (
        <p key={i}>Temperature: {temp}°C</p>
      ))}
    </div>
  );
};

export default Dashboard;
