"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function LandingHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // Respect reduced-motion: leave the spotlight at its default angle.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

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

  return (
    <section ref={heroRef} className="landing-hero landing-hero-shell">
      <div className="hero-spotlight" aria-hidden="true" />
      <div className="hero-content">
        <p className="eyebrow">FOR HISPANIC BUSINESSES · BUILT FOR AI DISCOVERY</p>
        <h1>
          Help your business earn <span className="glow-word">trust.</span>
          <br />
          In every AI answer.
        </h1>
        <p className="lead">
          Confía gives growing businesses a clear way to verify product information, show up
          accurately in AI shopping, and explain what makes each claim trustworthy.
        </p>
        <div className="hero-audience-proof">
          <span>EN · ES</span>
          <span>For growing product teams</span>
          <span>Evidence-linked signals</span>
        </div>
        <Link className="button" href="/dashboard">
          Explore the business workspace
        </Link>
      </div>
    </section>
  );
}