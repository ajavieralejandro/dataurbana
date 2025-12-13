import { useEffect, useMemo, useState } from "react";
import { seedIfEmpty, getReferences } from "../market/storage";
import type { ReferenceValue } from "../market/types";

export default function ReferenceValuesRoute() {
  const [refs, setRefs] = useState<ReferenceValue[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    seedIfEmpty();
    setRefs(getReferences());
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return refs;

    return refs.filter((r: any) => {
      const hay = [
        r.zone,
        r.operation,
        r.propertyType,
        r.currency,
        r.source,
        r.period,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(needle);
    });
  }, [refs, q]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Valores de referencia</h1>
          <p className="text-slate-400 mt-1">
            Tabla demo para inspeccionar referencia por zona/operación/tipo/moneda.
          </p>
        </div>

        <div className="w-full max-w-sm">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar (zona, tipo, moneda...)"
            className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/50 text-slate-300">
              <tr>
                <th className="text-left px-4 py-3">Zona</th>
                <th className="text-left px-4 py-3">Operación</th>
                <th className="text-left px-4 py-3">Tipo</th>
                <th className="text-left px-4 py-3">Moneda</th>
                <th className="text-right px-4 py-3">$/m²</th>
                <th className="text-left px-4 py-3">Fuente</th>
                <th className="text-left px-4 py-3">Periodo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r: any, idx) => (
                <tr key={(r.id ?? idx) as any} className="border-t border-slate-800">
                  <td className="px-4 py-3 text-slate-200">{r.zone ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-200">{r.operation ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-200">{r.propertyType ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-200">{r.currency ?? "—"}</td>
                  <td className="px-4 py-3 text-right text-white font-semibold">
                    {typeof r.pricePerM2 === "number" ? r.pricePerM2.toFixed(0) : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{r.source ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-300">{r.period ?? "—"}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-slate-400" colSpan={7}>
                    No hay referencias que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 text-slate-400 text-sm">
        {filtered.length} registros (de {refs.length})
      </div>
    </div>
  );
}
