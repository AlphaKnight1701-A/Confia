import Link from "next/link";
import { getDashboard } from "@confia/product-data";
export const dynamic = "force-dynamic";
export default function Products() {
  const { products } = getDashboard();
  return <><p className="eyebrow">SYNTHETIC CATALOG</p><h1>Product evidence, made visible.</h1><div className="table-wrap"><table><thead><tr><th>Product</th><th>Demo price</th><th>Trust Score</th><th>State</th></tr></thead><tbody>{products.map(product => <tr key={product.productId}><td><Link href={`/dashboard/products/${product.productId}`}>{product.name}</Link><br /><small>{product.productId}</small></td><td>{new Intl.NumberFormat("en", { style: "currency", currency: product.currency }).format(product.priceMinor / 100)}</td><td>{product.trustScore ?? "N/A"}</td><td>{product.verificationState}</td></tr>)}</tbody></table></div></>;
}
