export type Operation = "VENTA" | "ALQUILER";
export type PropertyType = "DEPTO" | "CASA";
export type Currency = "USD" | "ARS";
export type SourceKind = "Manual" | "Portal" | "Cierre" | "Tasación";
export type Status = "VALIDADO" | "PENDIENTE";

export type ReferenceValue = {
  id: string;
  zone: string;
  operation: Operation;
  propertyType: PropertyType;

  currency: Currency;

  // ✅ Canon: un solo nombre “real”
  pricePerM2: number;

  // ✅ Compat: si algún componente viejo usa valuePerM2, lo dejamos opcional
  valuePerM2?: number;

  p25?: number;
  p75?: number;

  updatedAt: string;
  source: { kind: SourceKind; note?: string; url?: string };
  status: Status;
};

export type Comparable = {
  id: string;
  zone: string;
  operation: Operation;
  propertyType: PropertyType;

  price: number;
  currency: Currency;
  areaM2: number;

  rooms?: number;
  ageYears?: number;
  condition?: "A_REFACCIONAR" | "BUENO" | "MUY_BUENO" | "A_ESTRENAR";

  hasGarage?: boolean;
  hasBalcony?: boolean;

  publishedAt: string;
  sourceUrl?: string;

  // ✅ para mapas
  lat?: number;
  lng?: number;
};

export type ValuationInput = {
  zone: string;
  operation: Operation;
  propertyType: PropertyType;
  currency: Currency;

  areaM2: number;
  rooms?: number;
  ageYears?: number;
  condition?: Comparable["condition"];
  hasGarage?: boolean;
  hasBalcony?: boolean;
};
export type ValuationResult = {
  // núcleo
  ppm2: number | null;
  estimated: number | null;
  refUsed: ReferenceValue | null;
  avgComparablePpm2: number | null;
  comparablesCount: number;

  // usados por ResultPanel actual
  usedReference?: ReferenceValue;
  comparablesUsed?: Comparable[];

  // ✅ ESTO FALTABA
  adjustments?: {
    label: string;
    pct: number;
  }[];

  // compat legacy
  estimatedPrice?: number | null;
  currency?: string;
  pricePerM2?: number | null;
  p25?: number | null;
  p50?: number | null;
  p75?: number | null;
  min?: number | null;
  max?: number | null;
};

