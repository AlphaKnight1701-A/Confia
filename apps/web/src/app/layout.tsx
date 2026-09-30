import type { Metadata } from "next";
import Link from "next/link";
import SiteNavigation from "./SiteNavigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { getLocale } from "./locale";
import { t } from "./i18n";
import "./globals.css";

export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"), title: "Confía | Business platform", description: "Transparent product information for AI-assisted shopping." };
export default async function Layout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return <html lang={locale}><body><header className="site-header"><Link href="/" className="brand"><span className="brand-mark">C</span><span>Confía</span></Link><div className="header-controls"><div className="header-account"><span className="status-dot" /> {t(locale, "demoWorkspace")} <span className="account-avatar">A</span></div><LanguageSwitcher locale={locale} label={t(locale, "switchLanguage")} /><SiteNavigation locale={locale} /></div></header><main className="site-main">{children}</main><footer className="site-footer"><span className="demo-notice">{t(locale, "demoNotice")}</span><span>{t(locale, "footerTagline")}</span><span>{t(locale, "footerBuilt")}</span></footer></body></html>;
}
