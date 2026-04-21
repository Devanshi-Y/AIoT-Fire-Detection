import { useEffect, useState } from "react";
import HeatmapView from "../components/HeatmapView";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Visuals() {

  const [data, setData] = useState([]);
  const [zones, setZones] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  const getRisk = (temp, smoke, flame) => {
    if (flame || temp > 50 || smoke > 300) return "red";
    if (temp > 40 || smoke > 100) return "yellow";
    return "green";
  };

  const fetchData = () => {

    const newData = Array.from({ length: 10 }).map((_, i) => ({
      time: i,
      temp: 30 + Math.random() * 20,
      humidity: 40 + Math.random() * 30,
    }));

    const zoneData = [
      {
        lat: 28.61,
        lon: 77.20,
        temp: 30 + Math.random() * 25,
        smoke: Math.random() * 400,
        flame: Math.random() > 0.8,
      },
      {
        lat: 19.07,
        lon: 72.87,
        temp: 30 + Math.random() * 25,
        smoke: Math.random() * 400,
        flame: Math.random() > 0.8,
      },
    ].map((z) => ({
      ...z,
      risk: getRisk(z.temp, z.smoke, z.flame),
    }));

    setZones(zoneData);
    setData(newData);
    setLastUpdated(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#fff7ed] min-h-screen pt-24 px-6">

      <h1 className="text-3xl font-bold mb-2">Visual Analytics</h1>
      <p className="text-sm text-gray-600 mb-6">
        Last Updated: {lastUpdated}
      </p>

      {/* HEATMAP */}
      <div className="bg-white p-6 rounded-2xl shadow mb-10">
        <h2 className="mb-4 font-semibold">Fire Risk Map</h2>
        <HeatmapView zones={zones} />
      </div>

      {/* TEMP GRAPH */}
      <div className="bg-white p-6 rounded-2xl shadow mb-10">
        <h2 className="mb-4 font-semibold">Temperature Trend</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line dataKey="temp" stroke="#f97316" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* HUMIDITY GRAPH */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="mb-4 font-semibold">Humidity Trend</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line dataKey="humidity" stroke="#facc15" />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}