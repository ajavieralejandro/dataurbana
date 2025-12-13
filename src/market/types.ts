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
  valuePerM2: number;
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
  estimatedPrice: number;
  currency: Currency;
  pricePerM2: number;

  p25: number;
  p50: number;
  p75: number;

  usedReference?: ReferenceValue;
  comparablesUsed: Comparable[];
  adjustments: { label: string; pct: number }[];
};
