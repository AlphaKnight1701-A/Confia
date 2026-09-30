import { notFound } from "next/navigation";
import Link from "next/link";
import { getDashboard, verifyProductClaim } from "@confia/product-data";
export const dynamic = "force-dynamic";
export default async function Section({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (section === "verification") {
    const { products } = getDashboard();
    return <><h1>Verification results</h1><p>Scores are calculated by the same engine used by the MCP tools.</p><section className="grid">{products.map(p => <article key={p.productId}><h2><Link href={`/dashboard/products/${p.productId}`}>{p.name}</Link></h2><p>{p.trustScore ?? "N/A"} / 10 · {p.verificationState}</p><p>{p.reasons.map(r => `${r.claimKey}: ${r.status}`).join("; ") || "All required evidence is eligible."}</p></article>)}</section></>;
  }
  if (section === "discrepancies") {
    const result = verifyProductClaim({ productId: "drill-001", claims: { priceMinor: 19999, currency: "USD" } });
    const item = result.results[0];
    return <><h1>Potential information discrepancy</h1><p>Demonstration: a supplied claim says $199.99 USD for drill-001.</p><article><h2>{item.status}</h2><p>Supplied: $199.99 USD</p><p>Eligible observation: {typeof item.observed === "number" ? `$${(item.observed / 100).toFixed(2)} USD` : "Unknown"}</p><p>{item.reason}</p><small>Observed: {item.observedAt}</small></article><p>A discrepancy is a difference in records, not automatic proof of an AI hallucination.</p></>;
  }
  if (section === "analytics") return <><h1>Demonstration analytics</h1><p>Engagement analytics are not implemented. No live impressions, clicks, or conversions are being measured.</p></>;
  notFound();
}
