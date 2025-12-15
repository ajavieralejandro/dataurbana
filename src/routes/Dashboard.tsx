// src/routes/Dashboard.tsx
import type { FC } from "react";
import { Link } from "react-router-dom";

import CityPulseMap from "../components/map/CityPulseMap";
import MarketSessionPanel from "../components/analytics/MarketSessionPanel";
import MarketHighlightCards from "../components/analytics/MarketHighlightCards";

const Dashboard: FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header + acciones */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-100">
            Dashboard de mercado
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Indicadores clave, mapa por zonas y sesiones del mercado.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/tasador"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium bg-sky-500 hover:bg-sky-400 transition shadow-md shadow-sky-500/20"
          >
            Ir al tasador
          </Link>

          <Link
            to="/valores"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium bg-slate-900/70 border border-slate-700 text-slate-200 hover:border-sky-400 transition"
          >
            Valores de referencia
          </Link>
        </div>
      </div>

      {/* Tarjetas resumen */}
      <div className="mb-6">
        <MarketHighlightCards />
      </div>

      {/* Mapa */}
      <div className="w-full h-96 rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden mb-8">
        <CityPulseMap />
      </div>

      {/* Panel de sesiones */}
      <MarketSessionPanel />
    </div>
  );
};

export default Dashboard;
