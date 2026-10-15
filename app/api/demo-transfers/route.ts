import { NextRequest, NextResponse } from "next/server";
import { confirmDemoIntent, createDemoIntent, getDemoIntents, vetoDemoIntent } from "@/lib/demo-transfers";
import { findLandPlot } from "@/lib/mock-gov-apis";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as {
    action?: "create" | "confirm" | "veto";
    dagNo?: string;
    khatianNo?: string;
    noticeId?: string;
    actor?: "buyer" | "seller";
    otp?: string;
  } | null;
  if (!body?.dagNo || !body.khatianNo || !body.action) {
    return NextResponse.json({ error: "Dag No, Khatian No, and action are required." }, { status: 400 });
  }
  if (!findLandPlot(body.dagNo, body.khatianNo)) {
    return NextResponse.json({ error: "No matching dummy land record was found." }, { status: 404 });
  }
  if (body.action === "create") {
    const existing = getDemoIntents(body.dagNo, body.khatianNo)
      .find((intent) => ["PENDING", "BUYER_CONFIRMED", "SELLER_CONFIRMED"].includes(intent.status) && new Date(intent.vetoDeadline).getTime() >= Date.now());
    if (existing) return NextResponse.json({ error: "An active purchase intent already exists for this parcel.", intent: existing }, { status: 409 });
    return NextResponse.json({ intent: createDemoIntent(body.dagNo, body.khatianNo) }, { status: 201 });
  }
  if (!body.noticeId) return NextResponse.json({ error: "Notice ID is required to block a transfer." }, { status: 400 });
  if (body.action === "confirm") {
    if (!body.actor || !body.otp) return NextResponse.json({ error: "Actor and demo OTP are required." }, { status: 400 });
    const intent = confirmDemoIntent(body.dagNo, body.khatianNo, body.noticeId, body.actor, body.otp);
    if (!intent) return NextResponse.json({ error: "OTP is invalid or the intent is no longer active." }, { status: 401 });
    return NextResponse.json({ intent });
  }
  if (!body.otp) return NextResponse.json({ error: "Demo OTP is required to veto an intent." }, { status: 400 });
  const intent = vetoDemoIntent(body.dagNo, body.khatianNo, body.noticeId, body.otp);
  if (!intent) return NextResponse.json({ error: "The notice is not active or its veto window has expired." }, { status: 409 });
  return NextResponse.json({ intent });
}
