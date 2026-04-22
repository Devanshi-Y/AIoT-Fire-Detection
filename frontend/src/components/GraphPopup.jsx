import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

euseEffect(() => {
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

      setHistory(prev => ({
        ...prev,
        z1: [...prev.z1, point].slice(-MAX_POINTS),
      }));
    }

    if (topic === "forest/zone2") {
      setZone2(point);

      setHistory(prev => ({
        ...prev,
        z2: [...prev.z2, point].slice(-MAX_POINTS),
      }));
    }
  });

  return () => client.end();
}, []);