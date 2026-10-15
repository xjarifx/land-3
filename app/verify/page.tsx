"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "@/components/language";

type Report = { parcel: { dagNo: string; khatianNo: string; district: string; upazila: string }; deed: { deedNo: string; registeredAt: string; registryOffice: string }; ownership: string; mutationStatus: string; taxRecords: { receiptNo: string; taxYear: string; status: string }[]; doublePurchaseRisk: boolean; courtCases: { caseNo: string; court: string; status: string }[]; activeIntents: { noticeId: string; status: string }[] };
const options = [["deed", "Registered deed", "DEED-2021-00491"], ["tax", "Land tax receipt", "LDT-2026-CTG-2189"], ["dag", "Dag No.", "D-2189"], ["khatian", "Khatian No.", "K-1103"]] as const;
const scenarios = [
  { key: "clearScenario", identifier: "deed", value: "DEED-2021-00491", detail: "D-1042 · Dhaka", color: "border-emerald-200 bg-emerald-50" },
  { key: "reviewScenario", identifier: "deed", value: "DEED-2019-01912", detail: "D-2189 · Chattogram", color: "border-amber-200 bg-amber-50" },
  { key: "disputeScenario", identifier: "dag", value: "D-3307", detail: "K-4420 · Rajshahi", color: "border-red-200 bg-red-50" },
  { key: "taxScenario", identifier: "tax", value: "LDT-2026-SYL-4451", detail: "D-4451 · Sylhet", color: "border-blue-200 bg-blue-50" }
];

