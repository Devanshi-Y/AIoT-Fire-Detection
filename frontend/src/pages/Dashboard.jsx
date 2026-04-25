// import { useEffect, useState } from "react";
// import ZoneCard from "../components/ZoneCard";
// import AlertHistory from "../components/AlertHistory";
// import AlertPopup from "../components/AlertPopup";
// //import { connectMQTT } from "../services/mqttService";
// import GraphPopup from "../components/GraphPopup";

// export default function Dashboard() {
//   const [zone1, setZone1] = useState({});
//   const [zone2, setZone2] = useState({
//     lat: 28.665263625615633, // fixed location
//     lon: 77.23245445318264,
//   });
//   const [alert, setAlert] = useState(null);
//   const [alerts, setAlerts] = useState([]);
//   const [popupAlert, setPopupAlert] = useState(null);
//   const [graphData, setGraphData] = useState(null);
//   const [selectedMetric, setSelectedMetric] = useState(null);
//   const [selectedZone, setSelectedZone] = useState(null);
//   const MAX_POINTS = 20;

//   const [history, setHistory] = useState({
//     z1: [],
//     z2: [],
//   });

//   const checkAlerts = (data, zoneName) => {
//     let newAlerts = [];

//     if (data.temp > 50) {
//       newAlerts.push({
//         message: "High Temperature Detected",
//         severity: "red",
//         zone: zoneName,
//         time: new Date().toLocaleTimeString(),
//       });
//     }

//     if (data.smoke > 300) {
//       newAlerts.push({
//         message: "Smoke Level Critical",
//         severity: "red",
//         zone: zoneName,
//         time: new Date().toLocaleTimeString(),
//       });
//     }

//     if (data.flame) {
//       newAlerts.push({
//         message: "🔥 Flame Detected",
//         severity: "red",
//         zone: zoneName,
//         time: new Date().toLocaleTimeString(),
//       });
//     }

//     if (data.soil && data.soil < 20) {
//       newAlerts.push({
//         message: "Low Soil Moisture",
//         severity: "yellow",
//         zone: zoneName,
//         time: new Date().toLocaleTimeString(),
//       });
//     }

//     return newAlerts;
//   };
//   const CHANNEL_1 = "3175180"; // node1
//   const CHANNEL_2 = "3356565"; // node2
//   const fetchData = async () => {
//     try {
//       // Zone 1
//       const res1 = await fetch(
//         `https://api.thingspeak.com/channels/3175180/feeds.json?api_key=TDZTANC1OEHQDHCV&results=2`,
//       );
//       const data1 = await res1.json();
//       const feed1 = data1.feeds[0];

//       const z1 = {
//         temp: Number(feed1.field1) || 0,
//         humidity: Number(feed1.field2) || 0,
//         smoke: Number(feed1.field3) || 0,
//         flame: Number(feed1.field4) || 0,
//         lat: Number(feed1.field5) || 0,
//         lon: Number(feed1.field6) || 0,
//         time: new Date().toLocaleTimeString() || 0,
//       };

//       // Zone 2
//       const res2 = await fetch(
//         `https://api.thingspeak.com/channels/3356565/feeds.json?api_key=M7J7FOFE9VJ1A62X&results=2`,
//       );
//       const data2 = await res2.json();
//       const feed2 = data2.feeds[0];

//       const z2 = {
//         temp: Number(feed2.field1),
//         humidity: Number(feed2.field2),
//         soil: Number(feed2.field5),
//         smoke: Number(feed2.field3),
//         flame: Number(feed2.field4),
//         lat: 28.665263625615633, // keep fixed if no GPS
//         lon: 77.23245445318264,
//         time: new Date().toLocaleTimeString(),
//       };
//       const newAlerts = [
//         ...checkAlerts(z1, "Zone 1"),
//         ...checkAlerts(z2, "Zone 2"),
//       ];

//       setAlerts((prev) => [...newAlerts, ...prev].slice(0, 10));

//       // 🔥 POPUP
//       if (z1.flame && !popupAlert) {
//         setPopupAlert({ zone: "Zone 1" });
//       }
//       if (z2.flame && !popupAlert) {
//         setPopupAlert({ zone: "Zone 2" });
//       }
//       console.log("Feed1:", feed1);
//       console.log("Feed2:", feed2);
//       console.log("Zone2 raw:", data2);
//       if (!data1.feeds || data1.feeds.length === 0) return;
//       if (!data2.feeds || data2.feeds.length === 0) return;

//       // update states
//       setZone1(z1);
//       setZone2((prev) => ({ ...prev, ...z2 }));

