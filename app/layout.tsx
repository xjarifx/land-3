import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "LandGuard BD | Early Warning & Verification Layer",
  description: "A demonstration verification layer for Bangladeshi land records."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body>
        <div className="gov-stripe" />
        <header className="border-b border-emerald-900/20 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3 text-gov-dark">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gov-green text-xl font-bold">BD</span>
              <span><strong className="block text-xl">LandGuard BD</strong><small className="text-xs">ভূমি যাচাই ও সতর্কতা সেবা</small></span>
            </Link>
            <nav className="flex gap-5 text-sm font-semibold text-gov-green">
              <Link href="/verify">জমি যাচাই</Link>
              <Link href="/admin">অ্যাডমিন</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 bg-gov-dark py-8 text-center text-sm text-white">
          <p>LandGuard BD — LandTech 2026 MVP demonstration</p>
          <p className="mt-1 text-emerald-100">Dummy structured data only. Not an official government record.</p>
        </footer>
      </body>
    </html>
  );
}
