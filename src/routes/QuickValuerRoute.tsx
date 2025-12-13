import { useEffect, useMemo, useState } from "react";
import { seedIfEmpty, getReferences, getComparables } from "../market/storage";
import type { Comparable, ReferenceValue, ValuationInput } from "../market/types";
import { pickComparables, runValuation } from "../market/calc";
import { ComparableCard } from "../components/market/ComparableCard";
import { ResultPanel } from "../components/market/ResultPanel";
import { ComparablesMap } from "../components/market/ComparablesMap";

type MatchMode = "RELAX" | "STRICT";

export default function QuickValuerRoute() {
  const [refs, setRefs] = useState<ReferenceValue[]>([]);
  const [cmps, setCmps] = useState<Comparable[]>([]);

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

  useEffect(() => {
    seedIfEmpty();
    setRefs(getReferences());
    setCmps(getComparables());
  }, []);

  const filteredCmps = useMemo(() => {
    const base = cmps
      .filter((c) => c.operation === input.operation)
      .filter((c) => c.propertyType === input.propertyType)
      .filter((c) => c.currency === input.currency)
      .filter((c) => (input.zone?.trim() ? c.zone === input.zone.trim() : true));

    if (matchMode === "STRICT") {
      // estricto: mismos rooms/age si están definidos
      return base
        .filter((c) => (typeof input.rooms === "number" ? c.rooms === input.rooms : true))
        .filter((c) => (typeof input.ageYears === "number" ? c.ageYears === input.ageYears : true))
        .filter((c) => (input.condition ? c.condition === input.condition : true))
        .filter((c) => (onlyGarage ? !!c.hasGarage : true))
        .filter((c) => (onlyBalcony ? !!c.hasBalcony : true));
    }

    // relax: tolerancias
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
      .filter((c) => (input.condition ? true : true)) // condición la dejamos como “preferencia” (no filtro duro)
      .filter((c) => (onlyGarage ? !!c.hasGarage : true))
      .filter((c) => (onlyBalcony ? !!c.hasBalcony : true));
  }, [cmps, input, matchMode, tolAreaPct, tolAgeYears, tolRooms, onlyGarage, onlyBalcony]);

  const comparables = useMemo(
    () => pickComparables(filteredCmps, input, limit),
    [filteredCmps, input, limit]
  );

  const result = useMemo(
    () => runValuation(input, refs, comparables),
    [input, refs, comparables]
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Tasador rápido</h1>
        <p className="text-slate-400 mt-1">Referencia + comparables + ajustes simples (demo).</p>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <div className="text-white font-semibold">Datos</div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Zona</label>
              <input
                value={input.zone}
                onChange={(e) => setInput((s) => ({ ...s, zone: e.target.value }))}
                className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Operación</label>
                <select
                  value={input.operation}
                  onChange={(e) => setInput((s) => ({ ...s, operation: e.target.value as any }))}
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
                  onChange={(e) => setInput((s) => ({ ...s, propertyType: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                >
                  <option value="DEPTO">Depto</option>
                  <option value="CASA">Casa</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Moneda</label>
                <select
                  value={input.currency}
                  onChange={(e) => setInput((s) => ({ ...s, currency: e.target.value as any }))}
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
                  onChange={(e) => setInput((s) => ({ ...s, areaM2: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* MÁS CAMPOS */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Ambientes</label>
                <input
                  type="number"
                  value={input.rooms ?? 0}
                  onChange={(e) => setInput((s) => ({ ...s, rooms: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Antig.</label>
                <input
                  type="number"
                  value={input.ageYears ?? 0}
                  onChange={(e) => setInput((s) => ({ ...s, ageYears: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Estado</label>
                <select
                  value={input.condition ?? "MUY_BUENO"}
                  onChange={(e) => setInput((s) => ({ ...s, condition: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
                >
                  <option value="A_REFACCIONAR">A refaccionar</option>
                  <option value="BUENO">Bueno</option>
                  <option value="MUY_BUENO">Muy bueno</option>
                  <option value="A_ESTRENAR">A estrenar</option>
                </select>
              </div>
            </div>

            {/* CHECKS */}
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 text-slate-200">
                <input
                  type="checkbox"
                  checked={!!input.hasGarage}
                  onChange={(e) => setInput((s) => ({ ...s, hasGarage: e.target.checked }))}
                />
                Cochera (preferencia)
              </label>
              <label className="flex items-center gap-2 text-slate-200">
                <input
                  type="checkbox"
                  checked={!!input.hasBalcony}
                  onChange={(e) => setInput((s) => ({ ...s, hasBalcony: e.target.checked }))}
                />
                Balcón (preferencia)
              </label>
            </div>

            {/* MODO + FILTROS */}
            <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900/30 p-3">
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
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div className="lg:col-span-2 space-y-6">
          <ResultPanel r={result} />

          {/* MAPA */}
          <ComparablesMap zone={input.zone} comparables={comparables} />

          {/* Comparables list */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">Comparables</h2>
              <div className="text-slate-400 text-sm">{comparables.length} encontrados</div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {comparables.map((c) => (
                <ComparableCard key={c.id} c={c} />
              ))}
              {comparables.length === 0 && (
                <div className="text-slate-400">No hay comparables con esos filtros.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
