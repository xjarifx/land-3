"use client";

import { useEffect, useState } from "react";
import { useAppMode, useLanguage } from "@/components/language";

type Review = {
  receiptNo: string; dagNo: string; khatianNo: string; district: string; taxYear: string;
  status: "PENDING" | "VERIFIED" | "REJECTED"; reviewedAt: string | null; reviewer: string | null;
  reason: string | null; auditHash: string | null;
};

export default function AdminPage() {
  const { t } = useLanguage();
  const { setMode } = useAppMode();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");
  const [reason, setReason] = useState<Record<string, string>>({});

  async function load() {
    const response = await fetch("/api/admin/tax", { headers: { "x-demo-admin-key": "landguard-demo-admin" } });
    const data = await response.json();
    if (response.ok) setReviews(data.reviews);
    else setError(data.error ?? "Could not load tax reviews.");
  }

  useEffect(() => {
    setMode("admin");
    void load();
  }, [setMode]);

  async function decide(receiptNo: string, status: "VERIFIED" | "REJECTED") {
    setError("");
    const response = await fetch("/api/admin/tax", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-demo-admin-key": "landguard-demo-admin" },
      body: JSON.stringify({ receiptNo, status, reason: reason[receiptNo] })
    });
    const data = await response.json();
    if (!response.ok) setError(data.error);
    else await load();
  }

  return <section className="mx-auto max-w-6xl px-6 py-10">
    <div className="border-b-4 border-gov-green bg-white px-6 py-7 shadow-sm">
      <p className="text-sm font-semibold text-gov-green">প্রশাসনিক প্যানেল / Admin Mode</p>
      <h1 className="mt-2 text-3xl font-black text-gov-dark">{t("adminTitle")}</h1>
      <p className="mt-2 max-w-3xl text-slate-600">{t("adminText")}</p>
    </div>
    {error && <p className="mt-6 rounded border border-red-300 bg-red-50 p-4 text-red-800">{error}</p>}
    <div className="mt-8 space-y-3 md:hidden">{reviews.map((review) => <article key={review.receiptNo} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><strong className="text-sm text-slate-900">{review.receiptNo}</strong><span className="mt-1 block text-xs text-slate-500">{review.district} · {review.dagNo} / {review.khatianNo}</span></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${review.status === "PENDING" ? "bg-amber-100 text-amber-900" : review.status === "VERIFIED" ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"}`}>{review.status}</span></div><p className="mt-3 text-xs text-slate-500">Tax year <strong className="text-slate-700">{review.taxYear}</strong></p><textarea value={reason[review.receiptNo] ?? ""} onChange={(event) => setReason((current) => ({ ...current, [review.receiptNo]: event.target.value }))} placeholder="Reason required for rejection" className="mt-3 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs" rows={2} /><div className="mt-2 grid grid-cols-2 gap-2"><button onClick={() => decide(review.receiptNo, "VERIFIED")} className="rounded-xl bg-gov-green px-3 py-2 text-xs font-bold text-white">Approve</button><button onClick={() => decide(review.receiptNo, "REJECTED")} className="rounded-xl bg-gov-red px-3 py-2 text-xs font-bold text-white">Reject</button></div></article>)}</div>
    <div className="mt-8 hidden overflow-x-auto rounded bg-white shadow-sm md:block">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">Receipt</th><th className="px-5 py-4">Parcel</th><th className="px-5 py-4">Tax year</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Review action</th></tr></thead>
        <tbody>{reviews.map((review) => <tr key={review.receiptNo} className="border-t align-top">
          <td className="px-5 py-4"><strong>{review.receiptNo}</strong><span className="mt-1 block text-xs text-slate-500">{review.district}</span></td>
          <td className="px-5 py-4">{review.dagNo} / {review.khatianNo}</td>
          <td className="px-5 py-4">{review.taxYear}</td>
          <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${review.status === "PENDING" ? "bg-amber-100 text-amber-900" : review.status === "VERIFIED" ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"}`}>{review.status}</span>{review.reviewedAt && <span className="mt-2 block text-xs text-slate-500">{new Date(review.reviewedAt).toLocaleString("en-BD")}</span>}</td>
          <td className="px-5 py-4">
            <textarea value={reason[review.receiptNo] ?? ""} onChange={(event) => setReason((current) => ({ ...current, [review.receiptNo]: event.target.value }))} placeholder="Reason required for rejection" className="mb-2 block w-full rounded border border-slate-300 px-3 py-2 text-xs" rows={2} />
            <div className="flex gap-2"><button onClick={() => decide(review.receiptNo, "VERIFIED")} className="rounded bg-gov-green px-3 py-2 text-xs font-bold text-white">{t("approve")}</button><button onClick={() => decide(review.receiptNo, "REJECTED")} className="rounded bg-gov-red px-3 py-2 text-xs font-bold text-white">{t("reject")}</button></div>
          </td>
        </tr>)}</tbody>
      </table>
    </div>
    <p className="mt-4 text-xs text-slate-500">Every decision creates a SHA-256 audit hash. Production deployment should protect this route with admin authentication and role-based access control.</p>
  </section>;
}
