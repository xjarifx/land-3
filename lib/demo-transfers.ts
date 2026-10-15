import dataset from "@/data/mock-government.json";

export type DemoIntent = {
  noticeId: string;
  status: "PENDING" | "VETOED";
  createdAt: string;
  vetoDeadline: string;
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
    vetoDeadline: new Date(now + 24 * 60 * 60 * 1000).toISOString()
  };
  intents.set(key, [intent, ...(intents.get(key) ?? [])]);
  return intent;
}

export function vetoDemoIntent(dagNo: string, khatianNo: string, noticeId: string): DemoIntent | null {
  const key = `${dagNo.trim().toUpperCase()}:${khatianNo.trim().toUpperCase()}`;
  const plotIntents = intents.get(key) ?? [];
  const intent = plotIntents.find((candidate) => candidate.noticeId === noticeId);
  if (!intent || intent.status !== "PENDING") return null;
  if (new Date(intent.vetoDeadline).getTime() < Date.now()) return null;
  intent.status = "VETOED";
  return intent;
}
