import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, DomainError } from "@confia/product-data";
import { getLocale } from "../../../locale";
import { t } from "../../../i18n";
export const dynamic = "force-dynamic";
export default async function Product({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getLocale();
  let product;
  try { product = getProduct({ productId: id, locale }); } catch (error) { if (error instanceof DomainError && error.code === "PRODUCT_NOT_FOUND") notFound(); throw error; }
  return <div className="dashboard-page section-page" lang={locale}><div className="detail-topline"><Link href="/dashboard/products">{t(locale, "productsBack")}</Link><span>{locale === "es" ? "Usa el selector de idioma" : "Use the language switcher"}</span></div><div className="product-hero"><div><p className="eyebrow">{t(locale, "productRecord")} · {product.productId}</p><h1>{product.name}</h1><p className="dashboard-lead">{product.description}</p><p>{t(locale, "confidenceNote")}</p></div><div className="hero-score"><span>{t(locale, "trustScore")}</span><strong>{product.trustScore ?? "N/A"}<small>/ 10</small></strong><span className={`state-badge ${product.verificationState}`}>{product.verificationState}</span></div></div><section className="grid score-components">{Object.entries(product.components).map(([key, component]) => <article className="glass-panel" key={key}><p className="eyebrow">{key}</p><strong>{component.points.toFixed(1)} <small>/ {component.maximum}</small></strong><div className="mini-progress"><span style={{ width: `${(component.points / component.maximum) * 100}%` }} /></div></article>)}</section><h2>{t(locale, "syntheticEvidence")}</h2><div className="table-wrap glass-panel"><table><thead><tr><th>{t(locale, "claim")}</th><th>{t(locale, "observation")}</th><th>{t(locale, "state")}</th><th>{t(locale, "observedAt")}</th></tr></thead><tbody>{product.evidence.map(e => <tr key={e.id}><td>{e.claimKey}</td><td>{String(e.value)}</td><td><span className={`state-badge ${e.status}`}>{e.status}</span><br /><small>{e.explanation}</small></td><td>{e.observedAt ?? "N/A"}</td></tr>)}</tbody></table></div><p><small>{t(locale, "evaluated")}: {product.evaluatedAt} · {product.catalogRevision}</small></p></div>;
}
