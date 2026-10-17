"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "bn";
export type AppMode = "user" | "admin";

const translations = {
  en: {
    brandTagline: "Land verification & early warning service",
    home: "Home",
    verify: "Verify land",
    transfers: "Transfer safety",
    admin: "Admin",
    language: "Language",
    mode: "View",
    userMode: "User",
    adminMode: "Admin",
    english: "English",
    bangla: "বাংলা",
    demoBadge: "Land record confidence, made clear",
    heroTitle: "Verify every land paper before you buy",
    heroText: "LandGuard BD is a Bangladesh-focused one-stop check for deed, mutation, khatian, tax, and sale-paperwork updates.",
    startVerification: "Start verification",
    exploreScenarios: "Try demo scenarios",
    clearTitle: "Clear record",
    pendingTitle: "Pending mutation",
    disputeTitle: "Dispute flag",
    clearText: "Deed and mutation are synchronized.",
    pendingText: "See how an incomplete mutation is highlighted.",
    disputeText: "Review a record with a court case and notice.",
    footer: "Dummy structured data only. Not an official government record.",
    citizen: "Citizen service",
    verification: "One-stop land paperwork verification",
    verificationText: "Search one record and see whether the deed is recorded, mutation or khatian paperwork is updating, tax is verified, and another sale process is active.",
    searchType: "Search type",
    number: "Number",
    search: "Search record",
    searching: "Searching...",
    demoHint: "Choose a scenario below to fill the form and view its result instantly.",
    demoScenarios: "Demo scenarios",
    useScenario: "Try scenario",
    clearScenario: "Clear & synchronized",
    reviewScenario: "Mutation in progress",
    disputeScenario: "Court case flag",
    taxScenario: "Verified tax record",
    risk: "Double-purchase risk warning",
    riskTitle: "This land may already be sold or under active paperwork",
    riskAction: "Do not pay or proceed until the latest deed, mutation, and khatian status is confirmed with the responsible land office.",
    district: "District",
    upazila: "Upazila",
    dagKhatian: "Dag / Khatian",
    publicOwnership: "Public ownership view",
    verifiedOwner: "Verified owner record",
    registeredDeed: "Registered deed",
    deedNumber: "Deed number",
    registrationDate: "Registration date",
    registryOffice: "Registry office",
    mutationStatus: "Mutation status",
    landTax: "Land development tax",
    receiptYear: "Receipt / year",
    verificationStatus: "Verification",
    notices: "Active public notices",
    disputes: "Court / dispute flags",
    none: "None",
    noNotice: "No active notice",
    noCase: "No pending case in dataset",
    privacy: "Synthetic-data note: this is a demonstration report, not an official government record. Confirm the latest paperwork with the responsible Bangladesh land office.",
    khasStatus: "Khas / acquisition status",
    ownershipHistory: "Ownership history",
    adminTitle: "Land development tax review",
    adminText: "Review uploaded tax receipt metadata and publish only a verification status.",
    approve: "Approve",
    reject: "Reject",
    transferTitle: "Intent to purchase / pending review",
    transferText: "A transfer notice is approved only after both buyer and registered seller confirm with NID/OTP.",
    buyer: "Buyer initiates notice",
    otp: "Both parties confirm OTP",
    audit: "Audit hash is recorded"
  },
  bn: {
    brandTagline: "ভূমি যাচাই ও সতর্কতা সেবা",
    home: "হোম",
    verify: "জমি যাচাই",
    transfers: "হস্তান্তর নিরাপত্তা",
    admin: "অ্যাডমিন",
    language: "ভাষা",
    mode: "ভিউ",
    userMode: "ব্যবহারকারী",
    adminMode: "অ্যাডমিন",
    english: "English",
    bangla: "বাংলা",
    demoBadge: "সহজে ভূমি রেকর্ডের নির্ভরযোগ্যতা বুঝুন",
    heroTitle: "কেনার আগে জমির সব কাগজ যাচাই করুন",
    heroText: "বাংলাদেশের জন্য তৈরি এক জায়গার যাচাই সেবায় দলিল, নামজারি, খতিয়ান, কর ও বিক্রয়-সংক্রান্ত কাগজের হালনাগাদ দেখুন।",
    startVerification: "যাচাই শুরু করুন",
    exploreScenarios: "ডেমো দেখুন",
    clearTitle: "পরিষ্কার রেকর্ড",
    pendingTitle: "নামজারি অপেক্ষমাণ",
    disputeTitle: "বিরোধের সংকেত",
    clearText: "দলিল ও নামজারি তথ্য সামঞ্জস্যপূর্ণ।",
    pendingText: "অসম্পূর্ণ নামজারি কীভাবে দেখানো হয় দেখুন।",
    disputeText: "মামলা ও নোটিশ থাকা রেকর্ড পর্যালোচনা করুন।",
    footer: "শুধু ডেমোর কাঠামোবদ্ধ তথ্য। এটি সরকারি রেকর্ড নয়।",
    citizen: "নাগরিক সেবা",
    verification: "এক জায়গায় জমির কাগজ যাচাই",
    verificationText: "একটি রেকর্ড খুঁজে দেখুন দলিল আছে কি না, নামজারি বা খতিয়ানের কাজ চলছে কি না, কর যাচাই হয়েছে কি না এবং অন্য বিক্রয়-প্রক্রিয়া সক্রিয় কি না।",
    searchType: "অনুসন্ধানের ধরন",
    number: "নম্বর",
    search: "রেকর্ড খুঁজুন",
    searching: "খোঁজা হচ্ছে...",
    demoHint: "নিচের একটি ডেমো বেছে নিলে ফর্ম পূরণ হয়ে ফলাফল সঙ্গে সঙ্গে দেখাবে।",
    demoScenarios: "ডেমো পরিস্থিতি",
    useScenario: "পরিস্থিতি দেখুন",
    clearScenario: "পরিষ্কার ও সামঞ্জস্যপূর্ণ",
    reviewScenario: "নামজারি চলছে",
    disputeScenario: "মামলার সংকেত",
    taxScenario: "কর যাচাই হয়েছে",
    risk: "দ্বৈত ক্রয়ের ঝুঁকি সতর্কতা",
    riskTitle: "এই জমি বিক্রি হয়ে থাকতে পারে বা কাগজের কাজ চলছে",
    riskAction: "টাকা দেবেন না বা এগোবেন না। সংশ্লিষ্ট ভূমি অফিসে সর্বশেষ দলিল, নামজারি ও খতিয়ানের অবস্থা নিশ্চিত করুন।",
    district: "জেলা",
    upazila: "উপজেলা",
    dagKhatian: "দাগ / খতিয়ান",
    publicOwnership: "প্রকাশ্য মালিকানা তথ্য",
    verifiedOwner: "মালিকানা যাচাই হয়েছে",
    registeredDeed: "নিবন্ধিত দলিল",
    deedNumber: "দলিল নম্বর",
    registrationDate: "নিবন্ধনের তারিখ",
    registryOffice: "রেজিস্ট্রি অফিস",
    mutationStatus: "নামজারি অবস্থা",
    landTax: "ভূমি উন্নয়ন কর",
    receiptYear: "রসিদ / বছর",
    verificationStatus: "যাচাই",
    notices: "সক্রিয় প্রকাশ্য নোটিশ",
    disputes: "মামলা / বিরোধের সংকেত",
    none: "কোনোটিই নেই",
    noNotice: "কোনো সক্রিয় নোটিশ নেই",
    noCase: "ডেটাসেটে কোনো চলমান মামলা নেই",
    privacy: "সিন্থেটিক ডেটা: এটি ডেমো রিপোর্ট, সরকারি রেকর্ড নয়। সংশ্লিষ্ট ভূমি অফিসে সর্বশেষ কাগজ নিশ্চিত করুন।",
    khasStatus: "খাস / অধিগ্রহণ অবস্থা",
    ownershipHistory: "মালিকানার ইতিহাস",
    adminTitle: "ভূমি উন্নয়ন কর পর্যালোচনা",
    adminText: "কর রসিদের তথ্য যাচাই করে শুধু যাচাইয়ের অবস্থা প্রকাশ করুন।",
    approve: "অনুমোদন",
    reject: "বাতিল",
    transferTitle: "ক্রয়ের ইচ্ছা / অপেক্ষমাণ পর্যালোচনা",
    transferText: "ক্রেতা ও নিবন্ধিত বিক্রেতা এনআইডি/ওটিপি দিয়ে নিশ্চিত করার পরই হস্তান্তর অনুমোদিত হয়।",
    buyer: "ক্রেতা নোটিশ শুরু করেন",
    otp: "উভয় পক্ষ ওটিপি নিশ্চিত করেন",
    audit: "অডিট হ্যাশ সংরক্ষিত হয়"
  }
} as const;

type TranslationKey = keyof typeof translations.en;
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (key: TranslationKey) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);
type AppModeContextValue = { mode: AppMode; setMode: (mode: AppMode) => void };
const AppModeContext = createContext<AppModeContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [mode, setMode] = useState<AppMode>("user");
  useEffect(() => {
    const saved = window.localStorage.getItem("landguard-language");
    if (saved === "bn" || saved === "en") setLanguage(saved);
    const savedMode = window.localStorage.getItem("landguard-mode");
    if (savedMode === "admin" || savedMode === "user") setMode(savedMode);
  }, []);
  useEffect(() => {
    window.localStorage.setItem("landguard-language", language);
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    window.localStorage.setItem("landguard-mode", mode);
    document.documentElement.dataset.mode = mode;
  }, [mode]);
  return <LanguageContext.Provider value={{ language, setLanguage, t: (key) => translations[language][key] }}><AppModeContext.Provider value={{ mode, setMode }}>{children}</AppModeContext.Provider></LanguageContext.Provider>;
}

export function useAppMode() {
  const context = useContext(AppModeContext);
  if (!context) throw new Error("useAppMode must be used inside LanguageProvider");
  return context;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
