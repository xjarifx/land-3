import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { findLandPlotByIdentifier, getLandHealthReport } from "@/lib/mock-gov-apis";

const querySchema = z.object({
  identifier: z.enum(["deed", "tax", "dag", "khatian"]),
  value: z.string().min(1)
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    identifier: request.nextUrl.searchParams.get("identifier"),
    value: request.nextUrl.searchParams.get("value")
  });
  if (!parsed.success) return NextResponse.json({ error: "Choose a search type and enter its identifier." }, { status: 400 });
  const plot = findLandPlotByIdentifier(parsed.data.identifier, parsed.data.value);
  const report = plot ? getLandHealthReport(plot.dagNo, plot.khatianNo) : null;
  if (!report) return NextResponse.json({ error: "No matching record was found in the dummy government dataset." }, { status: 404 });
  return NextResponse.json(report);
}
