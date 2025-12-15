import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { seedIfEmpty, getReferences, getComparables } from "../market/storage";
import type { Comparable, ReferenceValue, ValuationInput } from "../market/types";
import { pickComparables, runValuation } from "../market/calc";
import { ComparableCard } from "../components/market/ComparableCard";
import { ResultPanel } from "../components/market/ResultPanel";
import { ComparablesMap } from "../components/market/ComparablesMap";

type MatchMode = "RELAX" | "STRICT";
type Step = "ADDRESS" | "DETAILS";

type LatLng = { lat: number; lng: number };

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
};

export default function QuickValuerRoute() {
  const [refs, setRefs] = useState<ReferenceValue[]>([]);
  const [cmps, setCmps] = useState<Comparable[]>([]);

  const [step, setStep] = useState<Step>("ADDRESS");

  const [matchMode, setMatchMode] = useState<MatchMode>("RELAX");
  const [limit, setLimit] = useState<number>(6);

  // tolerancias (para “RELAX”)
  const [tolAreaPct, setTolAreaPct] = useState<number>(25); // ±%
  const [tolAgeYears, setTolAgeYears] = useState<number>(15); // ±años
  const [tolRooms, setTolRooms] = useState<number>(1); // ±amb

  // filtros extra
  const [onlyGarage, setOnlyGarage] = useState(false);
  const [onlyBalcony, setOnlyBalcony] = useState(false);

  const [input, setInput] = useState<ValuationInput>({
    zone: "Palermo",
    operation: "VENTA",
    propertyType: "DEPTO",
    currency: "USD",
    areaM2: 70,
    rooms: 3,
    ageYears: 12,
    condition: "MUY_BUENO",
    hasGarage: false,
    hasBalcony: true,
  });

  // Dirección → pin (geocoding)
  const [address, setAddress] = useState<string>("");
  const [pin, setPin] = useState<LatLng | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    seedIfEmpty();
    setRefs(getReferences());
    setCmps(getComparables());
  }, []);

  const filteredCmps = useMemo(() => {
    const zoneNeedle = (input.zone ?? "").trim().toLowerCase();

    const base = cmps
      .filter((c) => c.operation === input.operation)
      .filter((c) => c.propertyType === input.propertyType)
      .filter((c) => c.currency === input.currency)
      .filter((c) =>
        zoneNeedle ? (c.zone ?? "").trim().toLowerCase() === zoneNeedle : true
      );

    if (matchMode === "STRICT") {
      return base
        .filter((c) =>
          typeof input.rooms === "number" ? c.rooms === input.rooms : true
        )
        .filter((c) =>
          typeof input.ageYears === "number" ? c.ageYears === input.ageYears : true
        )
        .filter((c) => (input.condition ? c.condition === input.condition : true))
        .filter((c) => (onlyGarage ? !!c.hasGarage : true))
        .filter((c) => (onlyBalcony ? !!c.hasBalcony : true));
    }

    const minArea = input.areaM2 * (1 - tolAreaPct / 100);
    const maxArea = input.areaM2 * (1 + tolAreaPct / 100);

    return base
      .filter((c) => c.areaM2 >= minArea && c.areaM2 <= maxArea)
      .filter((c) =>
        typeof input.rooms === "number" && typeof c.rooms === "number"
          ? Math.abs(c.rooms - input.rooms) <= tolRooms
          : true
      )
      .filter((c) =>
        typeof input.ageYears === "number" && typeof c.ageYears === "number"
          ? Math.abs(c.ageYears - input.ageYears) <= tolAgeYears
          : true
      )
      // condición: preferencia (no filtro duro) — la dejás para ponderar en pickComparables si querés
      .filter((c) => (onlyGarage ? !!c.hasGarage : true))
      .filter((c) => (onlyBalcony ? !!c.hasBalcony : true));
  }, [
    cmps,
    input,
    matchMode,
    tolAreaPct,
    tolAgeYears,
    tolRooms,
    onlyGarage,
    onlyBalcony,
  ]);

  const comparables = useMemo(
    () => pickComparables(filteredCmps, input, limit),
    [filteredCmps, input, limit]
  );

  const result = useMemo(
    () => runValuation(input, refs, comparables),
    [input, refs, comparables]
  );

  async function geocodeAddress() {
    const q = address.trim();
    if (!q) return;

    setGeoError(null);
    setGeoLoading(true);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        q + ", Argentina"
      )}`;

      const res = await fetch(url, { headers: { "Accept-Language": "es" } });
      const data: any[] = await res.json();

      if (!data?.length) {
        setGeoError("No encontré esa dirección. Probá agregando ciudad/barrio.");
        setPin(null);
        return;
      }

      const lat = Number(data[0].lat);
      const lng = Number(data[0].lon);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        setGeoError("La dirección devolvió coordenadas inválidas.");
        setPin(null);
        return;
      }

      setPin({ lat, lng });
      setStep("DETAILS"); // ✅ acá aparece lo demás con animación
    } catch {
      setGeoError("Error al buscar la dirección.");
      setPin(null);
    } finally {
      setGeoLoading(false);
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Tasador rápido</h1>
          <p className="text-slate-400 mt-1">
            Dirección → mapa → datos → valuación (demo).
          </p>
        </div>

        {step === "DETAILS" && (
          <button
            type="button"
            onClick={() => {
              setStep("ADDRESS");
              // opcional: limpiar dirección/pin
              // setAddress("");
              // setPin(null);
            }}
            className="text-sm px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-200 hover:border-sky-400 transition"
          >
            Cambiar dirección
          </button>
        )}
      </div>

      {/* PASO 1: Dirección */}
      <AnimatePresence mode="wait">
        {step === "ADDRESS" && (
          <motion.div
            key="address-step"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit="exit"
            className="max-w-xl mx-auto mt-10 rounded-2xl border border-slate-800 bg-slate-950 p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-2">
              ¿Dónde está el inmueble?
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Ingresá la dirección para ubicarlo en el mapa y continuar.
            </p>

            <div className="flex gap-2">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej: Av. Santa Fe 1234, CABA"
                className="flex-1 px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                onKeyDown={(e) => e.key === "Enter" && geocodeAddress()}
              />
              <button
                type="button"
                onClick={geocodeAddress}
                disabled={geoLoading || !address.trim()}
                className="px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 disabled:opacity-60 transition text-white font-medium"
              >
                {geoLoading ? "Buscando…" : "Continuar"}
              </button>
            </div>

            {geoError && <div className="mt-3 text-sm text-rose-300">{geoError}</div>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PASO 2: Form completo + resultados */}
      <AnimatePresence>
        {step === "DETAILS" && (
          <motion.div
            key="details-step"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit="exit"
            className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* FORM COMPLETO (todo lo que ya tenías) */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
            >
              <motion.div variants={fadeUp} className="text-white font-semibold">
                Datos
              </motion.div>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <motion.div variants={fadeUp}>
                  <label className="block text-sm text-slate-300 mb-1">Zona</label>
                  <input
                    value={input.zone}
                    onChange={(e) => setInput((s) => ({ ...s, zone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                  />
                </motion.div>

                <motion.div variants={fadeUp}>
                  <label className="block text-sm text-slate-300 mb-1">Dirección</label>
                  <div className="flex gap-2">
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ej: Av. Santa Fe 1234, CABA"
                      className="flex-1 px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                      onKeyDown={(e) => e.key === "Enter" && geocodeAddress()}
                    />
                    <button
                      type="button"
                      onClick={geocodeAddress}
                      disabled={geoLoading || !address.trim()}
                      className="px-3 py-2 rounded-md bg-slate-900/60 hover:bg-slate-900 text-slate-200 border border-slate-800 transition"
                      title="Volver a ubicar"
                    >
                      {geoLoading ? "…" : "Ubicar"}
                    </button>
                  </div>

                  {geoError && (
                    <div className="mt-2 text-sm text-rose-300">{geoError}</div>
                  )}

                  {pin && (
                    <div className="mt-2 text-xs text-slate-400">
                      Pin:{" "}
                      <span className="text-slate-200">
                        {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)}
                      </span>
                    </div>
                  )}
                </motion.div>

                <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Operación</label>
                    <select
                      value={input.operation}
                      onChange={(e) =>
                        setInput((s) => ({ ...s, operation: e.target.value as any }))
                      }
                      className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                    >
                      <option value="VENTA">Venta</option>
                      <option value="ALQUILER">Alquiler</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Tipo</label>
                    <select
                      value={input.propertyType}
                      onChange={(e) =>
                        setInput((s) => ({ ...s, propertyType: e.target.value as any }))
                      }
                      className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                    >
                      <option value="DEPTO">Depto</option>
                      <option value="CASA">Casa</option>
                    </select>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Moneda</label>
                    <select
                      value={input.currency}
                      onChange={(e) =>
                        setInput((s) => ({ ...s, currency: e.target.value as any }))
                      }
                      className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                    >
                      <option value="USD">USD</option>
                      <option value="ARS">ARS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-1">m²</label>
                    <input
                      type="number"
                      value={input.areaM2}
                      onChange={(e) =>
                        setInput((s) => ({ ...s, areaM2: Number(e.target.value) }))
                      }
                      className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                    />
                  </div>
                </motion.div>

                {/* MÁS CAMPOS */}
                <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Ambientes</label>
                    <input
                      type="number"
                      value={input.rooms ?? ""}
                      onChange={(e) =>
                        setInput((s) => ({
                          ...s,
                          rooms: e.target.value === "" ? undefined : Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Antig.</label>
                    <input
                      type="number"
                      value={input.ageYears ?? ""}
                      onChange={(e) =>
                        setInput((s) => ({
                          ...s,
                          ageYears: e.target.value === "" ? undefined : Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-1">Estado</label>
                    <select
                      value={input.condition ?? "MUY_BUENO"}
                      onChange={(e) =>
                        setInput((s) => ({ ...s, condition: e.target.value as any }))
                      }
                      className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                    >
                      <option value="A_REFACCIONAR">A refaccionar</option>
                      <option value="BUENO">Bueno</option>
                      <option value="MUY_BUENO">Muy bueno</option>
                      <option value="A_ESTRENAR">A estrenar</option>
                    </select>
                  </div>
                </motion.div>

                {/* CHECKS */}
                <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-slate-200">
                    <input
                      type="checkbox"
                      checked={!!input.hasGarage}
                      onChange={(e) =>
                        setInput((s) => ({ ...s, hasGarage: e.target.checked }))
                      }
                    />
                    Cochera (preferencia)
                  </label>

                  <label className="flex items-center gap-2 text-slate-200">
                    <input
                      type="checkbox"
                      checked={!!input.hasBalcony}
                      onChange={(e) =>
                        setInput((s) => ({ ...s, hasBalcony: e.target.checked }))
                      }
                    />
                    Balcón (preferencia)
                  </label>
                </motion.div>

                {/* Matching + tolerancias */}
                <motion.div
                  variants={fadeUp}
                  className="mt-2 rounded-xl border border-slate-800 bg-slate-900/30 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-slate-200 text-sm font-medium">Matching</div>
                    <select
                      value={matchMode}
                      onChange={(e) => setMatchMode(e.target.value as MatchMode)}
                      className="px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                    >
                      <option value="RELAX">Relax (tolerancias)</option>
                      <option value="STRICT">Estricto</option>
                    </select>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 text-slate-200 text-sm">
                      <input
                        type="checkbox"
                        checked={onlyGarage}
                        onChange={(e) => setOnlyGarage(e.target.checked)}
                      />
                      Solo con cochera
                    </label>
                    <label className="flex items-center gap-2 text-slate-200 text-sm">
                      <input
                        type="checkbox"
                        checked={onlyBalcony}
                        onChange={(e) => setOnlyBalcony(e.target.checked)}
                      />
                      Solo con balcón
                    </label>
                  </div>

                  {matchMode === "RELAX" && (
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">± Área %</label>
                        <input
                          type="number"
                          value={tolAreaPct}
                          onChange={(e) => setTolAreaPct(Number(e.target.value))}
                          className="w-full px-2 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">± Años</label>
                        <input
                          type="number"
                          value={tolAgeYears}
                          onChange={(e) => setTolAgeYears(Number(e.target.value))}
                          className="w-full px-2 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">± Amb</label>
                        <input
                          type="number"
                          value={tolRooms}
                          onChange={(e) => setTolRooms(Number(e.target.value))}
                          className="w-full px-2 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-slate-400 text-xs">Cantidad de comparables</div>
                    <input
                      type="number"
                      value={limit}
                      min={1}
                      max={20}
                      onChange={(e) => setLimit(Number(e.target.value))}
                      className="w-24 px-2 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500 text-right"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* RESULTADO + MAPA + LISTA */}
            <motion.div variants={fadeUp} className="lg:col-span-2 space-y-6">
              <ResultPanel r={result} />

              <ComparablesMap zone={input.zone} comparables={comparables} pin={pin} />

              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-semibold">Comparables</h2>
                  <div className="text-slate-400 text-sm">
                    {comparables.length} encontrados
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comparables.map((c) => (
                    <ComparableCard key={c.id} c={c} />
                  ))}
                  {comparables.length === 0 && (
                    <div className="text-slate-400">
                      No hay comparables con esos filtros.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
