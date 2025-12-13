import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";

interface NeighborhoodStat {
  name: string;
  coords: LatLngExpression;
  avgPriceUsdM2: number;
  avgRentUsd: number;
  trend: "up" | "down" | "flat";
}

const cabaCenter: LatLngExpression = [-34.6037, -58.3816];

const neighborhoods: NeighborhoodStat[] = [
  { name: "Palermo", coords: [-34.5794, -58.4259], avgPriceUsdM2: 2600, avgRentUsd: 650, trend: "up" },
  { name: "Recoleta", coords: [-34.5884, -58.3925], avgPriceUsdM2: 2800, avgRentUsd: 700, trend: "flat" },
  { name: "Caballito", coords: [-34.6186, -58.442], avgPriceUsdM2: 2200, avgRentUsd: 550, trend: "up" },
  { name: "Belgrano", coords: [-34.5614, -58.4584], avgPriceUsdM2: 2500, avgRentUsd: 630, trend: "down" },
];

const CityPulseMap: FC = () => {
  const [active, setActive] = useState<NeighborhoodStat | null>(null);

  // ✅ Evita crash en el primer render / StrictMode: render del mapa solo “en cliente”
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const getRadius = (avgPriceUsdM2: number): number => 8 + (avgPriceUsdM2 - 2000) / 150;

  const trendLabel = (trend: NeighborhoodStat["trend"]): string => {
    if (trend === "up") return "En alza";
    if (trend === "down") return "En baja";
    return "Estable";
  };

  const safeNeighborhoods = useMemo(() => neighborhoods, []);

  if (!mounted) {
    // Skeleton visual mientras monta
    return (
      <div className="w-full h-full rounded-3xl border border-slate-800 bg-slate-900/40 animate-pulse" />
    );
  }

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden">
      <MapContainer
        center={cabaCenter}
        zoom={12}
        scrollWheelZoom
        className="w-full h-full"
        // ✅ Leaflet a veces necesita invalidar size si el contenedor aparece luego
        whenReady={(e) => {
          e.target.invalidateSize();
          e.target.on("click", () => setActive(null));
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {safeNeighborhoods.map((n) => (
          <CircleMarker
            key={n.name}
            center={n.coords}
            radius={getRadius(n.avgPriceUsdM2)}
            pathOptions={{
              color: "#38bdf8",
              fillColor: "#38bdf8",
              fillOpacity: 0.35,
            }}
            eventHandlers={{
              click: (e) => {
                e.originalEvent.stopPropagation();
                setActive((prev) => (prev?.name === n.name ? null : n));
              },
              mouseover: () => setActive(n),
            }}
          >
            <Popup>
              <div style={{ fontSize: "0.85rem" }}>
                <strong>{n.name}</strong>
                <br />
                Prom. venta:{" "}
                <span className="text-sky-700 font-bold">
                  US$ {n.avgPriceUsdM2.toLocaleString()} / m²
                </span>
                <br />
                Prom. alquiler 2 amb.:{" "}
                <span className="text-sky-700 font-bold">
                  US$ {n.avgRentUsd.toLocaleString()}
                </span>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <AnimatePresence>
        {active && (
          <motion.div
            key={active.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
            className="absolute left-4 bottom-4 bg-slate-950/90 border border-sky-500/40 rounded-2xl px-4 py-3 text-xs md:text-sm text-slate-100 shadow-xl max-w-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold">{active.name}</span>
              <span
                className={
                  active.trend === "up"
                    ? "text-emerald-400"
                    : active.trend === "down"
                    ? "text-rose-400"
                    : "text-slate-400"
                }
              >
                ● {trendLabel(active.trend)}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span>
                Venta prom.:{" "}
                <span className="text-sky-700 font-bold">
                  US$ {active.avgPriceUsdM2.toLocaleString()} / m²
                </span>
              </span>
              <span>
                Alquiler 2 amb.:{" "}
                <span className="text-sky-700 font-bold">
                  US$ {active.avgRentUsd.toLocaleString()}
                </span>
              </span>
            </div>

            <div className="mt-2 text-[0.7rem] text-slate-400">
              Datos demo hardcodeados. Después los conectamos al motor real de mercado.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CityPulseMap;
