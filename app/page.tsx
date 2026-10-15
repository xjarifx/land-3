import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-3xl">
        <p className="mb-3 font-semibold uppercase tracking-widest text-gov-green">Early Warning & Verification Layer</p>
        <h1 className="text-4xl font-bold leading-tight text-gov-dark md:text-6xl">জমি কেনার আগে তথ্য যাচাই করুন</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Sub-Registry deed এবং AC Land mutation record-এর মধ্যবর্তী updating window lag দৃশ্যমান করে LandGuard BD।</p>
        <Link href="/verify" className="mt-8 inline-block rounded bg-gov-green px-7 py-3 font-bold text-white hover:bg-gov-dark">জমি যাচাই শুরু করুন</Link>
      </div>
      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {["Dag / Khatian যাচাই", "Pending transfer সতর্কতা", "Immutable audit trail"].map((item) => <div key={item} className="rounded border-t-4 border-gov-green bg-white p-6 shadow-sm"><h2 className="font-bold text-gov-dark">{item}</h2><p className="mt-2 text-sm text-slate-600">নিরাপদ, কাঠামোবদ্ধ ও নাগরিক-বান্ধব রেকর্ড সারাংশ।</p></div>)}
      </div>
    </section>
  );
}
