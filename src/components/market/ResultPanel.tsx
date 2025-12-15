import type { ValuationResult } from "../../market/types";

export function ResultPanel({ r }: { r?: ValuationResult }) {
  const currency = r?.currency ?? "USD";

  const ppm2 =
    typeof r?.pricePerM2 === "number" && isFinite(r.pricePerM2) ? r.pricePerM2 : null;

  const estimated =
    typeof r?.estimatedPrice === "number" && isFinite(r.estimatedPrice) ? r.estimatedPrice : null;

  const p25 = typeof r?.p25 === "number" && isFinite(r.p25) ? r.p25 : null;
  const p50 = typeof r?.p50 === "number" && isFinite(r.p50) ? r.p50 : null;
  const p75 = typeof r?.p75 === "number" && isFinite(r.p75) ? r.p75 : null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <div className="text-white font-semibold">Resultado</div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-4">
          <div className="text-slate-400 text-xs">{currency}/m²</div>
          <div className="text-3xl font-bold text-white mt-1">
            {ppm2 != null ? ppm2.toFixed(0) : "—"}
          </div>

          <div className="text-slate-400 text-xs mt-2">
            P25 {p25 != null ? p25.toFixed(0) : "—"} · P50 {p50 != null ? p50.toFixed(0) : "—"} ·
            P75 {p75 != null ? p75.toFixed(0) : "—"}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-4">
          <div className="text-slate-400 text-xs">Precio estimado</div>
          <div className="text-3xl font-bold text-white mt-1">
            {estimated != null ? `${estimated.toFixed(0)} ${currency}` : "—"}
          </div>

          <div className="text-slate-400 text-xs mt-2">
            Comparables usados: {r?.comparablesUsed?.length ?? 0}
          </div>
        </div>
      </div>

      {r?.usedReference ? (
        <div className="mt-4 text-slate-400 text-sm">
          Ref: {r.usedReference.zone} · {r.usedReference.operation} · {r.usedReference.propertyType} ·{" "}
{(r.usedReference.pricePerM2 ?? r.usedReference.valuePerM2 ?? 0).toFixed(0)}{" "}
{r.usedReference.currency}/m²
        </div>
      ) : (
        <div className="mt-4 text-slate-400 text-sm">Sin referencia (usando solo comparables o 0).</div>
      )}
    </div>
  );
}
