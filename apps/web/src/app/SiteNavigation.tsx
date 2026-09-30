"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { WheelEvent } from "react";
import type { Locale, TranslationKey } from "./i18n";
import { t } from "./i18n";

const pages = [
  { href: "/dashboard", label: "dashboard", kicker: "01", description: "navDashboardDescription", tone: "green" },
  { href: "/dashboard/products", label: "products", kicker: "02", description: "navProductsDescription", tone: "blue" },
  { href: "/dashboard/verification", label: "verification", kicker: "03", description: "navVerificationDescription", tone: "purple" },
  { href: "/dashboard/discrepancies", label: "discrepancies", kicker: "04", description: "navDiscrepanciesDescription", tone: "amber" },
  { href: "/dashboard/analytics", label: "analytics", kicker: "05", description: "navAnalyticsDescription", tone: "teal" },
];

export default function SiteNavigation({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.currentTarget.scrollLeft += event.deltaY;
    }
  };

  return <>
    <button className={`menu-trigger ${open ? "open" : ""}`} type="button" aria-label={open ? t(locale, "closeNavigation") : t(locale, "openNavigation")} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </button>
    {open && <div className="site-menu-layer" role="dialog" aria-modal="true" aria-label={t(locale, "navigation")}><div className="site-menu-header"><span className="menu-kicker">{t(locale, "workspace")}</span><button ref={closeButtonRef} className="menu-close" type="button" onClick={() => setOpen(false)}>{t(locale, "close")} <span aria-hidden="true">×</span></button></div><div className="page-carousel" onWheel={handleWheel}>{pages.map((page) => { const active = pathname === page.href || (page.href !== "/dashboard" && pathname.startsWith(page.href)); return <Link className={`page-card ${page.tone} ${active ? "active" : ""}`} key={page.href} href={page.href} onClick={() => setOpen(false)}><span className="page-card-number">{page.kicker}</span><span className="page-card-label">{t(locale, page.label as TranslationKey)}</span><span className="page-card-description">{t(locale, page.description as TranslationKey)}</span><span className="page-card-arrow">↗</span></Link>; })}</div><div className="site-menu-footer"><span>{t(locale, "scrollExplore")}</span><span>{pages.length} {t(locale, "destinations")}</span></div></div>}
  </>;
}
