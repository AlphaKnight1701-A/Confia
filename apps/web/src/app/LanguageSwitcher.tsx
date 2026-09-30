"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, startTransition } from "react";
import type { Locale } from "./i18n";

export default function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState(locale);

  useEffect(() => setCurrentLocale(locale), [locale]);

  function changeLocale(nextLocale: Locale) {
    document.cookie = `confia-locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    setCurrentLocale(nextLocale);
    startTransition(() => router.refresh());
  }

  return (
    <div className="language-switcher" aria-label={label}>
      <button type="button" className={currentLocale === "en" ? "active" : ""} onClick={() => changeLocale("en")}>EN</button>
      <span aria-hidden="true">/</span>
      <button type="button" className={currentLocale === "es" ? "active" : ""} onClick={() => changeLocale("es")}>ES</button>
    </div>
  );
}
