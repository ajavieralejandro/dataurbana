import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Comparable } from "../../market/types";

const fallbackCenter: LatLngExpression = [-34.6037, -58.3816]; // CABA

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toFixed(0)} ${currency}`;
  }
}

export function ComparablesMap({
  zone,
  comparables,
}: {
  zone: string;
  comparables: Comparable[];
}) {
  const pts = comparables.filter((c) => typeof c.lat === "number" && typeof c.lng === "number");

  const center: LatLngExpression =
    pts.length > 0
      ? ([
          pts.reduce((acc, c) => acc + (c.lat as number), 0) / pts.length,
          pts.reduce((acc, c) => acc + (c.lng as number), 0) / pts.length,
        ] as LatLngExpression)
      : fallbackCenter;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-white font-semibold">Mapa de comparables</div>
          <div className="text-slate-400 text-sm">Zona: {zone}</div>
        </div>
        <div className="text-slate-400 text-sm">{pts.length} pins</div>
      </div>

      <div className="h-[360px]">
        <MapContainer center={center} zoom={13} scrollWheelZoom className="w-full h-full">
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {pts.map((c) => (
            <Marker key={c.id} position={[c.lat as number, c.lng as number]}>
              <Popup>
                <div style={{ fontSize: 13 }}>
                  <div style={{ fontWeight: 700 }}>
                    {c.zone} · {c.propertyType} · {c.operation}
                  </div>
                  <div>
                    {formatMoney(c.price, c.currency)} · {c.areaM2} m²{" "}
                    {typeof c.rooms === "number" ? `· ${c.rooms} amb` : ""}
                  </div>
                  <div>{Math.round(c.price / c.areaM2)} {c.currency}/m²</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {pts.length === 0 && (
            // (No hay overlay nativo simple, lo dejamos como hint visual fuera)
            null
          )}
        </MapContainer>
      </div>

      {pts.length === 0 && (
        <div className="px-5 py-3 text-slate-400 text-sm">
          Estos comparables no tienen lat/lng todavía. Agregalos en `mock.ts` para ver pins.
        </div>
      )}
    </div>
  );
}
