import Link from "next/link";
import LandingHero from "./LandingHero";
import { getLocale } from "./locale";
import { t } from "./i18n";

export default async function Home() {
  const locale = await getLocale();
  return (
    <>
      <LandingHero locale={locale} />

      <section className="grid landing-pillars" aria-label={locale === "es" ? "Pilares de producto de Confía" : "Confía product pillars"}>
        <article>
          <h2>{t(locale, "verify")}</h2>
          <p>{t(locale, "verifyDescription")}</p>
        </article>
        <article>
          <h2>{t(locale, "explain")}</h2>
          <p>{t(locale, "explainDescription")}</p>
        </article>
        <article>
          <h2>{t(locale, "connect")}</h2>
          <p>{t(locale, "connectDescription")}</p>
        </article>
      </section>

      <section className="landing-trust-section" aria-labelledby="trust-layer-heading">
        <div className="landing-trust-copy">
          <p className="eyebrow">{t(locale, "trustEyebrow")}</p>
          <h2 id="trust-layer-heading">{t(locale, "trustHeading")}</h2>
          <p>{t(locale, "trustDescription")}</p>
          <div className="landing-flow">
            <span>{t(locale, "productData")}</span>
            <i aria-hidden="true">→</i>
            <span>{t(locale, "confiaVerification")}</span>
            <i aria-hidden="true">→</i>
            <span>{t(locale, "aiAnswer")}</span>
          </div>
          <Link className="text-link" href="/dashboard/verification">
            {t(locale, "seeVerification")}
          </Link>
        </div>

        <div className="landing-proof-card">
          <div className="proof-card-header">
            <span>{t(locale, "trustRecord")}</span>
            <span className="proof-status">● {t(locale, "demo")}</span>
          </div>
          <div className="proof-product">
            <div className="proof-avatar" aria-hidden="true">20</div>
            <div>
              <strong>20V Cordless Drill</strong>
            </div>
            {/* 40 + 20 + 15 = 75 of 80 possible points = 9.4 / 10 */}
            <strong className="proof-score">
              9.4 <span>/10</span>
            </strong>
          </div>
          <div className="proof-bars">
            <div>
              <span>{t(locale, "priceAvailability")}</span>
              <strong>40 / 40</strong>
              <i><b style={{ width: "100%" }} /></i>
            </div>
            <div>
              <span>{t(locale, "specifications")}</span>
              <strong>20 / 25</strong>
              <i><b style={{ width: "80%" }} /></i>
            </div>
            <div>
              <span>{t(locale, "supportingEvidence")}</span>
              <strong>15 / 15</strong>
              <i><b style={{ width: "100%" }} /></i>
            </div>
          </div>
          <div className="proof-card-footer">
            <span>{t(locale, "claimsChecked")}</span>
            <span>
              {t(locale, "demoData")} <span className="proof-check" aria-hidden="true">✓</span>
            </span>
          </div>
        </div>
      </section>

      <section className="community-section" aria-labelledby="community-heading">
        <div>
          <p className="eyebrow">
            {t(locale, "builtForBusiness")}
          </p>
          <h2 id="community-heading">{t(locale, "communityHeading")}</h2>
          <p>{t(locale, "communityDescription")}</p>
        </div>
        <div className="community-points">
          <div>
            <strong>01</strong>
            <span>
              <b>{t(locale, "prepareForShoppers")}</b>
              <small>{t(locale, "prepareDescription")}</small>
            </span>
          </div>
          <div>
            <strong>02</strong>
            <span>
              <b>{t(locale, "representBrand")}</b>
              <small>{t(locale, "representDescription")}</small>
            </span>
          </div>
          <div>
            <strong>03</strong>
            <span>
              <b>{t(locale, "verifyNext")}</b>
              <small>{t(locale, "verifyNextDescription")}</small>
            </span>
          </div>
        </div>
      </section>

      <section className="landing-visibility-section" aria-labelledby="visibility-heading">
        <div>
          <p className="eyebrow">{t(locale, "nextSearch")}</p>
          <h2 id="visibility-heading">
            {t(locale, "discoverable")}
            <br />
            <em>{t(locale, "explainable")}</em>
          </h2>
        </div>
        <div>
          <p>{t(locale, "visibilityDescription")}</p>
          <Link className="button button-muted" href="/dashboard/analytics">
            {t(locale, "analyticsPreview")}
          </Link>
        </div>
      </section>

      <p className="landing-note">
        {t(locale, "landingNote")}
      </p>
    </>
  );
}