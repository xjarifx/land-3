"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language";

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <section className="soft-grid min-h-[calc(100vh-80px)]">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-gov-green shadow-sm"><span className="status-dot h-2 w-2 rounded-full bg-emerald-500" />Public land confidence platform</div><h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-gov-dark md:text-7xl">{t("heroTitle")}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">{t("heroText")}</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/verify" className="rounded-xl bg-gov-green px-6 py-3 font-bold text-white shadow-lg shadow-emerald-900/20 hover:bg-gov-dark">{t("startVerification")} <span className="ml-2">→</span></Link><Link href="/transfers" className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-gov-dark hover:border-gov-green">{t("transfers")}</Link></div><p className="mt-5 text-xs font-semibold text-slate-500">Synthetic data environment · No government systems connected</p></div>
          <div className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-2xl shadow-emerald-950/10"><div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Live confidence view</p><p className="mt-1 font-black text-gov-dark">D-2189 / K-1103</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">Review needed</span></div><div className="mt-5 rounded-2xl bg-amber-50 p-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 text-xl">!</span><div><p className="font-black text-amber-950">Do not complete this purchase yet</p><p className="mt-1 text-sm text-amber-900/80">3 signals need attention before a buyer proceeds.</p></div></div></div><div className="mt-5 space-y-3">{["Mutation is still in progress","A court case is pending","An active purchase notice exists"].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700"><span className="text-amber-600">●</span>{item}<span className="ml-auto text-xs text-slate-400">View</span></div>)}</div><Link href="/verify?demo=review" className="mt-5 block rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white">Open this record</Link></div>
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-3">{[[t("clearTitle"), t("clearText"), "✓", "emerald"], [t("pendingTitle"), t("pendingText"), "!", "amber"], [t("disputeTitle"), t("disputeText"), "⌁", "red"]].map(([title, text, icon, color]) => <div key={title} className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color === "amber" ? "bg-amber-100 text-amber-800" : color === "red" ? "bg-red-100 text-red-800" : "bg-emerald-100 text-gov-green"} text-xl font-black`}>{icon}</span><h2 className="mt-4 font-bold text-gov-dark">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div>)}</div>
      </div>
    </section>
  );
}
