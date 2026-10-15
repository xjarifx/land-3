import { PrismaClient, LandStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.upsert({
    where: { nid: "1987654321098" },
    update: {},
    create: { nid: "1987654321098", name: "Md. Rahman", mobile: "01700000000", role: UserRole.LAND_OWNER }
  });
  const plot = await prisma.landPlot.upsert({
    where: { district_upazila_dagNo_khatianNo: { district: "Dhaka", upazila: "Savar", dagNo: "D-1042", khatianNo: "K-7781" } },
    update: {},
    create: { dagNo: "D-1042", khatianNo: "K-7781", district: "Dhaka", upazila: "Savar", currentOwnerNid: owner.nid, status: LandStatus.CLEAR }
  });
  await prisma.deedRecord.upsert({
    where: { deedNo: "DEED-2021-00491" },
    update: {},
    create: { deedNo: "DEED-2021-00491", landPlotId: plot.id, registryOffice: "Savar Sub-Registry Office", sellerNid: "1970000000000", buyerNid: owner.nid, executedAt: new Date("2021-04-18"), mutationSyncedAt: new Date("2021-08-02") }
  });
}

main().finally(() => prisma.$disconnect());