//       // update history
//       setHistory((prev) => ({
//         z1: [...prev.z1, z1].slice(-20),
//         z2: [...prev.z2, z2].slice(-20),
//       }));
//     } catch (err) {
//       console.error("Error fetching ThingSpeak:", err);
//     }
//   };
//   const generateAlerts = (data, zoneName) => {
//     const alerts = [];

//     const temp = Number(data.temp) || 0;
//     const hum = Number(data.humidity) || 0;
//     const gas = Number(data.smoke) || 0;
//     const flame = data.flame === true || Number(data.flame) === 1;

//     const time = new Date().toLocaleTimeString();

//     // 🔴 FIRE
//     if (flame) {
//       alerts.push({
//         message: "🔥 Fire Detected",
//         severity: "red",
//         zone: zoneName,
//         time,
//       });
//     }

//     // 🟡 PREDICTION
//     else if (temp > 40 || hum < 30 || gas > 800) {
//       alerts.push({
//         message: "⚠️ High Risk - Possible Fire",
//         severity: "yellow",
//         zone: zoneName,
//         time,
//       });
//     }

//     return alerts;
//   };
//   useEffect(() => {
//     fetchData(); // first call

//     const interval = setInterval(fetchData, 20000); // every 20 sec
//     const newAlerts = [
//       ...generateAlerts(z1, "Zone 1"),
//       ...generateAlerts(z2, "Zone 2"),
//     ];
//     setAlerts((prev) => {
//       const updated = [...newAlerts, ...prev];

//       const unique = updated.filter(
//         (a, index, self) =>
//           index ===
//           self.findIndex(
//             (t) =>
//               t.message === a.message && t.zone === a.zone && t.time === a.time,
//           ),
//       );

//       return unique.slice(0, 10);
//     });
//     return () => clearInterval(interval);
//   }, []);

//   const handleCardClick = (metric, zone) => {
//     setSelectedMetric(metric);
//     setSelectedZone(zone);
//     setGraphData(true);
//   };

//   return (
//     <div className="bg-[#fff7ed] min-h-screen pt-24 px-6">
//       {/* ALERT BANNER */}
//       {alert && (
//         <div className="bg-red-500 text-white p-4 rounded-xl mb-6 text-center font-semibold">
//           {alert}
//         </div>
//       )}

//       <h1 className="text-3xl mb-6 font-bold">Forest Monitoring Dashboard</h1>

//       <ZoneCard
//         zone={1}
//         data={zone1}
//         type="zone1"
//         onCardClick={handleCardClick}
//       />

//       <ZoneCard
//         zone={2}
//         data={zone2}
//         type="zone2"
//         onCardClick={handleCardClick}
//       />
//       {graphData && (
//         <GraphPopup
//           history={history}
//           metric={selectedMetric}
//           zone={selectedZone}
//           onClose={() => setGraphData(null)}
//         />
//       )}
//       <AlertHistory alerts={alerts} />
//       <AlertPopup alert={popupAlert} onClose={() => setPopupAlert(null)} />

//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import ZoneCard from "../components/ZoneCard";
import AlertHistory from "../components/AlertHistory";
import AlertPopup from "../components/AlertPopup";
import GraphPopup from "../components/GraphPopup";

// ─── Alert Generation (3-Case Logic) ────────────────────────────────────────
//
//  CASE 1 → No alerts         : All params safe, flame = 0
//  CASE 2 → WARNING alerts    : Params above threshold, flame = 0  (prediction)
//  CASE 3 → CRITICAL alerts   : flame = 1  (fire confirmed)
//

