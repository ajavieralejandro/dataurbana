import type { FC } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import IntroAnimacionMapa from "../components/intro/IntroAnimacionMapa";
import StatsStrip from "../components/intro/StatsStrip";

const LandingPage: FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
      {/* HERO PRINCIPAL */}
      <div className="grid md:grid-cols-[1.1fr,1fr] gap-10 items-center">
        {/* Columna izquierda */}
        <div className="space-y-5">
          {/* Badge arriba */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-[0.7rem] text-slate-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Versión demo · Datos inmobiliarios CABA / AMBA</span>
          </motion.div>

          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold tracking-tight"
          >
            Analítica inmobiliaria para el{" "}
            <span className="text-sky-400">mercado argentino</span>.
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-sm md:text-base text-slate-300 leading-relaxed"
          >
            Visualizá precios por m², detectá oportunidades por barrio y seguí
            la evolución del mercado sobre un mapa interactivo de Argentina.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mt-4"
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium bg-sky-500 hover:bg-sky-400 transition shadow-lg shadow-sky-500/30"
            >
              Abrir dashboard en vivo
            </Link>

            <span className="text-xs text-slate-400">
              Sin registro · Datos demo.
            </span>
          </motion.div>
        </div>

        {/* Mapa animado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <IntroAnimacionMapa />
          <StatsStrip />
        </motion.div>
      </div>

      {/* SECCIÓN INFERIOR */}
      <div className="mt-12 space-y-12">

        {/* BUSCADOR */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-6 shadow-xl"
        >
          <h2 className="text-sm md:text-base font-semibold text-slate-100 mb-2">
            Buscá zonas y oportunidades
          </h2>

          <form className="grid grid-cols-1 md:grid-cols-[1.2fr,1fr,auto] gap-3">
            <input
              type="text"
              placeholder="Ej: Palermo, Recoleta, Caballito..."
              className="rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-sm focus:border-sky-400 focus:ring-1 focus:ring-sky-500 outline-none"
            />
            <select
              className="rounded-xl bg-slate-900/80 border border-slate-700 px-3 py-2 text-sm focus:border-sky-400 focus:ring-1 focus:ring-sky-500 outline-none"
              defaultValue="venta"
            >
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
              <option value="inversion">Inversión</option>
            </select>
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-sm bg-sky-500 hover:bg-sky-400 shadow-lg shadow-sky-500/30 transition"
            >
              Simular búsqueda
            </button>
          </form>
        </motion.div>

        {/* TARJETAS DE FEATURES */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              title: "Mapa por barrios",
              desc: "Explorá zonas de CABA para ver precios, tendencias y oportunidades.",
              color: "text-sky-400",
            },
            {
              title: "Venta / alquiler / inversión",
              desc: "Cambiá entre los tres modos y descubrí insights específicos.",
              color: "text-emerald-400",
            },
            {
              title: "Variaciones y sesiones",
              desc: "Compará 3, 6, 12 meses y año en curso.",
              color: "text-amber-400",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-4 shadow-xl"
            >
              <div
                className={`text-[0.7rem] uppercase tracking-wide mb-1 ${card.color}`}
              >
                {card.title}
              </div>
              <p className="text-[0.8rem] text-slate-300">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* GALERÍA DE IMÁGENES (con imágenes reales de Internet) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-sm md:text-base font-semibold text-slate-100">
            Cómo se ve en acción
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Imagen 1 */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative h-36 rounded-2xl overflow-hidden border border-slate-800"
            >
              <img
                src="https://images.unsplash.com/photo-1528543606781-2f6e6857f318?auto=format&fit=crop&w=800&q=80"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <p className="absolute bottom-2 left-3 text-xs text-slate-200">
                Mapa interactivo con valores por m².
              </p>
            </motion.div>

            {/* Imagen 2 */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative h-36 rounded-2xl overflow-hidden border border-slate-800"
            >
              <img
                src="https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=800&q=80"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <p className="absolute bottom-2 left-3 text-xs text-slate-200">
                Sesiones y variaciones del mercado.
              </p>
            </motion.div>

            {/* Imagen 3 */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative h-36 rounded-2xl overflow-hidden border border-slate-800"
            >
              <img
                src="https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <p className="absolute bottom-2 left-3 text-xs text-slate-200">
                Ranking de barrios y oportunidades.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
