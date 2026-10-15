"use client";

import { FormEvent, useState } from "react";

type Report = {
  parcel: { dagNo: string; khatianNo: string; district: string; upazila: string };
  deed: { deedNo: string; registeredAt: string; registryOffice: string };
  ownership: string;
  mutationStatus: string;
  taxRecords: { receiptNo: string; taxYear: string; status: string }[];
  doublePurchaseRisk: boolean;
  courtCases: { caseNo: string; court: string; status: string }[];
  activeIntents: { noticeId: string; status: string; vetoDeadline: string }[];
  syncHealth: { score: number; label: string; warning: string | null };
};

const searchOptions = [
  ["deed", "Registered Deed / Dolil No.", "DEED-2019-01912"],
  ["tax", "Land Development Tax Receipt No.", "LDT-2026-CTG-2189"],
  ["dag", "Dag No.", "D-2189"],
  ["khatian", "Khatian No.", "K-1103"]
] as const;

export default function VerifyPage() {
  const [identifier, setIdentifier] = useState("deed");
  const [value, setValue] = useState("DEED-2019-01912");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function search(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setReport(null);
    const response = await fetch(`/api/verify?identifier=${identifier}&value=${encodeURIComponent(value)}`);
    const data = await response.json();
    if (!response.ok) setError(data.error);
    else setReport(data);
    setLoading(false);
  }

  function changeIdentifier(next: string) {
    setIdentifier(next);
    const option = searchOptions.find(([key]) => key === next);
    if (option) setValue(option[2]);
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="border-b-4 border-gov-green bg-white px-6 py-7 shadow-sm">
        <p className="text-sm font-semibold text-gov-green">নাগরিক সেবা / Citizen Mode</p>
        <h1 className="mt-2 text-3xl font-bold text-gov-dark">Land & Tax Verification</h1>
        <p className="mt-2 max-w-3xl text-slate-600">Search by a registered deed, land development tax receipt, Dag, or Khatian number. Personal names, NIDs, mobile numbers, and tax amounts are never displayed.</p>
        <form onSubmit={search} className="mt-6 grid gap-4 md:grid-cols-[1fr_1.4fr_auto]">
          <label className="text-sm font-semibold">Search type
            <select value={identifier} onChange={(event) => changeIdentifier(event.target.value)} className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2">
              {searchOptions.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">Number
            <input value={value} onChange={(event) => setValue(event.target.value)} className="mt-1 block w-full rounded border border-slate-300 px-3 py-2" />
          </label>
          <button disabled={loading || !value.trim()} className="self-end rounded bg-gov-green px-6 py-2 font-bold text-white disabled:opacity-50">{loading ? "Searching..." : "Search record"}</button>
        </form>
        <p className="mt-3 text-xs text-slate-500">Demo values are prefilled. Try <code>DEED-2019-01912</code> to see an active mutation warning.</p>
      </div>

      {error && <p className="mt-6 rounded border border-red-300 bg-red-50 p-4 text-red-800">{error}</p>}
      {report && <ReportView report={report} />}
    </section>
  );
}

function ReportView({ report }: { report: Report }) {
  return <div className="mt-8 space-y-6">
    {report.doublePurchaseRisk && <div className="rounded border-l-4 border-gov-red bg-red-50 p-5">
      <p className="text-sm font-bold uppercase tracking-wide text-red-700">Double-purchase risk warning</p>
      <h2 className="mt-1 text-xl font-bold text-red-900">This parcel has an active sale or mutation risk</h2>
      <p className="mt-2 text-sm leading-6 text-red-900">A registered deed exists, but the AC Land mutation is not complete. Do not enter into another purchase until the mutation and tax records are independently confirmed.</p>
    </div>}

    <div className="grid gap-4 md:grid-cols-4">
      {[
        ["District", report.parcel.district],
        ["Upazila", report.parcel.upazila],
        ["Dag / Khatian", `${report.parcel.dagNo} / ${report.parcel.khatianNo}`],
        ["Public ownership view", report.ownership]
      ].map(([label, value]) => <div key={label} className="rounded bg-white p-5 shadow-sm"><p className="text-xs uppercase text-slate-500">{label}</p><p className="mt-2 font-bold text-gov-dark">{value}</p></div>)}
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded bg-white shadow-sm">
        <h2 className="border-b bg-slate-50 px-5 py-4 font-bold text-gov-dark">Registered deed</h2>
        <dl className="grid grid-cols-[1fr_1.4fr] gap-y-3 px-5 py-4 text-sm">
          <dt className="text-slate-500">Deed number</dt><dd className="font-semibold">{report.deed.deedNo}</dd>
          <dt className="text-slate-500">Registration date</dt><dd>{report.deed.registeredAt}</dd>
          <dt className="text-slate-500">Registry office</dt><dd>{report.deed.registryOffice}</dd>
          <dt className="text-slate-500">Mutation status</dt><dd><StatusBadge status={report.mutationStatus} /></dd>
        </dl>
      </div>
      <div className="rounded bg-white shadow-sm">
        <h2 className="border-b bg-slate-50 px-5 py-4 font-bold text-gov-dark">Land development tax</h2>
        <dl className="divide-y px-5 text-sm">{report.taxRecords.map((record) => <div key={record.receiptNo} className="grid grid-cols-[1fr_1.2fr] gap-y-2 py-4"><dt className="text-slate-500">Receipt / year</dt><dd><span className="block font-semibold">{record.receiptNo}</span><span className="text-xs text-slate-500">{record.taxYear}</span></dd><dt className="text-slate-500">Verification</dt><dd><StatusBadge status={record.status} /></dd></div>)}</dl>
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      <Table title="Active public notices" headers={["Notice", "Status"]} rows={report.activeIntents.length ? report.activeIntents.map((item) => [item.noticeId, item.status]) : [["None", "No active notice"]]} />
      <Table title="Court / dispute flags" headers={["Reference", "Status"]} rows={report.courtCases.length ? report.courtCases.map((item) => [item.caseNo, item.status]) : [["None", "No pending case in dataset"]]} />
    </div>
    <p className="text-xs text-slate-500">Privacy note: this public result intentionally excludes personal identity and financial details. Verify original documents with the relevant authority before purchase.</p>
  </div>;
}

function StatusBadge({ status }: { status: string }) {
  const warning = ["UNDER_MUTATION", "PENDING", "REVIEW"].includes(status);
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${warning ? "bg-amber-100 text-amber-900" : status === "REJECTED" ? "bg-red-100 text-red-900" : "bg-emerald-100 text-emerald-900"}`}>{status}</span>;
}

function Table({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return <div className="overflow-hidden rounded bg-white shadow-sm"><h2 className="border-b bg-slate-50 px-5 py-4 font-bold text-gov-dark">{title}</h2><table className="w-full text-left text-sm"><thead><tr>{headers.map((header) => <th key={header} className="px-5 py-3 font-semibold text-slate-500">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index} className="border-t">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-5 py-3 text-slate-700">{cell}</td>)}</tr>)}</tbody></table></div>;
}
