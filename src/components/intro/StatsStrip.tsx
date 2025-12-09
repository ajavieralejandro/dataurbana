import type { FC } from "react";
import { motion } from "framer-motion";

interface StatItem {
  label: string;
  value: string;
}

const stats: StatItem[] = [
  { label: "Promedio m² CABA", value: "US$ 2.150" },
  { label: "Propiedades analizadas", value: "12.540" },
  { label: "Zonas monitoreadas", value: "48" },
];

const StatsStrip: FC = () => {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
    >
      {stats.map((item) => (
        <motion.div
          key={item.label}
          whileHover={{ scale: 1.03 }}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 shadow-xl"
        >
          <div className="text-xs text-slate-400">{item.label}</div>
          <div className="text-xl font-semibold mt-1">{item.value}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsStrip;
