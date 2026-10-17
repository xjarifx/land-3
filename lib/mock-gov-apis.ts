import dataset from "@/data/mock-government.json";
import { getDemoIntents } from "@/lib/demo-transfers";
import { listTaxReviews } from "@/lib/demo-admin";

export type MockPlot = (typeof dataset.plots)[number];

export function findLandPlot(dagNo: string, khatianNo: string): MockPlot | null {
  const dag = dagNo.trim().toUpperCase();
  const khatian = khatianNo.trim().toUpperCase();
  return dataset.plots.find((plot) => plot.dagNo === dag && plot.khatianNo === khatian) ?? null;
}

export function getDataSyncHealthScore(plot: MockPlot): { score: number; label: string; warning: string | null } {
  const deedsWithMutation = plot.deeds.filter((deed) => deed.mutationRecordedAt).length;
  const totalDeeds = plot.deeds.length;
  const score = totalDeeds === 0 ? 100 : Math.round((deedsWithMutation / totalDeeds) * 100);
  return {
    score,
    label: score >= 90 ? "Synchronized" : score >= 60 ? "Review recommended" : "High lag detected",
    warning: score < 100 ? "A Sub-Registry deed has no corresponding AC Land mutation timestamp." : null
  };
}

export function getLandHealthReport(dagNo: string, khatianNo: string) {
  const plot = findLandPlot(dagNo, khatianNo);
  if (!plot) return null;
  const activeIntents = plot.activeIntents.filter((intent) =>
    intent.status !== "VETOED" && (intent.status === "APPROVED" || new Date(intent.vetoDeadline).getTime() >= Date.now())
  );
  const demoIntents = getDemoIntents(plot.dagNo, plot.khatianNo).filter((intent) =>
    intent.status !== "VETOED" && (intent.status === "APPROVED" || new Date(intent.vetoDeadline).getTime() >= Date.now())
  );
  const reviewedTaxes = listTaxReviews().filter((review) => review.dagNo === plot.dagNo);
  return {
    parcel: { dagNo: plot.dagNo, khatianNo: plot.khatianNo, district: plot.district, upazila: plot.upazila },
    deed: { deedNo: plot.deedNo, registeredAt: plot.deedRegisteredAt, registryOffice: plot.registryOffice },
    ownership: "Verified owner record",
    mutationStatus: plot.mutationStatus,
    taxRecords: plot.taxRecords.map(({ receiptNo, taxYear, status }) => {
      const review = reviewedTaxes.find((item) => item.receiptNo === receiptNo);
      return { receiptNo, taxYear, status: review?.status ?? status };
    }),
    activeIntents: demoIntents.length ? demoIntents : activeIntents,
    doublePurchaseRisk: plot.mutationStatus === "UNDER_MUTATION" || plot.activeIntents.some((intent) => intent.status === "PENDING"),
    courtCases: plot.courtCases.map(({ caseNo, court, status }) => ({ caseNo, court, status })),
    ownershipHistory: plot.ownershipHistory.map(({ from, source }) => ({ from, source })),
    khasOrAcquisitionStatus: "No synthetic khas or acquisition flag",
    syncHealth: getDataSyncHealthScore(plot),
    generatedAt: new Date().toISOString()
  };
}

export function findLandPlotByIdentifier(identifier: string, value: string) {
  const normalized = value.trim().toUpperCase();
  return dataset.plots.find((plot) => {
    if (identifier === "deed") return plot.deedNo === normalized;
    if (identifier === "tax") return plot.taxRecords.some((record) => record.receiptNo === normalized);
    if (identifier === "dag") return plot.dagNo === normalized;
    return plot.khatianNo === normalized;
  }) ?? null;
}
