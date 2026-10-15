"use client";

import { SyntheticEvent, useState } from "react";
import { useLanguage } from "@/components/language";

export default function TransfersPage() {
  const { t } = useLanguage();
  const [dagNo, setDagNo] = useState("D-1042");
  const [khatianNo, setKhatianNo] = useState("K-7781");
  const [intent, setIntent] = useState<{ noticeId: string; status: string; auditHash?: string } | null>(null);
  const [otp, setOtp] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: SyntheticEvent, action: "create" | "confirm" | "veto", actor?: "buyer" | "seller") {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/demo-transfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, dagNo, khatianNo, noticeId: intent?.noticeId, actor, otp })
    });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "The transfer action could not be completed.");
    else setIntent(data.intent);
    setLoading(false);
  }

  return <section className="mx-auto max-w-4xl px-6 py-10">
    <div className="rounded-2xl border-t-4 border-gov-red bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold text-gov-green">Live synthetic workflow</p>
      <h1 className="mt-2 text-3xl font-black text-gov-dark">{t("transferTitle")}</h1>
      <p className="mt-4 leading-7 text-slate-600">{t("transferText")}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">{[t("buyer"), t("otp"), t("audit")].map((item, index) => <div key={item} className="rounded-xl bg-slate-50 p-4"><strong className="block text-2xl text-gov-green">0{index + 1}</strong><span className="text-sm">{item}</span></div>)}</div>
    </div>
    <form onSubmit={(event) => void submit(event, "create")} className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-gov-dark">1. Create purchase intent</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2"><label className="text-sm font-semibold">Dag No.<input value={dagNo} onChange={(event) => setDagNo(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2" /></label><label className="text-sm font-semibold">Khatian No.<input value={khatianNo} onChange={(event) => setKhatianNo(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2" /></label></div>
      <button disabled={loading || Boolean(intent && !["VETOED", "APPROVED"].includes(intent.status))} className="mt-4 rounded-xl bg-gov-green px-5 py-2.5 font-bold text-white disabled:opacity-50">{loading ? "Working..." : "Create intent"}</button>
    </form>
    {intent && <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
      <p className="text-xs font-bold uppercase tracking-wide text-gov-green">Notice {intent.noticeId}</p>
      <p className="mt-2 text-lg font-black text-gov-dark">Status: {intent.status}</p>
      <p className="mt-2 text-sm text-slate-700">Demo OTP: <strong>123456</strong>. In production this would be delivered privately to each party.</p>
      <label className="mt-4 block max-w-xs text-sm font-semibold">OTP<input value={otp} onChange={(event) => setOtp(event.target.value)} inputMode="numeric" className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2" /></label>
      <div className="mt-4 flex flex-wrap gap-2"><button onClick={(event) => void submit(event, "confirm", "buyer")} className="rounded-xl bg-gov-green px-4 py-2 text-sm font-bold text-white">Confirm buyer</button><button onClick={(event) => void submit(event, "confirm", "seller")} className="rounded-xl bg-gov-green px-4 py-2 text-sm font-bold text-white">Confirm seller</button><button onClick={(event) => void submit(event, "veto")} className="rounded-xl bg-gov-red px-4 py-2 text-sm font-bold text-white">Veto intent</button></div>
      {intent.auditHash && <p className="mt-4 break-all text-xs text-slate-600">Audit hash: {intent.auditHash}</p>}
    </div>}
    {error && <p className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">{error}</p>}
  </section>;
}
