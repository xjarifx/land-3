"use client";

import Link from "next/link";
import { LanguageProvider, useLanguage } from "./language";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return <LanguageProvider><Shell>{children}</Shell></LanguageProvider>;
}

function Shell({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, t } = useLanguage();
  return <>
    <div className="gov-stripe" />
    <header className="sticky top-0 z-20 border-b border-emerald-900/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-gov-dark">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gov-green text-lg font-black text-white shadow-lg shadow-emerald-900/20">LG</span>
          <span><strong className="block text-lg tracking-tight">LandGuard BD</strong><small className="text-xs text-slate-500">{t("brandTagline")}</small></span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-gov-green md:flex">
          <Link href="/">{t("home")}</Link><Link href="/verify">{t("verify")}</Link><Link href="/transfers">{t("transfers")}</Link><Link href="/admin">{t("admin")}</Link>
        </nav>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-bold">
          <span className="sr-only">{t("language")}</span>
          <button onClick={() => setLanguage("en")} className={`rounded-full px-3 py-1.5 ${language === "en" ? "bg-gov-green text-white" : "text-slate-500"}`}>EN</button>
          <button onClick={() => setLanguage("bn")} className={`rounded-full px-3 py-1.5 ${language === "bn" ? "bg-gov-green text-white" : "text-slate-500"}`}>বাংলা</button>
        </div>
      </div>
    </header>
    <main>{children}</main>
    <footer className="mt-20 bg-gov-dark py-10 text-center text-sm text-white"><p>LandGuard BD — LandTech 2026 MVP</p><p className="mt-2 text-emerald-100">{t("footer")}</p></footer>
  </>;
}
