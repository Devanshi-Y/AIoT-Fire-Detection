import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

export default function HeatmapView({ zones }) {

  const getColor = (risk) => {
    if (risk === "red") return "#ef4444";
    if (risk === "yellow") return "#facc15";
    return "#22c55e";
  };

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