import type { FC } from "react";
import { motion } from "framer-motion";
import CityPulseMap from "../map/CityPulseMap";

const IntroAnimacionMapa: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full flex flex-col items-center justify-center py-6"
    >
      {/* Contenedor relativo con z-0 para que el mapa quede detrás del navbar */}
      <div className="relative w-full max-w-3xl h-64 md:h-80 border border-slate-800 bg-slate-900/80 z-0">
        <CityPulseMap />
      </div>
    </motion.div>
  );
};

export default IntroAnimacionMapa;
