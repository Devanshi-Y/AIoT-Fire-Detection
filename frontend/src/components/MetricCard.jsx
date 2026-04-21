import { motion } from "framer-motion";

export default function MetricCard({ title, value, zone, onClick }) {

  const colors = {
    red: "border-red-400 bg-red-50",
    yellow: "border-yellow-400 bg-yellow-50",
    green: "border-green-400 bg-green-50",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-5 rounded-2xl border ${colors[status]} shadow-sm transition`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <div className="text-orange-500">{icon}</div>
      </div>

      <p className="text-2xl font-bold mt-2">{value}</p>
    </motion.div>
  );
}