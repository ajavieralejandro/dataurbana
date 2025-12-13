import type { Comparable, ReferenceValue } from "./types";
import { mockComparables, mockReferences } from "./mock";

const REF_KEY = "market.references.v1";
const CMP_KEY = "market.comparables.v1";

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function seedIfEmpty() {
  const refs = safeParse<ReferenceValue[]>(localStorage.getItem(REF_KEY), []);
  const cmps = safeParse<Comparable[]>(localStorage.getItem(CMP_KEY), []);
  if (refs.length === 0) localStorage.setItem(REF_KEY, JSON.stringify(mockReferences));
  if (cmps.length === 0) localStorage.setItem(CMP_KEY, JSON.stringify(mockComparables));
}

export function getReferences(): ReferenceValue[] {
  return safeParse<ReferenceValue[]>(localStorage.getItem(REF_KEY), []);
}

export function saveReference(ref: ReferenceValue) {
  const all = getReferences();
  localStorage.setItem(REF_KEY, JSON.stringify([ref, ...all]));
}

export function getComparables(): Comparable[] {
  return safeParse<Comparable[]>(localStorage.getItem(CMP_KEY), []);
}
