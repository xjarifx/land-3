import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAuditHash } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { issueOtp, verifyOtp } from "@/lib/otp";

const requestSchema = z.object({
  action: z.enum(["create", "confirm", "veto"]),
  landPlotId: z.string().min(1),
  buyerNid: z.string().regex(/^\d{10,17}$/),
  sellerNid: z.string().regex(/^\d{10,17}$/),
  buyerMobile: z.string().min(10),
  sellerMobile: z.string().min(10),
  otp: z.string().regex(/^\d{6}$/).optional(),
  actor: z.enum(["buyer", "seller"]).optional()
});

export async function POST(request: NextRequest) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid transfer request.", details: parsed.error.flatten() }, { status: 400 });
  const input = parsed.data;

  if (input.action === "create") {
    const plot = await prisma.landPlot.findUnique({ where: { id: input.landPlotId } });
    if (!plot || plot.currentOwnerNid !== input.sellerNid) return NextResponse.json({ error: "Seller is not the registered current owner." }, { status: 403 });
    const existing = await prisma.pendingTransferNotice.findFirst({
      where: { landPlotId: plot.id, status: { in: ["PENDING", "BUYER_CONFIRMED", "SELLER_CONFIRMED"] } }
    });
    if (existing) return NextResponse.json({ error: "An active transfer notice already exists for this parcel.", noticeId: existing.id }, { status: 409 });
    const vetoDeadline = new Date(Date.now() + Number(process.env.VETO_WINDOW_HOURS ?? 24) * 60 * 60 * 1000);
    const notice = await prisma.pendingTransferNotice.create({
      data: {
        landPlotId: plot.id, buyerNid: input.buyerNid, sellerNid: input.sellerNid,
        buyerMobile: input.buyerMobile, sellerMobile: input.sellerMobile, vetoDeadline,
        auditHash: createAuditHash({ plotId: plot.id, buyerNid: input.buyerNid, sellerNid: input.sellerNid, createdAt: new Date().toISOString() })
      }
    });
    const [buyerOtp, sellerOtp] = await Promise.all([issueOtp(`transfer:${notice.id}:buyer`), issueOtp(`transfer:${notice.id}:seller`)]);
    return NextResponse.json({ noticeId: notice.id, status: notice.status, vetoDeadline, message: "Both parties must confirm with OTP. Demo OTPs are returned only outside production.", demoOtps: process.env.NODE_ENV === "production" ? undefined : { buyerOtp, sellerOtp } }, { status: 201 });
  }

  if (!input.actor || !input.otp) return NextResponse.json({ error: "Actor and OTP are required." }, { status: 400 });
  const notice = await prisma.pendingTransferNotice.findFirst({ where: { landPlotId: input.landPlotId, buyerNid: input.buyerNid, sellerNid: input.sellerNid, status: { in: ["PENDING", "BUYER_CONFIRMED", "SELLER_CONFIRMED"] } }, orderBy: { createdAt: "desc" } });
  if (!notice) return NextResponse.json({ error: "No active transfer notice found." }, { status: 404 });
  if (input.action === "veto") {
    if (new Date() > notice.vetoDeadline) return NextResponse.json({ error: "The veto window has expired." }, { status: 409 });
    const valid = await verifyOtp(`transfer:${notice.id}:${input.actor}`, input.otp);
    if (!valid) return NextResponse.json({ error: "OTP is invalid or expired." }, { status: 401 });
    const updated = await prisma.pendingTransferNotice.update({ where: { id: notice.id }, data: { status: "VETOED", auditHash: createAuditHash({ noticeId: notice.id, event: "VETOED", timestamp: new Date().toISOString() }) } });
    return NextResponse.json({ noticeId: updated.id, status: updated.status });
  }
  const valid = await verifyOtp(`transfer:${notice.id}:${input.actor}`, input.otp);
  if (!valid) return NextResponse.json({ error: "OTP is invalid or expired." }, { status: 401 });
  const update = input.actor === "buyer" ? { buyerConfirmedAt: new Date() } : { sellerConfirmedAt: new Date() };
  const updated = await prisma.pendingTransferNotice.update({ where: { id: notice.id }, data: update });
  const approved = Boolean(updated.buyerConfirmedAt && updated.sellerConfirmedAt);
  const final = approved ? await prisma.pendingTransferNotice.update({ where: { id: notice.id }, data: { status: "APPROVED", auditHash: createAuditHash({ noticeId: notice.id, event: "APPROVED", timestamp: new Date().toISOString() }) } }) : updated;
  return NextResponse.json({ noticeId: final.id, status: final.status, vetoDeadline: final.vetoDeadline });
}
