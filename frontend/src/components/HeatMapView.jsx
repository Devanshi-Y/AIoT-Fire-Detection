import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

export default function HeatmapView({ zones }) {

  const getColor = (risk) => {
    if (risk === "red") return "#ef4444";
    if (risk === "yellow") return "#facc15";
    return "#22c55e";
  };
  const getRisk = (temp, smoke, flame, soil) => {
  if (flame || temp > 50 || smoke > 300 || (soil !== null && soil < 30)) return "red";
  if (temp > 40 || smoke > 100) return "yellow";
  return "green";
};
  const zones = [
  {
    lat: zone1.lat,
    lon: zone1.lon,
    risk: getRisk(zone1.temp, zone1.smoke, zone1.flame)
  },
  {
    lat: zone2.lat,
    lon: zone2.lon,
    risk: getRisk(zone2.temp, zone2.smoke, zone2.flame, zone2.soil)
  }
];

  return (
    <MapContainer
      center={[28.61, 77.20]}
      zoom={5}
      className="h-[400px] w-full rounded-2xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {zones.map((zone, i) => (
        <CircleMarker
          key={i}
          center={[zone.lat, zone.lon]}
          radius={20}
          pathOptions={{
            color: getColor(zone.risk),
            fillOpacity: 0.6,
          }}
        >
          <Popup>
            <strong>Zone {i + 1}</strong> <br />
            Risk: {zone.risk}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}