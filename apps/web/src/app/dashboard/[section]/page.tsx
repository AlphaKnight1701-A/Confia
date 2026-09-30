import { notFound } from "next/navigation";
import Link from "next/link";
import { getDashboard, verifyProductClaim } from "@confia/product-data";
import { getLocale } from "../../locale";
import { statusLabel, t } from "../../i18n";
export const dynamic = "force-dynamic";
export default async function Section({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const locale = await getLocale();
  if (section === "verification") {
    const { products } = getDashboard(locale);
    return <div className="dashboard-page section-page"><p className="eyebrow">{t(locale, "sectionVerificationEyebrow")}</p><h1>{t(locale, "verificationHeading")}</h1><p className="dashboard-lead">{t(locale, "verificationDescription")}</p><section className="grid verification-grid">{products.map(p => <article className="glass-panel" key={p.productId}><div className="verification-card-top"><span className={`state-badge ${p.verificationState}`}>{statusLabel(locale, p.verificationState)}</span><strong>{p.trustScore ?? "N/A"}<small> / 10</small></strong></div><h2><Link href={`/dashboard/products/${p.productId}`}>{p.name}</Link></h2><p>{p.reasons.map(r => `${r.claimKey}: ${r.status}`).join("; ") || t(locale, "allEvidenceEligible")}</p><Link className="panel-link" href={`/dashboard/products/${p.productId}`}>{t(locale, "viewRecord")}</Link></article>)}</section></div>;
  }
  if (section === "discrepancies") {
    const result = verifyProductClaim({ productId: "drill-001", claims: { priceMinor: 19999, currency: "USD" } });
    const item = result.results[0];
    return <div className="dashboard-page section-page"><p className="eyebrow">{t(locale, "discrepancyEyebrow")}</p><h1>{t(locale, "discrepancyHeading")}</h1><p className="dashboard-lead">{t(locale, "discrepancyDescription")}</p><article className="glass-panel discrepancy-card"><span className="state-badge warning">{item.status}</span><h2>{t(locale, "secondLook")}</h2><p>{locale === "es" ? "Una afirmación enviada dice" : "A supplied claim says"} <strong>$199.99 USD</strong> {locale === "es" ? "para drill-001, mientras la observación válida del catálogo indica" : "for drill-001, while the eligible catalog observation says"} <strong>{typeof item.observed === "number" ? `$${(item.observed / 100).toFixed(2)} USD` : t(locale, "unknown")}</strong>.</p><div className="comparison-row"><span>{t(locale, "submittedClaim")}<strong>$199.99 USD</strong></span><span>{t(locale, "observedEvidence")}<strong>{typeof item.observed === "number" ? `$${(item.observed / 100).toFixed(2)} USD` : t(locale, "unknown")}</strong></span><span>{t(locale, "difference")}<strong className="warning-text">{t(locale, "review")}</strong></span></div><p className="muted-note">{item.reason}</p><small>{locale === "es" ? "Observado" : "Observed"}: {item.observedAt}</small></article></div>;
  }
  if (section === "analytics") return <div className="dashboard-page section-page"><p className="eyebrow">{t(locale, "analyticsEyebrow")}</p><h1>{t(locale, "analyticsHeading")}</h1><p className="dashboard-lead">{t(locale, "analyticsDescription")}</p><section className="dashboard-metrics analytics-preview"><article className="metric-card"><span>{t(locale, "visibilityScore")}</span><strong>78<small>/ 100</small></strong><p>+12% {t(locale, "lastPeriod")}</p></article><article className="metric-card"><span>{t(locale, "mentions")}</span><strong>64<small>%</small></strong><p>{t(locale, "trackedQuestions")}</p></article><article className="metric-card"><span>{t(locale, "freshnessCoverage")}</span><strong>92<small>%</small></strong><p>{t(locale, "withinWindow")}</p></article></section><article className="glass-panel analytics-empty"><span className="metric-icon purple">✦</span><h2>{t(locale, "unlockReporting")}</h2><p>{t(locale, "analyticsUnavailable")}</p></article></div>;
  notFound();
}
