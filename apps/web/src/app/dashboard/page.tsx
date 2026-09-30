import { getCatalogSummary } from "@confia/product-data";
export const dynamic = "force-dynamic";
export default function Dashboard() {
  const catalog = getCatalogSummary();
  return <><p className="eyebrow">BUSINESS PLATFORM</p><h1>Your verification workspace</h1><p>Both applications use the same catalog and shared verification packages.</p><section className="grid"><article><h2>Catalog</h2><p>{catalog.productCount} products loaded</p><small>{catalog.catalogRevision}</small></article><article><h2>Trust Scores</h2><p>Awaiting assessment engine and evidence fixtures.</p></article><article><h2>Analytics</h2><p>No live tracking. Clearly labeled demonstration metrics are planned.</p></article></section></>;
}
