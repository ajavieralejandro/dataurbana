// src/routes/Dashboard.tsx
import type { FC } from "react";
import ArgentinaMap from "../map/ArgentinaMap";
import MarketSessionPanel from "../analytics/MarketSessionPanel"; // 👈 SIN la “s” acá

const Dashboard: FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">
        Dashboard de mercado
      </h1>

      <p className="text-sm text-slate-300 mb-6">
        Explorá el mapa interactivo y la dinámica reciente del mercado: precios
        por barrio y variaciones en distintos períodos.
      </p>

      {/* Mapa cerca de CABA con valores hardcodeados */}
      <div className="w-full h-96 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden mb-8">
        <ArgentinaMap />
      </div>

      {/* Panel de sesiones animado */}
      <MarketSessionPanel />
    </div>
  );
};

export default Dashboard;
