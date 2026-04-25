// import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

// export default function HeatmapView({ zones }) {

//   // 🎨 Color based on risk
//   const getColor = (risk) => {
//     if (risk === "red") return "#ef4444";
//     if (risk === "yellow") return "#facc15";
//     return "#22c55e";
//   };

//   // 🧠 Risk calculation
//   const getRisk = (temp, smoke, flame, soil) => {
//     if (flame || temp > 50 || smoke > 300 || (soil !== null && soil < 20)) {
//       return "red";
//     }
//     if (temp > 40 || smoke > 100) {
//       return "yellow";
//     }
//     return "green";
//   };

//   return (
//     <MapContainer
//       center={[28.61, 77.20]} // default center (India)
//       zoom={2}
//       className="h-[400px] w-full rounded-2xl"
//     >
//       {/* 🌍 Map Layer */}
//       <TileLayer
//         attribution="&copy; OpenStreetMap"
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />

//       {/* 🔥 Zones */}
//       {/* {zones.map((zone, i) => {

//         const risk = getRisk(
//           zone?.temp ?? 0,
//           zone?.smoke ?? 0,
//           zone?.flame ?? 0,
//           zone?.soil ?? null
//         );

//         return (
//           <CircleMarker
//             key={1}
//             center={[zone.lat, zone.lon]}
//             radius={risk === "red" ? 25 : risk === "yellow" ? 20 : 15} // 🔥 dynamic size
//             pathOptions={{
//               color: getColor(risk),
//               fillColor: getColor(risk),
//               fillOpacity: 0.6,
//             }}
//           >
//             <Popup>
//               <div className="text-sm">
//                 <strong>Zone {i + 1}</strong> <br />
//                 🌡 Temp: {zone.temp ?? "--"}°C <br />
//                 💧 Humidity: {zone.humidity ?? "--"}% <br />
//                 🌫 Smoke: {zone.smoke ?? "--"} <br />
//                 🔥 Flame: {zone.flame ? "YES" : "NO"} <br />
//                 🌱 Soil: {zone.soil ?? "N/A"} <br />
//                 📍 {zone.lat?.toFixed(4)}, {zone.lon?.toFixed(4)} <br />
//                 <span className="font-semibold">
//                   Risk: {risk.toUpperCase()}
//                 </span>
//               </div>
//             </Popup>
//           </CircleMarker>
//         );
//       })} */
//       {zones[0] && (
//   <CircleMarker
//     key="zone1"
//     center={[zones[0].lat, zones[0].lon]}
//     radius={
//       getRisk(
//         zones[0]?.temp ?? 0,
//         zones[0]?.smoke ?? 0,
//         zones[0]?.flame ?? 0,
//         zones[0]?.soil ?? null
//       ) === "red"
//         ? 25
//         : getRisk(
//             zones[0]?.temp ?? 0,
//             zones[0]?.smoke ?? 0,
//             zones[0]?.flame ?? 0,
//             zones[0]?.soil ?? null
//           ) === "yellow"
//         ? 20
//         : 15
//     }
//     pathOptions={{
//       color: getColor(
//         getRisk(
//           zones[0]?.temp ?? 0,
//           zones[0]?.smoke ?? 0,
//           zones[0]?.flame ?? 0,
//           zones[0]?.soil ?? null
//         )
//       ),
//       fillColor: getColor(
//         getRisk(
//           zones[0]?.temp ?? 0,
//           zones[0]?.smoke ?? 0,
//           zones[0]?.flame ?? 0,
//           zones[0]?.soil ?? null
//         )
//       ),
//       fillOpacity: 0.6,
//     }}
//   >
//     <Popup>
//       <div className="text-sm">
//         <strong>Zone 1</strong> <br />
//         🌡 Temp: {zones[0].temp ?? "--"}°C <br />
//         💧 Humidity: {zones[0].humidity ?? "--"}% <br />
//         🌫 Smoke: {zones[0].smoke ?? "--"} <br />
//         🔥 Flame: {zones[0].flame ? "YES" : "NO"} <br />
//         📍 {zones[0].lat?.toFixed(4)}, {zones[0].lon?.toFixed(4)} <br />
//       </div>
//     </Popup>
//   </CircleMarker>
// )}

//     </MapContainer>
//   );
// }


import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

export default function HeatmapView({ zones }) {

  const getColor = (risk) => {
    if (risk === "red") return "#ef4444";
    if (risk === "yellow") return "#facc15";
    return "#22c55e";
  };

  const getRisk = (temp, smoke, flame, soil) => {
    if (flame || temp > 50 || smoke > 300 || (soil !== null && soil < 20)) {
      return "red";
    }
    if (temp > 40 || smoke > 100) {
      return "yellow";
    }
    return "green";
  };

  // ✅ take only Zone 1
  const zone = zones[0];

  const risk = zone
    ? getRisk(zone.temp, zone.smoke, zone.flame, zone.soil)
    : "green";

  return (
    <MapContainer
      center={[zone?.lat || 28.61, zone?.lon || 77.20]} // ✅ auto center on zone
      zoom={5}
      className="h-[400px] w-full rounded-2xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🔥 ONLY ZONE 1 */}
      {zone && (
        <CircleMarker
          key="zone1"
          center={[zone.lat, zone.lon]}
          radius={risk === "red" ? 25 : risk === "yellow" ? 20 : 15}
          pathOptions={{
            color: getColor(risk),
            fillColor: getColor(risk),
            fillOpacity: 0.6,
          }}
        >
          <Popup>
            <div className="text-sm">
              <strong>Zone 1</strong> <br />
              🌡 Temp: {zone.temp ?? "--"}°C <br />
              💧 Humidity: {zone.humidity ?? "--"}% <br />
              🌫 Smoke: {zone.smoke ?? "--"} <br />
              🔥 Flame: {zone.flame ? "YES" : "NO"} <br />
              📍 {zone.lat?.toFixed(4)}, {zone.lon?.toFixed(4)} <br />
              <span className="font-semibold">
                Risk: {risk.toUpperCase()}
              </span>
            </div>
          </Popup>
        </CircleMarker>
      )}
    </MapContainer>
  );
}