// src/routes/Dashboard.tsx
import type { FC } from "react";
import CityPulseMap from "../components/map/CityPulseMap";
// si todavía usás ArgentinaMap, podés cambiar CityPulseMap por ArgentinaMap
import MarketSessionPanel from "../components/analytics/MarketSessionPanel";
import MarketHighlightCards from "../components/analytics/MarketHighlightCards";

const Dashboard: FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">
        Dashboard de mercado
      </h1>

      <p className="text-sm text-slate-300 mb-6">
        Resumen del mercado inmobiliario de CABA: indicadores clave, mapa por
        barrios y variaciones en distintos períodos.
      </p>

      {/* 🔹 Tarjetas resumen arriba */}
      <MarketHighlightCards />

      {/* 🔹 Mapa creativo / ArgentinaMap en el medio */}
      <div className="w-full h-96 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden mb-8">
        <CityPulseMap />
        {/* O: <ArgentinaMap /> si preferís el otro */}
      </div>

      {/* 🔹 Sesiones animadas abajo */}
      <MarketSessionPanel />
    </div>
  );
};

export default Dashboard;
