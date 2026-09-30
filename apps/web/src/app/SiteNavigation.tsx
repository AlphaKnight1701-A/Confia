"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { WheelEvent } from "react";

const pages = [
  { href: "/dashboard", label: "Dashboard", kicker: "01", description: "Workspace pulse and catalog health", tone: "green" },
  { href: "/dashboard/products", label: "Products", kicker: "02", description: "Product facts, scores, and evidence", tone: "blue" },
  { href: "/dashboard/verification", label: "Verification", kicker: "03", description: "Claim-level review and confidence", tone: "purple" },
  { href: "/dashboard/discrepancies", label: "Discrepancies", kicker: "04", description: "Signals that need a second look", tone: "amber" },
  { href: "/dashboard/analytics", label: "Analytics", kicker: "05", description: "Visibility signals and reporting", tone: "teal" },
];

export default function SiteNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.currentTarget.scrollLeft += event.deltaY;
    }
  };

  return <>
    <button className={`menu-trigger ${open ? "open" : ""}`} type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen((value) => !value)}><span /></button>
    {open && <div className="site-menu-layer" role="dialog" aria-modal="true" aria-label="Page navigation"><div className="site-menu-header"><span className="menu-kicker">Confía workspace</span><button className="menu-close" type="button" onClick={() => setOpen(false)}>Close <span>×</span></button></div><div className="page-carousel" onWheel={handleWheel}>{pages.map((page) => { const active = pathname === page.href || (page.href !== "/dashboard" && pathname.startsWith(page.href)); return <Link className={`page-card ${page.tone} ${active ? "active" : ""}`} key={page.href} href={page.href} onClick={() => setOpen(false)}><span className="page-card-number">{page.kicker}</span><span className="page-card-label">{page.label}</span><span className="page-card-description">{page.description}</span><span className="page-card-arrow">↗</span></Link>; })}</div><div className="site-menu-footer"><span>Scroll to explore</span><span>{pages.length} destinations</span></div></div>}
  </>;
}
