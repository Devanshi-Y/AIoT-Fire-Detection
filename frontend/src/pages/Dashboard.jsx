import { useEffect, useState } from "react";
import ZoneCard from "../components/ZoneCard";
import AlertHistory from "../components/AlertHistory";
import AlertPopup from "../components/AlertPopup";

export default function Dashboard() {
  const [zone1, setZone1] = useState({});
  const [zone2, setZone2] = useState({});
  const [alert, setAlert] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [popupAlert, setPopupAlert] = useState(null);

  const generateData = () => ({
    temp: Math.floor(30 + Math.random() * 30),
    humidity: Math.floor(40 + Math.random() * 40),
    smoke: Math.floor(Math.random() * 400),
    soil: Math.floor(Math.random() * 40),
    flame: Math.random() > 0.8,
    lat: "28.61",
    lon: "77.20",
  });

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

  return (
    <div className="bg-[#fff7ed] min-h-screen pt-24 px-6">
      {/* ALERT BANNER */}
      {alert && (
        <div className="bg-red-500 text-white p-4 rounded-xl mb-6 text-center font-semibold">
          {alert}
        </div>
      )}

      <h1 className="text-3xl mb-6 font-bold">Forest Monitoring Dashboard</h1>

      <ZoneCard zone={1} data={zone1} type="zone1" />
      <ZoneCard zone={2} data={zone2} type="zone2" />
      <AlertHistory alerts={alerts} />
      <AlertPopup alert={popupAlert} onClose={() => setPopupAlert(null)} />
    </div>
  );
}
