export default function AlertHistory({ alerts }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-8">

      <h2 className="text-xl font-semibold mb-4">
        Alert History
      </h2>

      <div className="max-h-[250px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-orange-300">

        {alerts.length === 0 && (
          <p className="text-gray-500 text-sm">
            No alerts triggered yet
          </p>
        )}

        {alerts.map((alert, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg border text-sm flex justify-between items-center
              ${
                alert.severity === "red"
                  ? "bg-red-50 border-red-300"
                  : "bg-yellow-50 border-yellow-300"
              }`}
          >
            <div>
              <p className="font-medium">
                {alert.message}
              </p>
              <p className="text-xs text-gray-500">
                {alert.time}
              </p>
            </div>

            <span className={`text-xs font-semibold px-2 py-1 rounded
              ${
                alert.severity === "red"
                  ? "bg-red-500 text-white"
                  : "bg-yellow-400 text-black"
              }`}
            >
              {alert.zone}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}