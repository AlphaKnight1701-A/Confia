import Link from "next/link";
import LandingHero from "./LandingHero";

export default function Home() {
  return <>
    <LandingHero />

    <section className="grid landing-pillars" aria-label="Confia product pillars">
      <article><span className="pillar-number">01</span><h2>Verify</h2><p>Trace product claims to evidence and timestamps.</p></article>
      <article><span className="pillar-number">02</span><h2>Explain</h2><p>Share consistent facts and deterministic score breakdowns.</p></article>
      <article><span className="pillar-number">03</span><h2>Connect</h2><p>Bring those facts into conversations through the MCP service.</p></article>
    </section>

    <section className="landing-trust-section" aria-labelledby="trust-layer-heading">
      <div className="landing-trust-copy">
        <p className="eyebrow">THE TRUST LAYER</p>
        <h2 id="trust-layer-heading">The answer is only as good as the facts behind it.</h2>
        <p>Confía gives AI assistants a structured, inspectable record for every product claim. Businesses see where information is strong. Shoppers see why a recommendation deserves confidence.</p>
        <div className="landing-flow"><span>Product data</span><i>→</i><span>Confía verification</span><i>→</i><span>AI answer</span></div>
        <Link className="text-link" href="/dashboard/verification">See the verification method →</Link>
      </div>
      <div className="landing-proof-card">
        <div className="proof-card-header"><span>VERIFICATION RECORD</span><span className="proof-status">● CURRENT</span></div>
        <div className="proof-product"><div className="proof-avatar">20</div><div><strong>20V Cordless Drill</strong><small>drill-001 · synthetic demo record</small></div><strong className="proof-score">9.5<span>/10</span></strong></div>
        <div className="proof-bars"><div><span>Price & availability</span><strong>40 / 40</strong><i><b style={{ width: "100%" }} /></i></div><div><span>Specifications</span><strong>20 / 25</strong><i><b style={{ width: "80%" }} /></i></div><div><span>Supporting evidence</span><strong>15 / 15</strong><i><b style={{ width: "100%" }} /></i></div></div>
        <div className="proof-card-footer"><span>10 claims checked</span><span>Updated today <span className="proof-check">✓</span></span></div>
      </div>
    </section>

    <section className="landing-visibility-section" aria-labelledby="visibility-heading">
      <div><p className="eyebrow">BUILT FOR THE NEXT SEARCH BOX</p><h2 id="visibility-heading">Be discoverable.<br /><em>Be explainable.</em></h2></div>
      <div><p>Product visibility is becoming a conversation, not just a ranking. Confía helps your team understand how your catalog is represented and what to improve next.</p><Link className="button button-secondary" href="/dashboard/analytics">View analytics preview</Link></div>
    </section>

    <p className="landing-note">The MCP tools and product evidence demo are available. ChatGPT connection is configured separately; merchant onboarding and engagement analytics remain future work.</p>
  </>;
}