export default function VerifyPage() {
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState<string>("deed"), [value, setValue] = useState<string>(options[0][2]);
  const [report, setReport] = useState<Report | null>(null), [error, setError] = useState(""), [loading, setLoading] = useState(false);
  async function search(event?: FormEvent, nextIdentifier = identifier, nextValue = value) {
    event?.preventDefault(); setLoading(true); setError(""); setReport(null);
    const response = await fetch(`/api/verify?identifier=${nextIdentifier}&value=${encodeURIComponent(nextValue)}`), data = await response.json();
    if (!response.ok) setError(data.error); else setReport(data); setLoading(false);
  }
  function choose(scenario: typeof scenarios[number]) { setIdentifier(scenario.identifier); setValue(scenario.value); void search(undefined, scenario.identifier, scenario.value); }
  return <section className="mx-auto max-w-6xl px-6 py-10">
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-7 shadow-sm md:px-8"><p className="text-sm font-semibold text-gov-green">{t("citizen")}</p><h1 className="mt-2 text-3xl font-black text-gov-dark">{t("verification")}</h1><p className="mt-2 max-w-3xl text-slate-600">{t("verificationText")}</p>
      <form onSubmit={(event) => void search(event)} className="mt-6 grid gap-4 md:grid-cols-[1fr_1.4fr_auto]"><label className="text-sm font-semibold">{t("searchType")}<select value={identifier} onChange={(event) => { setIdentifier(event.target.value); const option = options.find(([key]) => key === event.target.value); if (option) setValue(option[2]); }} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2">{options.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label className="text-sm font-semibold">{t("number")}<input value={value} onChange={(event) => setValue(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2" /></label><button disabled={loading || !value.trim()} className="self-end rounded-xl bg-gov-green px-6 py-2.5 font-bold text-white disabled:opacity-50">{loading ? t("searching") : t("search")}</button></form>
      <p className="mt-3 text-xs text-slate-500">{t("demoHint")}</p>
    </div>
    <div id="demo-scenarios" className="mt-8"><div className="mb-3 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-gov-green">One-click playground</p><h2 className="mt-1 text-xl font-black text-gov-dark">{t("demoScenarios")}</h2></div><span className="text-xs text-slate-500">4 varied records</span></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{scenarios.map((scenario) => <button key={scenario.key} onClick={() => choose(scenario)} className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${scenario.color}`}><span className="text-sm font-black text-gov-dark">{t(scenario.key as never)}</span><span className="mt-2 block text-xs text-slate-600">{scenario.detail}</span><span className="mt-4 inline-block text-xs font-bold text-gov-green">{t("useScenario")} →</span></button>)}</div></div>
    {error && <p className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">{error}</p>}{report && <ReportView report={report} />}
  </section>;
}

function ReportView({ report }: { report: Report }) {
  const { t } = useLanguage();
  const cards = [[t("district"), report.parcel.district], [t("upazila"), report.parcel.upazila], [t("dagKhatian"), `${report.parcel.dagNo} / ${report.parcel.khatianNo}`], [t("publicOwnership"), t("verifiedOwner")]];
  return <div className="mt-8 space-y-6">{report.doublePurchaseRisk && <div className="rounded-xl border-l-4 border-gov-red bg-red-50 p-5"><p className="text-sm font-bold uppercase tracking-wide text-red-700">{t("risk")}</p><h2 className="mt-1 text-xl font-bold text-red-900">{t("riskTitle")}</h2></div>}<div className="grid gap-4 md:grid-cols-4">{cards.map(([label, value]) => <div key={label} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-xs uppercase text-slate-500">{label}</p><p className="mt-2 font-bold text-gov-dark">{value}</p></div>)}</div><div className="grid gap-6 md:grid-cols-2"><div className="rounded-2xl bg-white shadow-sm"><h2 className="border-b bg-slate-50 px-5 py-4 font-bold text-gov-dark">{t("registeredDeed")}</h2><dl className="grid grid-cols-[1fr_1.4fr] gap-y-3 px-5 py-4 text-sm"><dt className="text-slate-500">{t("deedNumber")}</dt><dd className="font-semibold">{report.deed.deedNo}</dd><dt className="text-slate-500">{t("registrationDate")}</dt><dd>{report.deed.registeredAt}</dd><dt className="text-slate-500">{t("registryOffice")}</dt><dd>{report.deed.registryOffice}</dd><dt className="text-slate-500">{t("mutationStatus")}</dt><dd><StatusBadge status={report.mutationStatus} /></dd></dl></div><div className="rounded-2xl bg-white shadow-sm"><h2 className="border-b bg-slate-50 px-5 py-4 font-bold text-gov-dark">{t("landTax")}</h2><dl className="divide-y px-5 text-sm">{report.taxRecords.map((record) => <div key={record.receiptNo} className="grid grid-cols-[1fr_1.2fr] gap-y-2 py-4"><dt className="text-slate-500">{t("receiptYear")}</dt><dd><span className="block font-semibold">{record.receiptNo}</span><span className="text-xs text-slate-500">{record.taxYear}</span></dd><dt className="text-slate-500">{t("verificationStatus")}</dt><dd><StatusBadge status={record.status} /></dd></div>)}</dl></div></div><div className="grid gap-6 md:grid-cols-2"><Table title={t("notices")} rows={report.activeIntents.length ? report.activeIntents.map((item) => [item.noticeId, item.status]) : [[t("none"), t("noNotice")]]} /><Table title={t("disputes")} rows={report.courtCases.length ? report.courtCases.map((item) => [item.caseNo, item.status]) : [[t("none"), t("noCase")]]} /></div><p className="text-xs text-slate-500">{t("privacy")}</p></div>;
}
function StatusBadge({ status }: { status: string }) { return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${["UNDER_MUTATION", "PENDING", "REVIEW"].includes(status) ? "bg-amber-100 text-amber-900" : status === "REJECTED" ? "bg-red-100 text-red-900" : "bg-emerald-100 text-emerald-900"}`}>{status}</span>; }
function Table({ title, rows }: { title: string; rows: string[][] }) { return <div className="overflow-hidden rounded-2xl bg-white shadow-sm"><h2 className="border-b bg-slate-50 px-5 py-4 font-bold text-gov-dark">{title}</h2><table className="w-full text-left text-sm"><tbody>{rows.map((row, index) => <tr key={index} className="border-t">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-5 py-3 text-slate-700">{cell}</td>)}</tr>)}</tbody></table></div>; }
