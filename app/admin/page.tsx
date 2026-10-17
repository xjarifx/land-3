"use client";

import { useEffect, useState } from "react";
import { useAppMode, useLanguage } from "@/components/language";

type RequestItem = { id: string; dagNo: string; khatianNo: string; requestedDocuments: string[]; note: string; status: "PENDING" | "APPROVED" | "REJECTED"; createdAt: string; reviewReason: string | null };

export default function AdminPage() {
  const { t } = useLanguage();
  const { setMode } = useAppMode();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [reason, setReason] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch("/api/paperwork-requests", { headers: { "x-demo-admin-key": "landguard-demo-admin" } });
    const data = await response.json();
    if (response.ok) setRequests(data.requests);
    else setError(data.error ?? "Could not load paperwork requests.");
  }
  useEffect(() => { setMode("admin"); void load(); }, [setMode]);

  async function decide(id: string, status: "APPROVED" | "REJECTED") {
    setError("");
    const response = await fetch("/api/paperwork-requests", { method: "POST", headers: { "Content-Type": "application/json", "x-demo-admin-key": "landguard-demo-admin" }, body: JSON.stringify({ id, status, reason: reason[id] }) });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Could not update request.");
    else await load();
  }

  return <section className="mx-auto max-w-6xl px-6 py-10"><div className="border-b-4 border-gov-green bg-white px-6 py-7 shadow-sm"><p className="text-sm font-semibold text-gov-green">প্রশাসনিক প্যানেল / Admin Mode</p><h1 className="mt-2 text-3xl font-black text-gov-dark">Pending paperwork review queue</h1><p className="mt-2 max-w-3xl text-slate-600">Review user-submitted parcel requests and simulate approval or rejection of the requested land paperwork.</p></div>{error && <p className="mt-6 rounded border border-red-300 bg-red-50 p-4 text-red-800">{error}</p>}<div className="mt-8 space-y-4">{requests.length === 0 && <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm">No user review requests yet. Switch to User mode, verify a parcel, and submit a review request.</div>}{requests.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs font-bold text-slate-500">{item.id}</p><h2 className="mt-1 text-lg font-black text-gov-dark">{item.dagNo} / {item.khatianNo}</h2><p className="mt-1 text-sm text-slate-600">{item.note}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.status === "PENDING" ? "bg-amber-100 text-amber-900" : item.status === "APPROVED" ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"}`}>{item.status}</span></div><div className="mt-4 flex flex-wrap gap-2">{item.requestedDocuments.map((document) => <span key={document} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{document}</span>)}</div>{item.status === "PENDING" && <><textarea value={reason[item.id] ?? ""} onChange={(event) => setReason((current) => ({ ...current, [item.id]: event.target.value }))} placeholder="Reason required when rejecting" className="mt-4 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" rows={2} /><div className="mt-3 flex gap-2"><button onClick={() => void decide(item.id, "APPROVED")} className="rounded-xl bg-gov-green px-4 py-2 text-sm font-bold text-white">{t("approve")}</button><button onClick={() => void decide(item.id, "REJECTED")} className="rounded-xl bg-gov-red px-4 py-2 text-sm font-bold text-white">{t("reject")}</button></div></>}</article>)}</div><p className="mt-5 text-xs text-slate-500">Admin actions are simulated against synthetic in-memory data. Each decision receives an audit hash.</p></section>;
}
