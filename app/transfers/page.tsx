"use client";

import { useLanguage } from "@/components/language";

export default function TransfersPage() {
  const { t } = useLanguage();
  return <section className="mx-auto max-w-4xl px-6 py-16"><div className="rounded-2xl border-t-4 border-gov-red bg-white p-8 shadow-sm"><h1 className="text-3xl font-black text-gov-dark">{t("transferTitle")}</h1><p className="mt-4 leading-7 text-slate-600">{t("transferText")}</p><div className="mt-8 grid gap-4 md:grid-cols-3">{[t("buyer"), t("otp"), t("audit")].map((item, index) => <div key={item} className="rounded-xl bg-slate-50 p-4"><strong className="block text-2xl text-gov-green">0{index + 1}</strong><span className="text-sm">{item}</span></div>)}</div></div></section>;
}
