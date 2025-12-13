import { useEffect, useMemo, useState } from "react";
import { seedIfEmpty, getReferences, getComparables } from "../market/storage";
import type { Comparable, ReferenceValue } from "../market/types";
import { pickComparables, runValuation } from "../market/calc";
import { ComparableCard } from "../components/market/ComparableCard";
import { ResultPanel } from "../components/market/ResultPanel";

export default function QuickValuerRoute() {
  const [refs, setRefs] = useState<ReferenceValue[]>([]);
  const [cmps, setCmps] = useState<Comparable[]>([]);

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

  const comparables = useMemo(() => pickComparables(cmps, input, 6), [cmps, input]);
  const result = useMemo(() => runValuation(input, refs, comparables), [input, refs, comparables]);

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

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 text-slate-200">
                <input
                  type="checkbox"
                  checked={!!input.hasGarage}
                  onChange={(e) => setInput((s) => ({ ...s, hasGarage: e.target.checked }))}
                />
                Cochera
              </label>
              <label className="flex items-center gap-2 text-slate-200">
                <input
                  type="checkbox"
                  checked={!!input.hasBalcony}
                  onChange={(e) => setInput((s) => ({ ...s, hasBalcony: e.target.checked }))}
                />
                Balcón
              </label>
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div className="lg:col-span-2 space-y-6">
          <ResultPanel r={result} />

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
