import Link from "next/link";
import LandingHero from "./LandingHero";

export default function Home() {
  return (
    <>
      <LandingHero />

      <section className="grid landing-pillars" aria-label="Confía product pillars">
        <article>
          <span className="pillar-number">01</span>
          <h2>Verify</h2>
          <p>Trace product claims to evidence and timestamps.</p>
        </article>
        <article>
          <span className="pillar-number">02</span>
          <h2>Explain</h2>
          <p>Share consistent facts and deterministic score breakdowns.</p>
        </article>
        <article>
          <span className="pillar-number">03</span>
          <h2>Connect</h2>
          <p>Bring those facts into conversations through the MCP service.</p>
        </article>
      </section>

      <section className="landing-trust-section" aria-labelledby="trust-layer-heading">
        <div className="landing-trust-copy">
          <p className="eyebrow">THE TRUST LAYER</p>
          <h2 id="trust-layer-heading">The answer is only as good as the facts behind it.</h2>
          <p>
            Confía gives AI assistants a structured, inspectable record for every product claim.
            Business teams see where information is strong. Shoppers see why a recommendation
            deserves confidence.
          </p>
          <div className="landing-flow">
            <span>Product data</span>
            <i aria-hidden="true">→</i>
            <span>Confía verification</span>
            <i aria-hidden="true">→</i>
            <span>AI answer</span>
          </div>
          <Link className="text-link" href="/dashboard/verification">
            See the verification method →
          </Link>
        </div>

        <div className="landing-proof-card">
          <div className="proof-card-header">
            <span>VERIFICATION RECORD</span>
            <span className="proof-status">● DEMO</span>
          </div>
          <div className="proof-product">
            <div className="proof-avatar" aria-hidden="true">20</div>
            <div>
              <strong>20V Cordless Drill</strong>
              <small>drill-001 · synthetic demo record</small>
            </div>
            {/* 40 + 20 + 15 = 75 of 80 possible points = 9.4 / 10 */}
            <strong className="proof-score">
              9.4<span>/10</span>
            </strong>
          </div>
          <div className="proof-bars">
            <div>
              <span>Price &amp; availability</span>
              <strong>40 / 40</strong>
              <i><b style={{ width: "100%" }} /></i>
            </div>
            <div>
              <span>Specifications</span>
              <strong>20 / 25</strong>
              <i><b style={{ width: "80%" }} /></i>
            </div>
            <div>
              <span>Supporting evidence</span>
              <strong>15 / 15</strong>
              <i><b style={{ width: "100%" }} /></i>
            </div>
          </div>
          <div className="proof-card-footer">
            <span>10 claims checked</span>
            <span>
              Demo data <span className="proof-check" aria-hidden="true">✓</span>
            </span>
          </div>
        </div>
      </section>

      <section className="community-section" aria-labelledby="community-heading">
        <div>
          <p className="eyebrow">
            BUILT FOR YOUR BUSINESS · <span lang="es">HECHO PARA TU NEGOCIO</span>
          </p>
          <h2 id="community-heading">Your products deserve to be understood in every language.</h2>
          <p>
            From Hispanic-owned shops to growing product teams, Confía is designed to help
            businesses keep their facts clear across English and Spanish AI shopping conversations.
          </p>
        </div>
        <div className="community-points">
          <div>
            <strong>01</strong>
            <span>
              <b>Prepare for AI shoppers</b>
              <small>Structure your catalog so AI assistants can read it.</small>
            </span>
          </div>
          <div>
            <strong>02</strong>
            <span>
              <b>Represent your brand</b>
              <small>
                Keep product claims consistent in English and <span lang="es">Español</span>.
              </small>
            </span>
          </div>
          <div>
            <strong>03</strong>
            <span>
              <b>Know what to verify next</b>
              <small>See where your product facts are strong and where they need work.</small>
            </span>
          </div>
        </div>
      </section>

      <section className="landing-visibility-section" aria-labelledby="visibility-heading">
        <div>
          <p className="eyebrow">BUILT FOR THE NEXT SEARCH BOX</p>
          <h2 id="visibility-heading">
            Be discoverable.
            <br />
            <em>Be explainable.</em>
          </h2>
        </div>
        <div>
          <p>
            Product visibility is becoming a conversation, not just a ranking. Confía helps your
            team understand how your catalog is represented and what to improve next.
          </p>
          <Link className="button button-muted" href="/dashboard/analytics">
            View analytics preview
          </Link>
        </div>
      </section>

      <p className="landing-note">
        The MCP tools and product evidence demo are available. ChatGPT connection is configured
        separately; merchant onboarding and engagement analytics remain future work.
      </p>
    </>
  );
}