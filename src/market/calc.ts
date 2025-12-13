// src/market/calc.ts
import type { Comparable, ReferenceValue, ValuationInput } from "./types";

function scoreComparable(c: Comparable, input: ValuationInput) {
  let score = 0;

  // misma zona suma más
  if (c.zone === input.zone) score += 5;

  // misma operación/tipo/currency suma
  if (c.operation === input.operation) score += 3;
  if (c.propertyType === input.propertyType) score += 3;
  if (c.currency === input.currency) score += 2;

  // penalizaciones por distancia numérica
  score -= Math.abs((c.areaM2 ?? 0) - (input.areaM2 ?? 0)) / 10;
  score -= Math.abs((c.rooms ?? 0) - (input.rooms ?? 0)) * 1.5;
  score -= Math.abs((c.ageYears ?? 0) - (input.ageYears ?? 0)) / 5;

  // extras
  if (input.hasGarage && c.hasGarage) score += 1;
  if (input.hasBalcony && c.hasBalcony) score += 1;

  return score;
}

export function pickComparables(cmps: Comparable[], input: ValuationInput, limit = 6): Comparable[] {
  return [...cmps]
    .filter((c) => c.operation === input.operation && c.propertyType === input.propertyType)
    .sort((a, b) => scoreComparable(b, input) - scoreComparable(a, input))
    .slice(0, limit);
}

export function runValuation(input: ValuationInput, refs: ReferenceValue[], comparables: Comparable[]) {
  // referencia por zona/operación/tipo/moneda (lo más cercano)
  const ref = refs.find(
    (r) =>
      r.zone === input.zone &&
      r.operation === input.operation &&
      r.propertyType === input.propertyType &&
      r.currency === input.currency
  );

  const refPpm2 = ref?.pricePerM2 ?? null;

  // promedio de comparables por m2 si existe data
  const cmpsPpm2 = comparables
    .map((c) => (c.price && c.areaM2 ? c.price / c.areaM2 : null))
    .filter((x): x is number => typeof x === "number" && isFinite(x));

  const avgCmpPpm2 = cmpsPpm2.length ? cmpsPpm2.reduce((a, b) => a + b, 0) / cmpsPpm2.length : null;

  // mezcla simple: si hay ambos, promedia; si hay uno, usa ese
  const ppm2 =
    refPpm2 != null && avgCmpPpm2 != null ? (refPpm2 + avgCmpPpm2) / 2 : (refPpm2 ?? avgCmpPpm2);

  const estimated = ppm2 != null ? ppm2 * (input.areaM2 ?? 0) : null;

  return {
    ppm2,
    estimated,
    refUsed: ref ?? null,
    avgComparablePpm2: avgCmpPpm2,
    comparablesCount: comparables.length,
  };
}
