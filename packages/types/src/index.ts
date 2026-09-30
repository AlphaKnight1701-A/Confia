export type Locale = "en" | "es";
export type VerificationState = "verified" | "partial" | "conflicting" | "stale" | "unverified";
export interface Money { amountMinor: number; currency: string }
export interface CatalogSummary {
  catalogRevision: string;
  synthetic: true;
  productCount: number;
  status: "scaffold" | "ready";
}
export const MCP_TOOL_NAMES = [
  "search_products", "get_product", "get_trust_score", "verify_product_claim",
] as const;
