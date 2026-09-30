import Link from "next/link";
import { getDashboard } from "@confia/product-data";
export const dynamic = "force-dynamic";
export default function Dashboard() {
  const data = getDashboard();
  return <><p className="eyebrow">SYNTHETIC BUSINESS DEMO</p><h1>Your verification workspace</h1><p>These are the same product records and scoring functions exposed to ChatGPT.</p><section className="grid"><article><h2>Catalog</h2><p>{data.products.length} synthetic products</p><small>{data.catalogRevision}</small></article><article><h2>Average Trust Score</h2><p>{data.averageTrustScore ?? "N/A"} / 10</p><small>Unassessed products excluded; stale assessments included.</small></article><article><h2>Fully verified</h2><p>{data.verifiedCount} products</p><small>Information confidence, not product quality.</small></article></section><Link className="button" href="/dashboard/products">Explore evidence and scores</Link></>;
}
