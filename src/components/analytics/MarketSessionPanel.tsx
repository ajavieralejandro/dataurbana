// src/analytics/MarketSessionPanel.tsx
import type { FC } from "react";
import { useMemo, useState } from "react";

type SessionKey = "venta" | "alquiler" | "inversion";

type Session = {
  key: SessionKey;
  label: string;
  desc: string;
  kpis: { label: string; value: string; delta: string }[];
  trend: number[]; // 12 puntos (demo)
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const deltaClass = (delta: string) => {
  // acepta "+1.2%" "-0.4%" "±0.0%"
  const d = delta.trim();
  if (d.startsWith("-")) return "text-rose-400";
  if (d.startsWith("+")) return "text-emerald-400";
  return "text-slate-300";
};

const MarketSessionPanel: FC = () => {
  // ✅ Estado local simple
  const [mode, setMode] = useState<SessionKey>("venta");

  // ✅ Datos DEMO (hardcodeados)
  const sessions: Session[] = useMemo(
    () => [
      {
        key: "venta",
        label: "Venta",
        desc: "Indicadores agregados para publicaciones de venta en CABA.",
        kpis: [
          { label: "Precio medio (USD/m²)", value: "2.180", delta: "+1.6%" },
          { label: "Mediana (USD/m²)", value: "2.050", delta: "+0.9%" },
          { label: "Spread barrios", value: "38%", delta: "-0.4%" },
        ],
        trend: [58, 60, 61, 62, 60, 63, 64, 66, 65, 67, 69, 70],
      },
      {
        key: "alquiler",
        label: "Alquiler",
        desc: "Señales de demanda y presión de precios en alquiler.",
        kpis: [
          { label: "Precio medio (ARS/m²)", value: "8.900", delta: "+3.2%" },
          { label: "Rotación", value: "Alta", delta: "+0.6%" },
          { label: "Vacancia", value: "Baja", delta: "-1.1%" },
        ],
        trend: [52, 53, 54, 55, 57, 56, 58, 59, 60, 62, 61, 63],
      },
      {
        key: "inversion",
        label: "Inversión",
        desc: "Rentabilidad estimada y oportunidades por zonas.",
        kpis: [
          { label: "Yield estimado", value: "4.7%", delta: "+0.2%" },
          { label: "Oportunidades", value: "38", delta: "+0.8%" },
          { label: "Riesgo", value: "Medio", delta: "±0.0%" },
        ],
        trend: [48, 49, 51, 50, 52, 53, 54, 55, 56, 57, 58, 59],
      },
    ],
    []
  );

  const selected = sessions.find((s) => s.key === mode) ?? sessions[0];

  // Score demo (se deriva de la tendencia)
  const score = useMemo(() => {
    const last = selected.trend[selected.trend.length - 1] ?? 0;
    return clamp(Math.round(last), 0, 100);
  }, [selected.trend]);

  // Mini sparkline SVG (sin libs)
  const sparkPath = useMemo(() => {
    const data = selected.trend;
    if (data.length < 2) return "";

    const w = 240;
    const h = 56;
    const pad = 6;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;

    const xStep = (w - pad * 2) / (data.length - 1);

    const pts = data.map((v, i) => {
      const x = pad + i * xStep;
      const y = pad + (1 - (v - min) / span) * (h - pad * 2);
      return { x, y };
    });

    const d = pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join(" ");

    return d;
  }, [selected.trend]);

  return (
    <section className="bg-slate-950/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-sm md:text-base font-semibold text-slate-100">
            Sesiones del mercado
          </h2>
          <p className="text-xs text-slate-400 mt-1">{selected.desc}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {sessions.map((s) => {
            const active = s.key === mode;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setMode(s.key)}
                className={[
                  "px-3 py-1.5 rounded-xl text-xs font-medium border transition",
                  active
                    ? "bg-sky-500 text-slate-950 border-sky-400"
                    : "bg-slate-900/70 text-slate-200 border-slate-700 hover:border-sky-400",
                ].join(" ")}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-5">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {selected.kpis.map((k) => (
            <div
              key={k.label}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4"
            >
              <div className="text-[0.7rem] text-slate-400">{k.label}</div>
              <div className="mt-2 text-lg font-semibold text-slate-100">
                {k.value}
              </div>
              <div className={`mt-2 text-xs font-semibold ${deltaClass(k.delta)}`}>
                {k.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Score + trend */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-100">
                Índice de mercado
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Señal agregada (demo)
              </div>
            </div>
            <div className="text-xl font-semibold text-slate-100">{score}/100</div>
          </div>

          {/* Bar */}
          <div className="mt-3 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-sky-400" style={{ width: `${score}%` }} />
          </div>

          {/* Sparkline */}
          <div className="mt-4">
            <div className="text-[0.7rem] text-slate-500 mb-2">
              Tendencia (12 puntos demo)
            </div>
            <svg
              viewBox="0 0 240 56"
              className="w-full h-14 rounded-xl border border-slate-800 bg-slate-950/40"
              role="img"
              aria-label="Tendencia"
            >
              <path d={sparkPath} fill="none" stroke="currentColor" strokeWidth="2" className="text-sky-400" />
            </svg>
          </div>

          <div className="mt-3 text-[0.7rem] text-slate-500">
            Tip: conectá estos KPIs con tu API cuando la tengas lista.
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketSessionPanel;
