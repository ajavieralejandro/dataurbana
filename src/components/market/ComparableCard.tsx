import type { Comparable } from "../../market/types";

function formatMoney(value: number, currency?: string) {
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toFixed(0)} ${currency ?? ""}`.trim();
  }
}

export function ComparableCard({ c }: { c: Comparable }) {
  const title =
    (c as any).title ||
    (c as any).address ||
    `${(c as any).propertyType ?? ""} ${(c as any).operation ?? ""}`.trim() ||
    "Comparable";

  const price = (c as any).price as number | undefined;
  const currency = (c as any).currency as string | undefined;
  const areaM2 = (c as any).areaM2 as number | undefined;
  const rooms = (c as any).rooms as number | undefined;

  const ppm2 = price && areaM2 ? price / areaM2 : null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-white font-semibold">{title}</div>
          <div className="text-slate-400 text-sm mt-0.5">
            {(c as any).zone ? <>Zona: {(c as any).zone}</> : null}
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-400 text-xs">Precio</div>
          <div className="text-white font-semibold">
            {typeof price === "number" ? formatMoney(price, currency) : "—"}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-2">
          <div className="text-slate-400 text-xs">m²</div>
          <div className="text-slate-200">{typeof areaM2 === "number" ? areaM2 : "—"}</div>
        </div>

        <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-2">
          <div className="text-slate-400 text-xs">Amb</div>
          <div className="text-slate-200">{typeof rooms === "number" ? rooms : "—"}</div>
        </div>

        <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-2">
          <div className="text-slate-400 text-xs">{currency ?? "USD"}/m²</div>
          <div className="text-slate-200">{ppm2 ? ppm2.toFixed(0) : "—"}</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {(c as any).hasGarage && (
          <span className="px-2 py-1 rounded-full border border-slate-700 text-slate-200 bg-slate-900/40">
            Cochera
          </span>
        )}
        {(c as any).hasBalcony && (
          <span className="px-2 py-1 rounded-full border border-slate-700 text-slate-200 bg-slate-900/40">
            Balcón
          </span>
        )}
        {(c as any).condition && (
          <span className="px-2 py-1 rounded-full border border-slate-700 text-slate-200 bg-slate-900/40">
            {(c as any).condition}
          </span>
        )}
      </div>
    </div>
  );
}
