import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GraphPopup({ data, metric, zone, onClose }) {
  if (!data) return null;

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

  const dataKey = keyMap[metric];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[90%] max-w-3xl shadow-xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {metric} - {zone}
          </h2>

          <button onClick={onClose} className="text-red-500 text-lg">
            ✕
          </button>
        </div>

        {/* GRAPH */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 1]}
              tickFormatter={(val) => (val === 1 ? "Flame" : "No Flame")}
            />
            <Tooltip />
            <Line
              type="stepAfter"
              dataKey={dataKey}
              stroke="#ef4444"
              strokeWidth={3}
            />
            <Line dataKey="z2Soil" stroke="#22c55e" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
