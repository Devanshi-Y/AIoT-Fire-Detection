import { useEffect, useState } from "react";
import ZoneCard from "../components/ZoneCard";
import AlertHistory from "../components/AlertHistory";
import AlertPopup from "../components/AlertPopup";
import { connectMQTT } from "../services/mqttService";

export default function Dashboard() {
  const [zone1, setZone1] = useState({});
  const [zone2, setZone2] = useState({});
  const [alert, setAlert] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [popupAlert, setPopupAlert] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const MAX_POINTS = 20;

  const [history, setHistory] = useState({
    z1: [],
    z2: [],
  });

  const generateHistory = () => {
    return Array.from({ length: 10 }).map((_, i) => ({
      time: i,

      // Zone 1
      z1Temp: 30 + Math.random() * 20,
      z1Humidity: 40 + Math.random() * 30,
      z1Smoke: Math.random() * 400,
      z1Flame: Math.random() > 0.8 ? 1 : 0, // 1 = flame, 0 = no flame

      // Zone 2
      z2Temp: 28 + Math.random() * 20,
      z2Humidity: 42 + Math.random() * 30,
      z2Smoke: Math.random() * 400,
      z2Soil: Math.random() * 40,
      z2Flame: Math.random() > 0.8 ? 1 : 0,
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const z1 = generateData();
      const z2 = generateData();

      setZone1(z1);
      setZone2(z2);

      const newAlerts = [
        ...checkAlerts(z1, "Zone 1"),
        ...checkAlerts(z2, "Zone 2"),
      ];

      // add latest alerts on top
      setAlerts((prev) => [...newAlerts, ...prev].slice(0, 10));
      setZone1(z1);
      setZone2(z2);

      if (z1.flame) {
        setPopupAlert({ zone: "Zone 1" });
      }
      if (z2.flame) {
        setPopupAlert({ zone: "Zone 2" });
      }
    }, 3000);
    const checkAlerts = (data, zoneName) => {
      let newAlerts = [];

      if (data.temp > 50) {
        newAlerts.push({
          message: "High Temperature Detected",
          severity: "red",
          zone: zoneName,
          time: new Date().toLocaleTimeString(),
        });
      }

      if (data.smoke > 300) {
        newAlerts.push({
          message: "Smoke Level Critical",
          severity: "red",
          zone: zoneName,
          time: new Date().toLocaleTimeString(),
        });
      }

      if (data.flame) {
        newAlerts.push({
          message: "🔥 Flame Detected",
          severity: "red",
          zone: zoneName,
          time: new Date().toLocaleTimeString(),
        });
      }

      if (data.soil && data.soil < 20) {
        newAlerts.push({
          message: "Low Soil Moisture",
          severity: "yellow",
          zone: zoneName,
          time: new Date().toLocaleTimeString(),
        });
      }

      return newAlerts;
    };

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const client = connectMQTT((topic, data) => {
      // expected data shape from ESP32:
      // { temp, humidity, smoke, soil?, flame, lat, lon }

      const point = {
        time: new Date().toLocaleTimeString(),
        temp: Number(data.temp),
        humidity: Number(data.humidity),
        smoke: Number(data.smoke),
        soil: data.soil ? Number(data.soil) : null,
        flame: data.flame ? 1 : 0,
        lat: data.lat,
        lon: data.lon,
      };

      if (topic === "forest/zone1") {
        setZone1(point); // your existing live card state

        setHistory((prev) => ({
          ...prev,
          z1: [...prev.z1, point].slice(-MAX_POINTS),
        }));
      }

      if (topic === "forest/zone2") {
        setZone2(point);

        setHistory((prev) => ({
          ...prev,
          z2: [...prev.z2, point].slice(-MAX_POINTS),
        }));
      }
    });

    return () => client.end();
  }, []);
  const handleCardClick = (metric, zone) => {
    setSelectedMetric(metric);
    setSelectedZone(zone);
    setGraphData(generateHistory());
  };

  return (
    <div className="bg-[#fff7ed] min-h-screen pt-24 px-6">
      {/* ALERT BANNER */}
      {alert && (
        <div className="bg-red-500 text-white p-4 rounded-xl mb-6 text-center font-semibold">
          {alert}
        </div>
      )}

      <h1 className="text-3xl mb-6 font-bold">Forest Monitoring Dashboard</h1>

      <ZoneCard
        zone={1}
        data={zone1}
        type="zone1"
        onCardClick={handleCardClick}
      />

      <ZoneCard
        zone={2}
        data={zone2}
        type="zone2"
        onCardClick={handleCardClick}
      />

      <AlertHistory alerts={alerts} />
      <AlertPopup alert={popupAlert} onClose={() => setPopupAlert(null)} />
    </div>
  );
}
