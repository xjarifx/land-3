import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listTaxReviews, reviewTaxReceipt } from "@/lib/demo-admin";

const schema = z.object({
  receiptNo: z.string().min(1),
  status: z.enum(["VERIFIED", "REJECTED"]),
  reason: z.string().max(500).optional()
});

export async function GET() {
  return NextResponse.json({ reviews: listTaxReviews() });
}

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Receipt number and a valid review status are required." }, { status: 400 });
  if (parsed.data.status === "REJECTED" && !parsed.data.reason?.trim()) {
    return NextResponse.json({ error: "A rejection reason is required." }, { status: 400 });
  }
  const review = reviewTaxReceipt(parsed.data.receiptNo, parsed.data.status, parsed.data.reason);
  if (!review) return NextResponse.json({ error: "Tax receipt was not found." }, { status: 404 });
  return NextResponse.json({ review });
}
