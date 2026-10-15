import dataset from "@/data/mock-government.json";
import { createAuditHash } from "@/lib/audit";

export type TaxReviewStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type TaxReview = {
  receiptNo: string;
  dagNo: string;
  khatianNo: string;
  district: string;
  taxYear: string;
  status: TaxReviewStatus;
  reviewedAt: string | null;
  reviewer: string | null;
  reason: string | null;
  auditHash: string | null;
};

const state = globalThis as typeof globalThis & { landGuardTaxReviews?: TaxReview[] };
const reviews: TaxReview[] = state.landGuardTaxReviews ?? dataset.plots.flatMap((plot) =>
  plot.taxRecords.map((record) => ({
    receiptNo: record.receiptNo,
    dagNo: plot.dagNo,
    khatianNo: plot.khatianNo,
    district: plot.district,
    taxYear: record.taxYear,
    status: record.status as TaxReviewStatus,
    reviewedAt: record.reviewedAt,
    reviewer: record.status === "VERIFIED" ? "admin.demo" : null,
    reason: null,
    auditHash: record.reviewedAt ? createAuditHash({ receiptNo: record.receiptNo, status: record.status, reviewedAt: record.reviewedAt }) : null
  }))
);
state.landGuardTaxReviews = reviews;

export function listTaxReviews() {
  return reviews;
}

export function reviewTaxReceipt(receiptNo: string, status: Exclude<TaxReviewStatus, "PENDING">, reason?: string) {
  const review = reviews.find((item) => item.receiptNo === receiptNo);
  if (!review) return null;
  const reviewedAt = new Date().toISOString();
  review.status = status;
  review.reviewedAt = reviewedAt;
  review.reviewer = "admin.demo";
  review.reason = status === "REJECTED" ? reason?.trim() || "Rejected during administrative review." : null;
  review.auditHash = createAuditHash({ receiptNo, status, reviewedAt, reviewer: review.reviewer, reason: review.reason });
  return review;
}
