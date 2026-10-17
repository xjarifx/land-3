import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPaperworkRequest, listPaperworkRequests, reviewPaperworkRequest } from "@/lib/paperwork-requests";

const requestSchema = z.object({
  dagNo: z.string().min(1),
  khatianNo: z.string().min(1),
  note: z.string().trim().min(5).max(500)
});
const reviewSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED"]),
  reason: z.string().max(500).optional()
});

function isAdmin(request: NextRequest) {
  const key = process.env.DEMO_ADMIN_KEY ?? (process.env.NODE_ENV === "production" ? undefined : "landguard-demo-admin");
  return Boolean(key) && request.headers.get("x-demo-admin-key") === key;
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: "Admin authentication is required." }, { status: 401 });
  return NextResponse.json({ requests: listPaperworkRequests() });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (body && typeof body === "object" && "status" in body) {
    if (!isAdmin(request)) return NextResponse.json({ error: "Admin authentication is required." }, { status: 401 });
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success || parsed.data.status === "REJECTED" && !parsed.data.reason?.trim()) {
      return NextResponse.json({ error: "A review status and rejection reason are required." }, { status: 400 });
    }
    const reviewed = reviewPaperworkRequest(parsed.data.id, parsed.data.status, parsed.data.reason);
    return reviewed ? NextResponse.json({ request: reviewed }) : NextResponse.json({ error: "Pending request was not found." }, { status: 404 });
  }
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dag, Khatian, and a short review note are required." }, { status: 400 });
  return NextResponse.json({ request: createPaperworkRequest(parsed.data.dagNo, parsed.data.khatianNo, parsed.data.note) }, { status: 201 });
}
