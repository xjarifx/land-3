import { NextRequest, NextResponse } from "next/server";
import { createDemoIntent, vetoDemoIntent } from "@/lib/demo-transfers";
import { findLandPlot } from "@/lib/mock-gov-apis";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as {
    action?: "create" | "veto";
    dagNo?: string;
    khatianNo?: string;
    noticeId?: string;
  } | null;
  if (!body?.dagNo || !body.khatianNo || !body.action) {
    return NextResponse.json({ error: "Dag No, Khatian No, and action are required." }, { status: 400 });
  }
  if (!findLandPlot(body.dagNo, body.khatianNo)) {
    return NextResponse.json({ error: "No matching dummy land record was found." }, { status: 404 });
  }
  if (body.action === "create") {
    return NextResponse.json({ intent: createDemoIntent(body.dagNo, body.khatianNo) }, { status: 201 });
  }
  if (!body.noticeId) return NextResponse.json({ error: "Notice ID is required to block a transfer." }, { status: 400 });
  const intent = vetoDemoIntent(body.dagNo, body.khatianNo, body.noticeId);
  if (!intent) return NextResponse.json({ error: "The notice is not active or its veto window has expired." }, { status: 409 });
  return NextResponse.json({ intent });
}
