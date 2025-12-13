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

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const card = {
  hidden: { opacity: 0, y: 8, scale: 0.99 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
};

const StatsStrip: FC = () => {
  return (
    <motion.div
      variants={grid}
      initial="hidden"
      animate="show"
      className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
    >
      {stats.map((item) => (
        <motion.div
          key={item.label}
          variants={card}
          whileHover={{
            y: -2,
            scale: 1.02,
            boxShadow: "0 10px 35px rgba(0,0,0,0.45)",
          }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="relative overflow-hidden bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 shadow-xl text-center"
        >
          {/* Glow overlay */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              background:
                "radial-gradient(600px circle at 50% 0%, rgba(56,189,248,0.25), transparent 45%)",
            }}
          />

          {/* Borde sutil */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl"
            whileHover={{ boxShadow: "inset 0 0 0 1px rgba(56,189,248,0.35)" }}
            transition={{ duration: 0.2 }}
          />

          <div className="relative">
            <div className="text-xs text-slate-400">{item.label}</div>
            <div className="text-xl font-semibold mt-1 text-slate-50">
              {item.value}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsStrip;
