import type { Comparable, ReferenceValue, ValuationInput, ValuationResult } from "./types";

function scoreComparable(c: Comparable, input: ValuationInput) {
  let score = 0;

  if (c.zone === input.zone) score += 5;
  if (c.operation === input.operation) score += 3;
  if (c.propertyType === input.propertyType) score += 3;
  if (c.currency === input.currency) score += 2;

  score -= Math.abs(c.areaM2 - input.areaM2) / 10;

  if (typeof c.rooms === "number" && typeof input.rooms === "number") {
    score -= Math.abs(c.rooms - input.rooms) * 1.5;
  }
  if (typeof c.ageYears === "number" && typeof input.ageYears === "number") {
    score -= Math.abs(c.ageYears - input.ageYears) / 5;
  }

  if (input.hasGarage && c.hasGarage) score += 1;
  if (input.hasBalcony && c.hasBalcony) score += 1;

  return score;
}

export function pickComparables(cmps: Comparable[], input: ValuationInput, limit = 6): Comparable[] {
  return [...cmps]
    .filter(
      (c) =>
        c.operation === input.operation &&
        c.propertyType === input.propertyType &&
        c.currency === input.currency
    )
    .sort((a, b) => scoreComparable(b, input) - scoreComparable(a, input))
    .slice(0, limit);
}

export function runValuation(
  input: ValuationInput,
  refs: ReferenceValue[],
  comparables: Comparable[]
): ValuationResult {
  const ref = refs.find(
    (r) =>
      r.zone === input.zone &&
      r.operation === input.operation &&
      r.propertyType === input.propertyType &&
      r.currency === input.currency
  );

  const refPpm2 = ref?.pricePerM2 ?? ref?.valuePerM2 ?? null;

  const cmpPpm2 = comparables.map((c) => c.price / c.areaM2);
  const avgCmpPpm2 = cmpPpm2.length
    ? cmpPpm2.reduce((a, b) => a + b, 0) / cmpPpm2.length
    : null;

  const basePpm2 =
    typeof refPpm2 === "number" && typeof avgCmpPpm2 === "number"
      ? (refPpm2 + avgCmpPpm2) / 2
      : (refPpm2 ?? avgCmpPpm2 ?? 0);

  const adjustments: { label: string; pct: number }[] = [];
  if (input.hasGarage) adjustments.push({ label: "Cochera", pct: 0.03 });
  if (input.hasBalcony) adjustments.push({ label: "Balcón", pct: 0.015 });

  const totalAdj = adjustments.reduce((acc, a) => acc + a.pct, 0);
  const adjPpm2 = basePpm2 * (1 + totalAdj);

  const estimated = adjPpm2 * input.areaM2;

  return {
    ppm2: adjPpm2,
    estimated,
    refUsed: ref ?? null,
    avgComparablePpm2: avgCmpPpm2,
    comparablesCount: comparables.length,

    // compat con tu ResultPanel actual
    usedReference: ref ?? undefined,
    comparablesUsed: comparables,

    // lo dejamos para UI futura
    adjustments,

    // extras opcionales
    estimatedPrice: estimated,
    currency: input.currency,
    pricePerM2: adjPpm2,
  };
}
