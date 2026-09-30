import catalog from "../../../data/demo-products.json";
import type { CatalogSummary } from "@confia/types";

// Imported at build time by both apps. No per-app copy or process-working-directory lookup.
export function getCatalogSummary(): CatalogSummary {
  if (catalog.synthetic !== true || catalog.status !== "scaffold" || catalog.products.length !== 0) {
    throw new Error("Implement catalog validation and assessment services before publishing products.");
  }
  return { catalogRevision: catalog.catalogRevision, synthetic: true, status: "scaffold", productCount: 0 };
}
