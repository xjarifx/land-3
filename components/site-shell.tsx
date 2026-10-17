"use client";

import Link from "next/link";
import { LanguageProvider, useAppMode, useLanguage } from "./language";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return <LanguageProvider><Shell>{children}</Shell></LanguageProvider>;
}

function Shell({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, t } = useLanguage();
  const { mode, setMode } = useAppMode();
  const isAdmin = mode === "admin";
  return <div className={`app-shell ${isAdmin ? "admin-theme" : "user-theme"}`}>
    <div className="gov-stripe" />
    <header className="sticky top-0 z-20 border-b border-emerald-900/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-3 text-gov-dark">
          <span className="brand-mark flex h-10 w-10 items-center justify-center rounded-2xl bg-gov-green text-sm font-black text-white shadow-lg shadow-emerald-900/20 sm:h-11 sm:w-11 sm:text-lg">LG</span>
          <span><strong className="block text-base tracking-tight sm:text-lg">LandGuard BD</strong><small className="hidden text-xs text-slate-500 sm:block">{t("brandTagline")}</small></span>
        </Link>
        <nav className="hidden items-center gap-2 text-sm font-semibold md:flex">
          <Link href="/" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-emerald-50 hover:text-gov-green">{t("home")}</Link><Link href="/verify" className="rounded-lg bg-emerald-50 px-3 py-2 text-gov-green">{t("verify")}</Link><Link href="/transfers" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-emerald-50 hover:text-gov-green">{t("transfers")}</Link><Link href="/admin" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-emerald-50 hover:text-gov-green">{t("admin")}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <div className="role-switch flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 text-[11px] font-bold sm:text-xs">
            <span className="sr-only">{t("mode")}</span>
            <button aria-pressed={mode === "user"} onClick={() => setMode("user")} className={`rounded-full px-2.5 py-1.5 sm:px-3 ${mode === "user" ? "bg-gov-green text-white" : "text-slate-500"}`}>{t("userMode")}</button>
            <button aria-pressed={mode === "admin"} onClick={() => setMode("admin")} className={`rounded-full px-2.5 py-1.5 sm:px-3 ${mode === "admin" ? "bg-gov-green text-white" : "text-slate-500"}`}>{t("adminMode")}</button>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-bold">
            <span className="sr-only">{t("language")}</span>
            <button onClick={() => setLanguage("en")} className={`rounded-full px-3 py-1.5 ${language === "en" ? "bg-gov-green text-white" : "text-slate-500"}`}>EN</button>
            <button onClick={() => setLanguage("bn")} className={`rounded-full px-3 py-1.5 ${language === "bn" ? "bg-gov-green text-white" : "text-slate-500"}`}>বাংলা</button>
          </div>
        </div>
      </div>
    </header>
    <main className="pb-20 md:pb-0">{children}</main>
    <nav aria-label="Mobile navigation" className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-4 border-t border-slate-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,.08)] backdrop-blur md:hidden">
      <Link href="/" className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-bold text-slate-500"><span className="text-lg">⌂</span>{t("home")}</Link>
      <Link href="/verify" className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-bold text-gov-green"><span className="text-lg">⌕</span>{t("verify")}</Link>
      <Link href="/transfers" className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-bold text-slate-500"><span className="text-lg">⇄</span>{t("transfers")}</Link>
      <Link href="/admin" className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-bold text-slate-500"><span className="text-lg">▣</span>{t("admin")}</Link>
    </nav>
    <footer className="mt-20 bg-gov-dark py-10 text-center text-sm text-white"><p>LandGuard BD — LandTech 2026 MVP</p><p className="mt-2 text-emerald-100">{t("footer")}</p></footer>
  </div>;
}
