import Link from "next/link";
import { getDashboard } from "@confia/product-data";
import { getLocale } from "../../locale";
import { formatTranslation, statusLabel, t } from "../../i18n";
export const dynamic = "force-dynamic";
export default async function Products() {
  const locale = await getLocale();
  const { products } = getDashboard(locale);
  return <div className="dashboard-page section-page"><div className="section-page-heading"><div><p className="eyebrow">{formatTranslation(locale, "catalogRecords", { count: products.length })}</p><h1>{t(locale, "productEvidenceHeading")}</h1><p className="dashboard-lead">{t(locale, "productEvidenceDescription")}</p></div><button className="button button-muted" type="button">{t(locale, "exportCatalog")}</button></div><div className="table-wrap glass-panel"><table><thead><tr><th>{t(locale, "products")}</th><th>{t(locale, "demoPrice")}</th><th>{t(locale, "trustScore")}</th><th>{t(locale, "state")}</th></tr></thead><tbody>{products.map(product => <tr key={product.productId}><td><Link href={`/dashboard/products/${product.productId}`}>{product.name}</Link><br /><small>{product.productId}</small></td><td>{new Intl.NumberFormat(locale, { style: "currency", currency: product.currency }).format(product.priceMinor / 100)}</td><td><strong className="table-score">{product.trustScore ?? "N/A"}</strong><small> / 10</small></td><td><span className={`state-badge ${product.verificationState}`}>{statusLabel(locale, product.verificationState)}</span></td></tr>)}</tbody></table></div></div>;
}
