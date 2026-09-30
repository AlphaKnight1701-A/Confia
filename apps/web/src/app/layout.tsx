import type { Metadata } from "next";
import Link from "next/link";
import { DemoNotice } from "@confia/ui";
import SiteNavigation from "./SiteNavigation";
import "./globals.css";

export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"), title: "Confía | Business platform", description: "Transparent product information for AI-assisted shopping." };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><header className="site-header"><Link href="/" className="brand"><span className="brand-mark">C</span><span>Confía</span></Link><SiteNavigation /><div className="header-account"><span className="status-dot" /> DEMO WORKSPACE <span className="account-avatar">A</span></div></header><main className="site-main">{children}</main><footer className="site-footer"><DemoNotice /><span>AI helps you find it. Confía helps you trust it.</span><span>Built for transparent AI shopping</span></footer></body></html>;
}

