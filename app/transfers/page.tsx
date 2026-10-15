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

  return <section className="mx-auto max-w-5xl px-6 py-10">
    <div className="rounded-[1.75rem] bg-slate-950 p-8 text-white shadow-xl md:p-10">
      <div className="flex flex-wrap items-start justify-between gap-6"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Secure transaction workflow</p><h1 className="mt-3 text-3xl font-black md:text-5xl">{t("transferTitle")}</h1><p className="mt-4 max-w-2xl leading-7 text-slate-300">{t("transferText")}</p></div><span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-200">Demo environment</span></div>
      <div className="mt-8 grid gap-3 md:grid-cols-3">{[t("buyer"), t("otp"), t("audit")].map((item, index) => <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4"><strong className="block text-2xl text-emerald-300">0{index + 1}</strong><span className="mt-1 block text-sm text-slate-300">{item}</span></div>)}</div>
    </div>
    <form onSubmit={(event) => void submit(event, "create")} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 font-black text-gov-green">1</span><div><h2 className="text-xl font-black text-gov-dark">Choose the parcel</h2><p className="text-sm text-slate-500">Use the visible sample record below. No guessing required.</p></div></div>
      <div className="mt-4 grid gap-4 md:grid-cols-2"><label className="text-sm font-semibold">Dag No.<input value={dagNo} onChange={(event) => setDagNo(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2" /></label><label className="text-sm font-semibold">Khatian No.<input value={khatianNo} onChange={(event) => setKhatianNo(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2" /></label></div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs"><button type="button" onClick={() => { setDagNo("D-1042"); setKhatianNo("K-7781"); }} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 font-bold text-gov-green">Clear sample · D-1042 / K-7781</button><button type="button" onClick={() => { setDagNo("D-3307"); setKhatianNo("K-4420"); }} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-bold text-slate-600">Review sample · D-3307 / K-4420</button></div><button disabled={loading || Boolean(intent && !["VETOED", "APPROVED"].includes(intent.status))} className="mt-5 rounded-xl bg-gov-green px-5 py-2.5 font-bold text-white shadow-sm disabled:opacity-50">{loading ? "Working..." : "Create secure intent →"}</button>
    </form>
    {intent && <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wide text-gov-green">Purchase intent created</p><p className="mt-2 text-lg font-black text-gov-dark">Status: {intent.status.replace("_", " ")}</p></div><span className="rounded-full bg-white px-3 py-1 font-mono text-xs font-bold text-slate-500">{intent.noticeId}</span></div>
      <p className="mt-2 text-sm text-slate-700">Demo OTP: <strong>123456</strong>. In production this would be delivered privately to each party.</p>
      <label className="mt-4 block max-w-xs text-sm font-semibold">OTP<input value={otp} onChange={(event) => setOtp(event.target.value)} inputMode="numeric" className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2" /></label>
      <div className="mt-4 flex flex-wrap gap-2"><button onClick={(event) => void submit(event, "confirm", "buyer")} className="rounded-xl bg-gov-green px-4 py-2 text-sm font-bold text-white">Confirm buyer</button><button onClick={(event) => void submit(event, "confirm", "seller")} className="rounded-xl bg-gov-green px-4 py-2 text-sm font-bold text-white">Confirm seller</button><button onClick={(event) => void submit(event, "veto")} className="rounded-xl bg-gov-red px-4 py-2 text-sm font-bold text-white">Block this intent</button></div>
      {intent.auditHash && <p className="mt-4 break-all text-xs text-slate-600">Audit hash: {intent.auditHash}</p>}
    </div>}
    {error && <p className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">{error}</p>}
  </section>;
}
