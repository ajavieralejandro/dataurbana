import type { FC } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

interface NeighborhoodStat {
  name: string;
  coords: LatLngExpression;
  avgPriceUsdM2: number; // precio promedio por m²
  avgRentUsd: number;    // alquiler promedio 2 amb, por ejemplo
}

const cabaCenter: LatLngExpression = [-34.6037, -58.3816]; // Obelisco aprox

// 🔢 Datos hardcodeados de ejemplo (podés cambiarlos después)
const neighborhoods: NeighborhoodStat[] = [
  {
    name: "Palermo",
    coords: [-34.5794, -58.4259],
    avgPriceUsdM2: 2600,
    avgRentUsd: 650,
  },
  {
    name: "Recoleta",
    coords: [-34.5884, -58.3925],
    avgPriceUsdM2: 2800,
    avgRentUsd: 700,
  },
  {
    name: "Caballito",
    coords: [-34.6186, -58.4420],
    avgPriceUsdM2: 2200,
    avgRentUsd: 550,
  },
  {
    name: "Belgrano",
    coords: [-34.5614, -58.4584],
    avgPriceUsdM2: 2500,
    avgRentUsd: 630,
  },
];

const ArgentinaMap: FC = () => {
  return (
    <MapContainer
      center={cabaCenter}
      zoom={12}              // 👈 Zoom más cerca de la ciudad
      scrollWheelZoom
      className="w-full h-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {neighborhoods.map((n) => (
        <Marker key={n.name} position={n.coords}>
          <Popup>
            <div style={{ fontSize: "0.85rem" }}>
              <strong>{n.name}</strong>
              <br />
              Precio prom. venta: <strong>US$ {n.avgPriceUsdM2.toLocaleString()} / m²</strong>
              <br />
              Alquiler prom. 2 amb.: <strong>US$ {n.avgRentUsd.toLocaleString()}</strong>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ArgentinaMap;
