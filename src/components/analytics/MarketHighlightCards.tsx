import type { FC } from "react";
import { motion } from "framer-motion";

interface HighlightCard {
  id: string;
  label: string;
  value: string;
  detail: string;
  tag: string;
}

const highlights: HighlightCard[] = [
  {
    id: "venta_m2",
    label: "Promedio m² en CABA",
    value: "US$ 2.450",
    detail: "Barrios premium empujan el promedio",
    tag: "Venta",
  },
  {
    id: "alquiler_m2",
    label: "Alquiler 2 amb. CABA",
    value: "US$ 620",
    detail: "Mayor presión en zonas bien ubicadas",
    tag: "Alquiler",
  },
  {
    id: "operaciones_3m",
    label: "Operaciones últimos 3 meses",
    value: "+18%",
    detail: "Recuperación vs. semestre anterior",
    tag: "Actividad",
  },
  {
    id: "oportunidades",
    label: "Barrios con descuento",
    value: "7 zonas",
    detail: "Por debajo del promedio histórico",
    tag: "Oportunidades",
  },
];

const MarketHighlightCards: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      {highlights.map((h) => (
        <motion.div
          key={h.id}
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 shadow-lg flex flex-col gap-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.7rem] uppercase tracking-wide text-slate-400">
              {h.label}
            </span>
            <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30">
              {h.tag}
            </span>
          </div>
          <div className="text-xl font-semibold">{h.value}</div>
          <div className="text-[0.75rem] text-slate-400">{h.detail}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default MarketHighlightCards;
