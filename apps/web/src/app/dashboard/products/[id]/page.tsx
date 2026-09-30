import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, DomainError } from "@confia/product-data";
export const dynamic = "force-dynamic";
export default async function Product({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ locale?: string }> }) {
  const { id } = await params;
  const locale = (await searchParams).locale === "es" ? "es" : "en";
  let product;
  try { product = getProduct({ productId: id, locale }); } catch (error) { if (error instanceof DomainError && error.code === "PRODUCT_NOT_FOUND") notFound(); throw error; }
  return <section lang={locale}><Link href="/dashboard/products">← Products</Link><p><Link href={`?locale=${locale === "en" ? "es" : "en"}`}>{locale === "en" ? "Ver en español" : "View in English"}</Link></p><h1>{product.name}</h1><p>{product.description}</p><p><strong>{product.trustScore ?? "N/A"} / 10</strong> · {product.verificationState}</p><p>{locale === "es" ? "Confianza en la información, no calidad del producto." : "Confidence in the information, not product quality."}</p><section className="grid">{Object.entries(product.components).map(([key, component]) => <article key={key}><h2>{key}</h2><p>{component.points.toFixed(1)} / {component.maximum}</p></article>)}</section><h2>{locale === "es" ? "Evidencia sintética" : "Synthetic evidence"}</h2><div className="table-wrap"><table><thead><tr><th>Claim</th><th>Observation</th><th>State</th><th>Observed at</th></tr></thead><tbody>{product.evidence.map(e => <tr key={e.id}><td>{e.claimKey}</td><td>{String(e.value)}</td><td>{e.status}<br /><small>{e.explanation}</small></td><td>{e.observedAt ?? "N/A"}</td></tr>)}</tbody></table></div><p><small>Evaluated: {product.evaluatedAt} · {product.catalogRevision}</small></p></section>;
}
