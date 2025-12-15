import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Comparable } from "../../market/types";

type LatLng = { lat: number; lng: number };

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

function FlyTo({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 0.8 });
  }, [center, zoom, map]);

  return null;
}

export function ComparablesMap({
  zone,
  comparables,
  pin,
}: {
  zone: string;
  comparables: Comparable[];
  pin?: LatLng | null;
}) {
  const pts = useMemo(
    () => comparables.filter((c) => typeof c.lat === "number" && typeof c.lng === "number"),
    [comparables]
  );

  const comparablesCenter = useMemo<LatLngExpression>(() => {
    if (pts.length === 0) return fallbackCenter;

    const lat = pts.reduce((acc, c) => acc + (c.lat as number), 0) / pts.length;
    const lng = pts.reduce((acc, c) => acc + (c.lng as number), 0) / pts.length;
    return [lat, lng] as LatLngExpression;
  }, [pts]);

  // ✅ centro “activo” estable: si hay pin, manda el pin; si no, centro por comparables
  const activeCenter = useMemo<LatLngExpression>(() => {
    if (pin && Number.isFinite(pin.lat) && Number.isFinite(pin.lng)) {
      return [pin.lat, pin.lng] as LatLngExpression;
    }
    return comparablesCenter;
  }, [pin?.lat, pin?.lng, comparablesCenter]);

  const activeZoom = pin ? 15 : 13;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-white font-semibold">Mapa de comparables</div>
          <div className="text-slate-400 text-sm">Zona: {zone}</div>
        </div>
        <div className="text-slate-400 text-sm">
          {pts.length} pins{pin ? " · +1 tasado" : ""}
        </div>
      </div>

      <div className="h-[360px]">
        <MapContainer
          center={activeCenter}
          zoom={activeZoom}
          scrollWheelZoom
          className="w-full h-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ✅ mover cuando cambia activeCenter */}
          <FlyTo center={activeCenter} zoom={activeZoom} />

          {/* ✅ marcador del inmueble tasado */}
          {pin && Number.isFinite(pin.lat) && Number.isFinite(pin.lng) && (
            <Marker position={[pin.lat, pin.lng]}>
              <Popup>
                <div style={{ fontSize: 13 }}>
                  <div style={{ fontWeight: 700 }}>Inmueble tasado</div>
                  <div>
                    {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* ✅ comparables */}
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
