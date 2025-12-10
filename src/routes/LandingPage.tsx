import type { FC } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import IntroAnimacionMapa from "../components/intro/IntroAnimacionMapa";
import StatsStrip from "../components/intro/StatsStrip";
import {
  Home,
  Building2,
  Square,
  Warehouse,
  BriefcaseBusiness,
  Landmark,
  Sprout,
  Car,
} from "lucide-react";

const categorias = [
  { name: "Casas", icon: Home },
  { name: "Departamentos", icon: Building2 },
  { name: "Terrenos", icon: Square },
  { name: "Galpones", icon: Warehouse },
  { name: "Fondo de comercio", icon: BriefcaseBusiness },
  { name: "Locales - Oficinas", icon: Landmark },
  { name: "Agro", icon: Sprout },
  { name: "Vehículos", icon: Car },
];

const LandingPage: FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
      {/* HERO PRINCIPAL */}
      <div className="grid md:grid-cols-[1.1fr,1fr] gap-10 items-center">
        {/* Columna izquierda */}
        <div className="space-y-7 -mt-6">
          {" "}
          {/* 👈 SUBE SOLO ESTE BLOQUE */}
          {/* Badge arriba */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-sm text-slate-300"
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
            className="text-sm md:text-base text-slate-300 leading-relaxed mt-5"
          >
            Visualizá precios por m², detectá oportunidades por barrio y seguí
            la evolución del mercado sobre un mapa interactivo de Argentina.
          </motion.p>
          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap items-center gap-4 mt-6"
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium bg-sky-500 hover:bg-sky-400 transition shadow-md shadow-sky-500/10"
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
              className="px-4 py-2 rounded-xl text-sm font-medium bg-sky-500 hover:bg-sky-400 shadow-md shadow-sky-500/30 transition"
            >
              Buscar
            </button>
          </form>
        </motion.div>
        {/* 📌 SECCIÓN DE CATEGORÍAS */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categorias.map(({ name, icon: Icon }) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 20px 8px rgba(56, 189, 248, 0.45)",
                }}
                className="relative bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-6 text-center shadow-xl text-slate-50 font-medium transition duration-300 cursor-pointer flex flex-col items-center gap-3"
              >
                <Icon className="w-7 h-7 text-sky-400" />
                {name}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 📌 SECCIÓN COTIZACIÓN */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-5 shadow-xl"
        >
          <h2 className="text-sm md:text-base font-semibold text-slate-100 mb-3">
            Cotizaciones del día
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Dólar Oficial — VERDE */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-md">
              <span className="text-sm font-semibold text-slate-100">
                Dólar Oficial
              </span>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-400">Compra</span>
                <span className="font-semibold text-emerald-400">$ 990</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-400">Venta</span>
                <span className="font-semibold text-emerald-400">$ 1.050</span>
              </div>
            </div>

            {/* Dólar Blue — CELESTE */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-md">
              <span className="text-sm font-semibold text-slate-100">
                Dólar Blue
              </span>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-400">Compra</span>
                <span className="font-semibold text-sky-400">$ 1.280</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-400">Venta</span>
                <span className="font-semibold text-sky-400">$ 1.320</span>
              </div>
            </div>

            {/* Dólar MEP — AMARILLO */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-md">
              <span className="text-sm font-semibold text-slate-100">
                Dólar MEP
              </span>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-400">Compra</span>
                <span className="font-semibold text-yellow-400">$ 1.240</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-400">Venta</span>
                <span className="font-semibold text-yellow-400">$ 1.260</span>
              </div>
            </div>

            {/* Dólar CCL — ROJO */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-md">
              <span className="text-sm font-semibold text-slate-100">
                Dólar CCL
              </span>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-400">Compra</span>
                <span className="font-semibold text-rose-400">$ 1.300</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-400">Venta</span>
                <span className="font-semibold text-rose-400">$ 1.330</span>
              </div>
            </div>

            {/* USDT (Cripto) — FUXIA */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-md">
              <span className="text-sm font-semibold text-slate-100">
                USDT (Cripto)
              </span>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-400">Compra</span>
                <span className="font-semibold text-fuchsia-400">$ 1.270</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-400">Venta</span>
                <span className="font-semibold text-fuchsia-400">$ 1.300</span>
              </div>
            </div>

            {/* Bitcoin — NARANJA */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-md">
              <span className="text-sm font-semibold text-slate-100">
                Bitcoin (USD)
              </span>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-400">Precio</span>
                <span className="font-semibold text-orange-400">
                  US$ 96.500
                </span>
              </div>
            </div>
          </div>

          <p className="text-[0.7rem] text-slate-500 mt-2">
            Valores estimados · Podés reemplazar con API real cuando quieras.
          </p>
        </motion.div>

        {/* 📌 SECCIÓN DE FEATURES */}
        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-slate-100 mb-4">
            Qué podés hacer
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
                color: "text-sky-400",
              },
              {
                title: "Variaciones y sesiones",
                desc: "Compará 3, 6, 12 meses y año en curso.",
                color: "text-sky-400",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  boxShadow: "0 0 20px 8px rgba(56, 189, 248, 0.45)", // 💙 destello celeste
                }}
                transition={{ duration: 0.3 }}
                className="relative bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-6 shadow-xl text-slate-50 transition duration-300 cursor-pointer"
              >
                <div
                  className={`text-sm md:text-base uppercase tracking-wide mb-2 ${card.color}`}
                >
                  {card.title}
                </div>
                <p className="text-sm md:text-base text-slate-300">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* GALERÍA DE IMÁGENES (con imágenes reales de Internet) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-lg md:text-xl font-semibold text-slate-100 mb-4">
            Destacados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Imagen 1 */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative h-44 rounded-2xl overflow-hidden border border-slate-800"
            >
              <img
                src="https://images.unsplash.com/photo-1528543606781-2f6e6857f318?auto=format&fit=crop&w=800&q=80"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <p className="absolute bottom-2 left-3 text-m text-slate-200">
                Mapa interactivo con valores por m².
              </p>
            </motion.div>

            {/* Imagen 2 */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative h-44 rounded-2xl overflow-hidden border border-slate-800"
            >
              <img
                src="https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=800&q=80"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <p className="absolute bottom-2 left-3 text-m text-slate-200">
                Sesiones y variaciones del mercado.
              </p>
            </motion.div>

            {/* Imagen 3 */}
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="relative h-44 rounded-2xl overflow-hidden border border-slate-800"
            >
              <img
                src="https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <p className="absolute bottom-2 left-3 text-m text-slate-200">
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
