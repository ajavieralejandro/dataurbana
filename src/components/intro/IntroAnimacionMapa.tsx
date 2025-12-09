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
      <div className="w-full max-w-3xl h-64 md:h-80 border border-slate-800 bg-slate-900/80">
        <CityPulseMap />
      </div>
    </motion.div>
  );
};

export default IntroAnimacionMapa;
