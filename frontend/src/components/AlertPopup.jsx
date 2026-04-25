export default function AlertPopup({ alert, onClose }) {
  if (!alert) return null;
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">

      {/* BIG ALERT BOX */}
      <div className="bg-red-50 border-4 border-red-500 rounded-3xl p-10 w-[90%] max-w-2xl text-center shadow-2xl animate-pulse">

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-6">
          🚨 CRITICAL FIRE ALERT 🚨
        </h1>

        {/* MESSAGE */}
        <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          Flame Detected in <span className="text-red-600">{alert.zone}</span>
        </p>

        {/* WARNING TEXT */}
        <p className="text-lg text-gray-600 mb-8">
          Immediate action required. High risk of forest fire detected.
        </p>

        {/* BUTTON */}
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-8 py-3 text-lg rounded-xl font-semibold hover:bg-red-700 transition"
        >
          Acknowledge Alert
        </button>

      </div>

    </div>
  );
}