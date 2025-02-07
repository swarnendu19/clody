import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";

const Test = () => {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    fetchSensorData();
  }, []);

  const fetchSensorData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sensor");
      setSensorData(res.data);
    } catch (error) {
      console.error("Error fetching sensor data", error);
    }
  };

  const chartData = {
    labels: sensorData.map((data) =>
      new Date(data.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Temperature (°C)",
        data: sensorData.map((data) => data.temperature),
        borderColor: "red",
        fill: false,
      },
      {
        label: "Humidity (%)",
        data: sensorData.map((data) => data.humidity),
        borderColor: "blue",
        fill: false,
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Sensor Data Logger</h2>
      <Line data={chartData} />
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Time</th>
            <th>Temperature (°C)</th>
            <th>Humidity (%)</th>
          </tr>
        </thead>
        <tbody>
          {sensorData.map((data, index) => (
            <tr key={index}>
              <td>{new Date(data.timestamp).toLocaleTimeString()}</td>
              <td>{data.temperature}</td>
              <td>{data.humidity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Test;
