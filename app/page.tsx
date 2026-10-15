"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language";

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-gov-dark via-gov-green to-emerald-700 px-7 py-12 text-white shadow-2xl shadow-emerald-950/20 md:px-14">
        <div className="max-w-3xl">
          <p className="mb-4 font-semibold uppercase tracking-[0.2em] text-emerald-200">{t("demoBadge")}</p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">{t("heroTitle")}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50">{t("heroText")}</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/verify" className="rounded-xl bg-white px-6 py-3 font-bold text-gov-dark hover:bg-emerald-50">{t("startVerification")}</Link><Link href="/verify#demo-scenarios" className="rounded-xl border border-white/40 px-6 py-3 font-bold text-white hover:bg-white/10">{t("exploreScenarios")}</Link></div>
        </div>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[[t("clearTitle"), t("clearText"), "✓"], [t("pendingTitle"), t("pendingText"), "!"], [t("disputeTitle"), t("disputeText"), "⌁"]].map(([title, text, icon]) => <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl font-black text-gov-green">{icon}</span><h2 className="mt-5 font-bold text-gov-dark">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}
      </div>
    </section>
  );
}
