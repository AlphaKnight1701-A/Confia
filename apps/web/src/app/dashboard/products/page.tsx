import Link from "next/link";
import { getDashboard } from "@confia/product-data";
export const dynamic = "force-dynamic";
export default function Products() {
  const { products } = getDashboard();
  return <div className="dashboard-page section-page"><div className="section-page-heading"><div><p className="eyebrow">SYNTHETIC CATALOG · {products.length} RECORDS</p><h1>Product evidence, made visible.</h1><p className="dashboard-lead">Inspect the facts, score components, and evidence state behind every AI-facing product record.</p></div><button className="button button-muted" type="button">↓ Export catalog</button></div><div className="table-wrap glass-panel"><table><thead><tr><th>Product</th><th>Demo price</th><th>Trust Score</th><th>State</th></tr></thead><tbody>{products.map(product => <tr key={product.productId}><td><Link href={`/dashboard/products/${product.productId}`}>{product.name}</Link><br /><small>{product.productId}</small></td><td>{new Intl.NumberFormat("en", { style: "currency", currency: product.currency }).format(product.priceMinor / 100)}</td><td><strong className="table-score">{product.trustScore ?? "N/A"}</strong><small> / 10</small></td><td><span className={`state-badge ${product.verificationState}`}>{product.verificationState}</span></td></tr>)}</tbody></table></div></div>;
}
