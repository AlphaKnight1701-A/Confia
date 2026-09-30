import type { Metadata } from "next";
import Link from "next/link";
import { DemoNotice } from "@confia/ui";
import "./globals.css";

export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"), title: "Confĩa | Business platform", description: "Transparent product information for AI-assisted shopping." };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><header><Link href="/" className="brand">Confĩa</Link><nav aria-label="Main navigation"><Link href="/dashboard">Dashboard</Link><Link href="/dashboard/products">Products</Link><Link href="/dashboard/verification">Verification</Link><Link href="/dashboard/discrepancies">Discrepancies</Link><Link href="/dashboard/analytics">Analytics</Link></nav></header><main><DemoNotice />{children}</main><footer>AI helps you find it. Confĩa helps you trust it.</footer></body></html>;
}

