"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Locale } from "./i18n";
import { t } from "./i18n";

export default function LandingHero({ locale }: { locale: Locale }) {
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
        <p className="eyebrow">{t(locale, "heroEyebrow")}</p>
        <h1>
          {locale === "es" ? "Ayuda a tu negocio a ganar " : "Help your business earn "}<span className="glow-word">{locale === "es" ? "confianza." : "trust."}</span>
          <br />
          {locale === "es" ? "En cada respuesta de IA." : "In every AI answer."}
        </h1>
        <p className="lead">{t(locale, "heroDescription")}</p>
        <div className="hero-audience-proof">
          <span>{t(locale, "bilingualSupport")}</span>
          <span>{t(locale, "productTeams")}</span>
          <span>{t(locale, "evidenceScore")}</span>
        </div>
        <Link className="button" href="/dashboard">
          {t(locale, "getStarted")} <span>↗</span>
        </Link>
      </div>
    </section>
  );
}