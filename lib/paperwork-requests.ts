import { createAuditHash } from "@/lib/audit";

export type PaperworkRequest = {
  id: string;
  dagNo: string;
  khatianNo: string;
  requestedDocuments: string[];
  note: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  reviewedAt: string | null;
  reviewReason: string | null;
  auditHash: string;
};

const state = globalThis as typeof globalThis & { landGuardPaperworkRequests?: PaperworkRequest[] };
const requests = state.landGuardPaperworkRequests ?? [];
state.landGuardPaperworkRequests = requests;

export function listPaperworkRequests() {
  return requests;
}

export function createPaperworkRequest(dagNo: string, khatianNo: string, note: string) {
  const createdAt = new Date().toISOString();
  const id = `REQ-${Date.now()}`;
  const request: PaperworkRequest = {
    id,
    dagNo: dagNo.trim().toUpperCase(),
    khatianNo: khatianNo.trim().toUpperCase(),
    requestedDocuments: ["Registered deed", "Mutation / Namjari", "Khatian", "Land tax"],
    note: note.trim(),
    status: "PENDING",
    createdAt,
    reviewedAt: null,
    reviewReason: null,
    auditHash: createAuditHash({ id, event: "REQUESTED", createdAt })
  };
  requests.unshift(request);
  return request;
}

export function reviewPaperworkRequest(id: string, status: "APPROVED" | "REJECTED", reason?: string) {
  const request = requests.find((item) => item.id === id);
  if (!request || request.status !== "PENDING") return null;
  const reviewedAt = new Date().toISOString();
  request.status = status;
  request.reviewedAt = reviewedAt;
  request.reviewReason = status === "REJECTED" ? reason?.trim() || "Request needs more supporting information." : null;
  request.auditHash = createAuditHash({ id, event: status, reviewedAt, reason: request.reviewReason });
  return request;
}
