"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function LandingHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let frame = 0;
    const handlePointerMove = (event: PointerEvent) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        const x = Math.max(0, event.clientX - bounds.left);
        const y = Math.max(0, event.clientY - bounds.top);
        const angle = (Math.atan2(y, x) * 180) / Math.PI;
        hero.style.setProperty("--spotlight-angle", `${angle}deg`);
      });
    };

    hero.addEventListener("pointermove", handlePointerMove);
    return () => {
      hero.removeEventListener("pointermove", handlePointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <section ref={heroRef} className="landing-hero landing-hero-shell">
    <div className="hero-spotlight" aria-hidden="true" />
    <div className="hero-content">
      <p className="eyebrow">FOR BUSINESSES · BUILT FOR TRANSPARENCY</p>
      <h1>Product information you can <span className="glow-word">trust.</span><br />Where AI shoppers find you.</h1>
      <p className="lead">Confía connects evidence about your products with AI-assisted shopping. Understand what is verified, what is missing, and why a score exists.</p>
      <Link className="button" href="/dashboard">Explore the demo catalog</Link>
    </div>
  </section>;
}