const generateAlerts = (data, zoneName) => {
  const alerts = [];

  const temp = Number(data.temp) || 0;
  const hum = Number(data.humidity) || 0;
  const gas = Number(data.smoke) || 0;
  const time = new Date().toLocaleTimeString();

  // Corrected flame logic: 1 = fire detected, 0 = no fire
  const flame = Number(data.flame) === 1 || data.flame === true;

  // ── CASE 3: FIRE DETECTED ─────────────────────────────────────────────────
  if (flame) {
    alerts.push({
      message: "🔥 FIRE DETECTED - Take Action!",
      severity: "red",
      zone: zoneName,
      time,
      case: 3,
    });
    return alerts; // No need to add prediction alerts if fire is already there
  }

  // ── CASE 2: HIGH RISK PREDICTION ──────────────────────────────────────────
  // Check each parameter independently so we know exactly what's wrong
  let riskFactors = [];

  if (temp > 40) {
    riskFactors.push(`Temp ${temp.toFixed(1)}°C`);
    alerts.push({
      message: `🌡️ High Temperature: ${temp.toFixed(1)}°C — Fire risk rising`,
      severity: "yellow",
      zone: zoneName,
      time,
      case: 2,
    });
  }

  if (hum < 30) {
    riskFactors.push(`Humidity ${hum.toFixed(1)}%`);
    alerts.push({
      message: `💧 Low Humidity: ${hum.toFixed(1)}% — Dry conditions detected`,
      severity: "yellow",
      zone: zoneName,
      time,
      case: 2,
    });
  }

  if (gas > 800) {
    riskFactors.push(`Gas ${gas}`);
    alerts.push({
      message: `💨 High Gas Level: ${gas} — Smoke/fumes detected`,
      severity: "yellow",
      zone: zoneName,
      time,
      case: 2,
    });
  }

  // Composite HIGH RISK alert if multiple factors triggered
  if (riskFactors.length >= 2) {
    alerts.unshift({
      message: `⚠️ MULTIPLE RISK FACTORS in ${zoneName}: ${riskFactors.join(", ")} — Fire may occur within ~1 hour!`,
      severity: "orange",
      zone: zoneName,
      time,
      case: 2,
    });
  }

  // ── CASE 1: SAFE — no alerts ──────────────────────────────────────────────
  return alerts;
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [zone1, setZone1] = useState({});
  const [zone2, setZone2] = useState({
    lat: 28.665263625615633,
    lon: 77.23245445318264,
  });

  const [alerts, setAlerts] = useState([]);
  const [popupAlert, setPopupAlert] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);

  const [history, setHistory] = useState({ z1: [], z2: [] });

  // Track popup suppression per zone to avoid re-triggering on every fetch
  const popupShownRef = useRef({ z1: false, z2: false });

  // ── Fetch from ThingSpeak ──────────────────────────────────────────────────
  // const fetchData = async () => {
  //   try {
  //     // Zone 1
  //     const res1  = await fetch(
  //       `https://api.thingspeak.com/channels/3175180/feeds.json?api_key=TDZTANC1OEHQDHCV&results=2`
  //     );
  //     const data1 = await res1.json();
  //     if (!data1.feeds || data1.feeds.length === 0) return;
  //     const feed1 = await res1.json();

  //     const z1 = {
  //       temp:     Number(feed1.field1) || 0,
  //       humidity: Number(feed1.field2) || 0,
  //       smoke:    Number(feed1.field3) || 0,
  //       // Corrected: field4 = 1 means fire, 0 means no fire
  //       flame:    Number(feed1.field4) === 1,
  //       lat:      Number(feed1.field5) || 0,
  //       lon:      Number(feed1.field6) || 0,
  //       time:     new Date().toLocaleTimeString(),
  //     };

  //     // Zone 2
  //     const res2  = await fetch(
  //       `https://api.thingspeak.com/channels/3356565/feeds.json?api_key=M7J7FOFE9VJ1A62X&results=2`
  //     );
  //     const data2 = await res2.json();
  //     if (!data2.feeds || data2.feeds.length === 0) return;
  //     const feed2 = await res1.json();

  //     const z2 = {
  //       temp:     Number(feed2.field1) || 0,
  //       humidity: Number(feed2.field2) || 0,
  //       smoke:    Number(feed2.field3) || 0,
  //       // Corrected: field4 = 1 means fire, 0 means no fire
  //       flame:    Number(feed2.field4) === 1,
  //       soil:     Number(feed2.field5) || 0,
  //       lat:      28.665263625615633,
  //       lon:      77.23245445318264,
  //       time:     new Date().toLocaleTimeString(),
  //     };

  //     console.log("Zone1:", z1);
  //     console.log("Zone2:", z2);

  //     // ── Generate Alerts ────────────────────────────────────────────────────
  //     const newAlerts = [
  //       ...generateAlerts(z1, "Zone 1"),
  //       ...generateAlerts(z2, "Zone 2"),
  //     ];

  //     setAlerts((prev) => {
  //       const combined = [...newAlerts, ...prev];
  //       // Deduplicate by message + zone + time
  //       const unique = combined.filter(
  //         (a, idx, self) =>
  //           idx ===
  //           self.findIndex(
  //             (t) => t.message === a.message && t.zone === a.zone && t.time === a.time
  //           )
  //       );
  //       return unique.slice(0, 15);
  //     });

  //     // ── Fire Popup (Case 3 only, once per flame event) ─────────────────────
  //     if (z1.flame && !popupShownRef.current.z1) {
  //       setPopupAlert({ zone: "Zone 1" });
  //       popupShownRef.current.z1 = true;
  //     }
  //     if (!z1.flame) popupShownRef.current.z1 = false; // reset when flame gone

  //     if (z2.flame && !popupShownRef.current.z2) {
  //       setPopupAlert({ zone: "Zone 2" });
  //       popupShownRef.current.z2 = true;
  //     }
  //     if (!z2.flame) popupShownRef.current.z2 = false;

  //     // ── Update State ───────────────────────────────────────────────────────
  //     setZone1(z1);
  //     setZone2((prev) => ({ ...prev, ...z2 }));

  //     setHistory((prev) => ({
  //       z1: [...prev.z1, z1].slice(-20),
  //       z2: [...prev.z2, z2].slice(-20),
  //     }));
  //   } catch (err) {
  //     console.error("Error fetching ThingSpeak:", err);
  //   }
  // };
  const fetchData = async () => {
    try {
      // ─── ZONE 1 ─────────────────────────────────────────────
      const res1 = await fetch(
        "https://api.thingspeak.com/channels/3175180/feeds.json?api_key=TDZTANC1OEHQDHCV&results=2",
      );

      const data1 = await res1.json();

      if (!data1.feeds || data1.feeds.length === 0) return;

      // ✅ ALWAYS TAKE LATEST ENTRY
      const feed1 = data1.feeds[data1.feeds.length - 1];

      const z1 = {
        temp: Number(feed1.field1) || 0,
        humidity: Number(feed1.field2) || 0,
        smoke: Number(feed1.field3) || 0,
        flame: Number(feed1.field4) === 1, // ✅ boolean
        lat: 28.665263625615633,
        lon: 77.23245445318264,
        time: new Date().toLocaleTimeString(),
      };

      // ─── ZONE 2 ─────────────────────────────────────────────
      const res2 = await fetch(
        "https://api.thingspeak.com/channels/3356565/feeds.json?api_key=M7J7FOFE9VJ1A62X&results=2",
      );

      const data2 = await res2.json();

      if (!data2.feeds || data2.feeds.length === 0) return;

      // ✅ FIXED (was wrong before)
      const feed2 = data2.feeds[data2.feeds.length - 1];

      const z2 = {
        temp: Number(feed2.field1) || 0,
        humidity: Number(feed2.field2) || 0,
        smoke: Number(feed2.field3) || 0,
        flame: Number(feed2.field4) === 1, // ✅ boolean
        soil: Number(feed2.field5) || 0, // , // soil moisture not working, using dummy value for testing 
        lat: 28.665263625615633,
        lon: 77.23245445318264,
        time: new Date().toLocaleTimeString(),
      };

      console.log("Zone1:", z1);
      console.log("Zone2:", z2);

      // ─── ALERTS ─────────────────────────────────────────────
      const newAlerts = [
        ...generateAlerts(z1, "Zone 1"),
        ...generateAlerts(z2, "Zone 2"),
      ];

      setAlerts((prev) => {
        const combined = [...newAlerts, ...prev];

        const unique = combined.filter(
          (a, idx, self) =>
            idx ===
            self.findIndex(
              (t) =>
                t.message === a.message &&
                t.zone === a.zone &&
                t.time === a.time,
            ),
        );

        return unique.slice(0, 15);
      });

      // ─── POPUP (FIRE ONLY) ──────────────────────────────────
      if (z1.flame && !popupShownRef.current.z1) {
        setPopupAlert({ zone: "Zone 1" });
        popupShownRef.current.z1 = true;
      }
      if (!z1.flame) popupShownRef.current.z1 = false;

      if (z2.flame && !popupShownRef.current.z2) {
        setPopupAlert({ zone: "Zone 2" });
        popupShownRef.current.z2 = true;
      }
      if (!z2.flame) popupShownRef.current.z2 = false;

      // ─── UPDATE STATE ───────────────────────────────────────
      setZone1(z1);
      setZone2((prev) => ({ ...prev, ...z2 }));

      setHistory((prev) => ({
        z1: [...prev.z1, z1].slice(-20),
        z2: [...prev.z2, z2].slice(-20),
      }));
    } catch (err) {
      console.error("Error fetching ThingSpeak:", err);
    }
  };
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => clearInterval(interval);
    // generateAlerts is called inside fetchData where z1/z2 are in scope
  }, []);

  const handleCardClick = (metric, zone) => {
    setSelectedMetric(metric);
    setSelectedZone(zone);
    setGraphData(true);
  };

  return (
    <div className="bg-[#fff7ed] min-h-screen pt-24 px-6">
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

      {graphData && (
        <GraphPopup
          history={history}
          metric={selectedMetric}
          zone={selectedZone}
          onClose={() => setGraphData(null)}
        />
      )}

      <AlertHistory alerts={alerts} />
      <AlertPopup alert={popupAlert} onClose={() => setPopupAlert(null)} />
    </div>
  );
}
