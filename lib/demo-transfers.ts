import dataset from "@/data/mock-government.json";
import { createAuditHash } from "@/lib/audit";

export type DemoIntent = {
  noticeId: string;
  status: "PENDING" | "BUYER_CONFIRMED" | "SELLER_CONFIRMED" | "APPROVED" | "VETOED";
  createdAt: string;
  vetoDeadline: string;
  buyerConfirmedAt?: string;
  sellerConfirmedAt?: string;
  auditHash?: string;
};

const initialIntents = new Map<string, DemoIntent[]>(
  dataset.plots.map((plot) => [
    `${plot.dagNo}:${plot.khatianNo}`,
    plot.activeIntents.map((intent) => ({
      noticeId: intent.noticeId,
      status: intent.status as DemoIntent["status"],
      createdAt: intent.createdAt,
      vetoDeadline: intent.vetoDeadline
    }))
  ])
);

const state = globalThis as typeof globalThis & {
  landGuardDemoIntents?: Map<string, DemoIntent[]>;
};

const intents = state.landGuardDemoIntents ?? initialIntents;
state.landGuardDemoIntents = intents;

export function getDemoIntents(dagNo: string, khatianNo: string): DemoIntent[] {
  return intents.get(`${dagNo.trim().toUpperCase()}:${khatianNo.trim().toUpperCase()}`) ?? [];
}

export function createDemoIntent(dagNo: string, khatianNo: string): DemoIntent {
  const key = `${dagNo.trim().toUpperCase()}:${khatianNo.trim().toUpperCase()}`;
  const now = Date.now();
  const intent: DemoIntent = {
    noticeId: `DEMO-${now}`,
    status: "PENDING",
    createdAt: new Date(now).toISOString(),
    vetoDeadline: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
    auditHash: createAuditHash({ noticeId: `DEMO-${now}`, dagNo, khatianNo, event: "CREATED", createdAt: new Date(now).toISOString() })
  };
  intents.set(key, [intent, ...(intents.get(key) ?? [])]);
  return intent;
}

export function confirmDemoIntent(dagNo: string, khatianNo: string, noticeId: string, actor: "buyer" | "seller", otp: string): DemoIntent | null {
  if (otp !== (process.env.DEMO_TRANSFER_OTP ?? "123456")) return null;
  const key = `${dagNo.trim().toUpperCase()}:${khatianNo.trim().toUpperCase()}`;
  const intent = (intents.get(key) ?? []).find((candidate) => candidate.noticeId === noticeId);
  if (!intent || !["PENDING", "BUYER_CONFIRMED", "SELLER_CONFIRMED"].includes(intent.status)) return null;
  if (new Date(intent.vetoDeadline).getTime() < Date.now()) return null;
  const now = new Date().toISOString();
  if (actor === "buyer") intent.buyerConfirmedAt = intent.buyerConfirmedAt ?? now;
  else intent.sellerConfirmedAt = intent.sellerConfirmedAt ?? now;
  intent.status = intent.buyerConfirmedAt && intent.sellerConfirmedAt ? "APPROVED" : actor === "buyer" ? "BUYER_CONFIRMED" : "SELLER_CONFIRMED";
  intent.auditHash = createAuditHash({ noticeId, actor, event: intent.status, timestamp: now });
  return intent;
}

export function vetoDemoIntent(dagNo: string, khatianNo: string, noticeId: string, otp: string): DemoIntent | null {
  if (otp !== (process.env.DEMO_TRANSFER_OTP ?? "123456")) return null;
  const key = `${dagNo.trim().toUpperCase()}:${khatianNo.trim().toUpperCase()}`;
  const plotIntents = intents.get(key) ?? [];
  const intent = plotIntents.find((candidate) => candidate.noticeId === noticeId);
  if (!intent || !["PENDING", "BUYER_CONFIRMED", "SELLER_CONFIRMED"].includes(intent.status)) return null;
  if (new Date(intent.vetoDeadline).getTime() < Date.now()) return null;
  intent.status = "VETOED";
  intent.auditHash = createAuditHash({ noticeId, event: "VETOED", timestamp: new Date().toISOString() });
  return intent;
}
