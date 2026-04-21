import { Link } from "react-router-dom";
import { Flame, Brain, MapPin, Activity, Cloud, Bell } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-[#fff7ed] text-gray-800 pt-28 px-6">
      {/* HERO */}
      <section className="text-center max-w-5xl mx-auto py-12">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Smart Forest Fire Detection <br /> & Prediction System
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Real-time IoT monitoring with AI-powered fire risk prediction
        </p>

        <div className="mt-10 flex justify-center gap-6">
          <Link className="bg-orange-500 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-orange-600 transition">
            View Dashboard
          </Link>

          <Link className="border border-gray-300 px-8 py-3 rounded-xl text-lg hover:bg-orange-50 transition">
            Explore Visuals
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto text-center py-8">
        <h2 className="text-4xl font-bold mb-3">About System</h2>

        <p className="text-gray-600 text-base leading-relaxed">
          This system uses two ESP32-based nodes deployed across forest zones.
          Data is transmitted via MQTT protocol for real-time monitoring. Ground
          and canopy-level sensing ensures early fire detection.
        </p>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Flame size={26} />,
              title: "Fire Detection",
              desc: "Early detection of fire signals",
              color: "orange",
            },
            {
              icon: <Brain size={26} />,
              title: "AI Prediction",
              desc: "Predicts fire risk in advance",
              color: "yellow",
            },
            {
              icon: <MapPin size={26} />,
              title: "GPS Tracking",
              desc: "Tracks forest zones accurately",
              color: "orange",
            },
            {
              icon: <Activity size={26} />,
              title: "Real-time Data",
              desc: "Live sensor monitoring",
              color: "green",
            },
            {
              icon: <Cloud size={26} />,
              title: "Cloud Integration",
              desc: "ThingSpeak + MQTT support",
              color: "orange",
            },
            {
              icon: <Bell size={26} />,
              title: "Instant Alerts",
              desc: "Immediate warning system",
              color: "red",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`group relative bg-white p-6 rounded-2xl border-l-4 
              ${
                item.color === "red"
                  ? "border-red-500"
                  : item.color === "green"
                    ? "border-green-500"
                    : item.color === "yellow"
                      ? "border-yellow-400"
                      : "border-orange-500"
              }
              shadow-sm hover:shadow-xl hover:scale-[1.03] transition duration-300`}
            >
              {/* ICON */}
              <div className="mb-4 text-orange-500 group-hover:scale-110 transition">
                {item.icon}
              </div>

              {/* TITLE */}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>

              {/* DESC */}
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">System Workflow</h2>

        <div className="flex flex-wrap justify-center items-center gap-3">
          {[
            "Sensors",
            "ESP32",
            "MQTT",
            "Cloud",
            "Processing",
            "Detection",
            "Prediction",
            "Alerts",
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              {/* STEP */}
              <div
                className="
                  bg-white 
                 px-6 py-4              /* increased padding */
                 rounded-xl 
                 border 
                 text-base              /* bigger text */
                 font-semibold 
                 shadow-md              /* stronger shadow */
                 min-w-[120px]          /* forces width */
                 text-center
                 hover:shadow-lg 
                 hover:scale-105 
                 hover:bg-orange-50 
                 transition duration-300
                "
              >
                {step}
              </div>

              {/* ARROW */}
              {i !== 7 && <span className="text-orange-500 text-lg">→</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
